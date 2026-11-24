import { Tree } from '@angular-devkit/schematics';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

// node_modules/@wirabyte/ui/schematics/utils/claude-skill.cjs → schematics/claude-skill (copied there by scripts/copy-assets.mjs)
const SKILL_SRC = join(__dirname, '..', 'claude-skill');
export const SKILL_DEST = '.claude/skills/wiraui';
/** The version SKILL.md carries in the repo; the copy in an app names the release it came from instead. */
export const SKILL_VERSION_PLACEHOLDER = '@wirabyte/ui 0.0.0';

/** Version of the `@wirabyte/ui` this schematic shipped in. */
export function ownVersion(): string | undefined {
  try {
    // node_modules/@wirabyte/ui/schematics/utils/claude-skill.cjs → node_modules/@wirabyte/ui/package.json
    return require('../../package.json').version;
  } catch (e) {
    return undefined;
  }
}

/**
 * Copies the WiraUI skill for Claude Code into the workspace. The folder belongs to WiraUI, so a second run replaces
 * all of it with this release's copy: edited files come back and files an older release had go away.
 */
export function copyClaudeSkill(tree: Tree, version: string | undefined): string {
  if (!existsSync(SKILL_SRC)) return '';
  const updating = tree.exists(`${SKILL_DEST}/SKILL.md`);
  const old = new Set<string>();
  tree.getDir(SKILL_DEST).visit((path) => {
    old.add(path.replace(/^\//, ''));
  });
  (function copy(dir: string, rel: string): void {
    for (const name of readdirSync(dir)) {
      const from = join(dir, name);
      const to = `${rel}/${name}`;
      if (statSync(from).isDirectory()) {
        copy(from, to);
        continue;
      }
      let content: Buffer | string = readFileSync(from);
      if (to === `${SKILL_DEST}/SKILL.md` && version) {
        content = content.toString('utf8').replace(SKILL_VERSION_PLACEHOLDER, `@wirabyte/ui ${version}`);
      }
      if (old.delete(to)) tree.overwrite(to, content);
      else tree.create(to, content);
    }
  })(SKILL_SRC, SKILL_DEST);
  for (const stale of old) tree.delete(stale);
  return `${updating ? 'updated' : 'created'} ${SKILL_DEST}/ (WiraUI skill for Claude Code${version ? `, from ${version}` : ''}; commit it to share with the team)`;
}
