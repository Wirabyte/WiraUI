import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { copyClaudeSkill, ownVersion } from '../utils/claude-skill';
import { ClaudeSkillOptions } from './schema';

/**
 * `ng g @wirabyte/ui:claude-skill`: writes the WiraUI skill for Claude Code into `.claude/skills/wiraui`, or replaces
 * the copy an earlier release left there. Run it again after updating `@wirabyte/ui`, so the skill describes the
 * installed components.
 */
export function claudeSkill(options: ClaudeSkillOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const done = copyClaudeSkill(tree, options.releaseVersion || ownVersion());
    if (!done) throw new SchematicsException('The WiraUI skill files are missing from this @wirabyte/ui package.');
    context.logger.info('  ✔ ' + done);
  };
}
