import { SchematicsException } from '@angular-devkit/schematics';
// Resolved from the app at run time, so it is the app's own TypeScript (4.8+ for Angular 15).
import * as ts from 'typescript';

export interface Edit {
  pos: number;
  text: string;
}

export function parse(path: string, content: string): ts.SourceFile {
  return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
}

function nameOf(p: ts.ObjectLiteralElementLike): string | undefined {
  if (!p.name) return undefined;
  if (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) return p.name.text;
  return undefined;
}

/** `import { symbol } from 'from'`, merged into an existing import of the same module when there is one. */
export function importEdit(sf: ts.SourceFile, symbol: string, from: string): Edit | null {
  const imports = sf.statements.filter(ts.isImportDeclaration);
  for (const st of imports) {
    if (!ts.isStringLiteral(st.moduleSpecifier) || st.moduleSpecifier.text !== from) continue;
    const nb = st.importClause && st.importClause.namedBindings;
    if (nb && ts.isNamedImports(nb)) {
      if (nb.elements.some((e) => e.name.text === symbol)) return null;
      const last = nb.elements[nb.elements.length - 1];
      return { pos: last.getEnd(), text: `, ${symbol}` };
    }
  }
  const pos = imports.length ? imports[imports.length - 1].getEnd() : 0;
  const line = `import { ${symbol} } from '${from}';`;
  return pos ? { pos, text: '\n' + line } : { pos: 0, text: line + '\n' };
}

/** Object literal passed to `@NgModule({...})` on the class named `className` (or the first NgModule). */
export function findNgModuleObject(sf: ts.SourceFile, className?: string): ts.ObjectLiteralExpression | null {
  let found: ts.ObjectLiteralExpression | null = null;
  const visit = (node: ts.Node) => {
    if (found) return;
    if (ts.isClassDeclaration(node) && (!className || (node.name && node.name.text === className))) {
      const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) || [] : [];
      for (const d of decorators) {
        const call = d.expression;
        if (ts.isCallExpression(call) && ts.isIdentifier(call.expression) && call.expression.text === 'NgModule') {
          const arg = call.arguments[0];
          if (arg && ts.isObjectLiteralExpression(arg)) found = arg;
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

/** Initializer of `export const <name> = {...}` (or the first exported object typed ApplicationConfig). */
export function findConfigObject(sf: ts.SourceFile, name?: string): ts.ObjectLiteralExpression | null {
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const d of st.declarationList.declarations) {
      if (!d.initializer || !ts.isObjectLiteralExpression(d.initializer) || !ts.isIdentifier(d.name)) continue;
      const typed = d.type && d.type.getText(sf) === 'ApplicationConfig';
      if (name ? d.name.text === name : typed) return d.initializer;
    }
  }
  return null;
}

/** `bootstrapApplication(App, {...})`: the inline options object, when there is one. */
export function findBootstrapOptions(sf: ts.SourceFile): ts.Expression | null {
  let found: ts.Expression | null = null;
  const visit = (node: ts.Node) => {
    if (found) return;
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'bootstrapApplication') {
      found = node.arguments[1] || null;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

/** First argument of `.bootstrapModule(X)` and the module path it is imported from. */
export function findBootstrapModule(sf: ts.SourceFile): { name: string; from: string } | null {
  let name: string | null = null;
  const visit = (node: ts.Node) => {
    if (name) return;
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'bootstrapModule' &&
      node.arguments[0] &&
      ts.isIdentifier(node.arguments[0])
    ) {
      name = (node.arguments[0] as ts.Identifier).text;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!name) return null;
  const from = importPathOf(sf, name);
  return from ? { name, from } : null;
}

/** Module specifier a symbol is imported from. */
export function importPathOf(sf: ts.SourceFile, symbol: string): string | null {
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) continue;
    const nb = st.importClause && st.importClause.namedBindings;
    if (nb && ts.isNamedImports(nb) && nb.elements.some((e) => e.name.text === symbol)) return st.moduleSpecifier.text;
  }
  return null;
}

/** Adds `text` to the object's `providers` array, creating the property when missing. */
export function providersEdit(obj: ts.ObjectLiteralExpression, text: string): Edit {
  const prop = obj.properties.find((p) => nameOf(p) === 'providers');
  if (prop) {
    if (!ts.isPropertyAssignment(prop) || !ts.isArrayLiteralExpression(prop.initializer)) {
      throw new SchematicsException('`providers` is not an array literal. Add provideWiraUI() to it by hand.');
    }
    const arr = prop.initializer;
    if (!arr.elements.length) return { pos: arr.getStart() + 1, text };
    const last = arr.elements[arr.elements.length - 1];
    const sf = arr.getSourceFile();
    const oneLine = sf.getLineAndCharacterOfPosition(arr.getStart()).line === sf.getLineAndCharacterOfPosition(arr.getEnd()).line;
    if (oneLine) return { pos: last.getEnd(), text: `, ${text}` };
    return arr.elements.hasTrailingComma
      ? { pos: last.getEnd() + 1, text: `\n    ${text},` }
      : { pos: last.getEnd(), text: `,\n    ${text}` };
  }
  if (!obj.properties.length) return { pos: obj.getStart() + 1, text: `\n  providers: [${text}],\n` };
  const last = obj.properties[obj.properties.length - 1];
  return obj.properties.hasTrailingComma
    ? { pos: last.getEnd() + 1, text: `\n  providers: [${text}],` }
    : { pos: last.getEnd(), text: `,\n  providers: [${text}]` };
}
