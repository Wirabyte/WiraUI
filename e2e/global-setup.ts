import { rmSync } from 'node:fs';
import { join } from 'node:path';

/** Baselines are produced fresh by v3 on every run, so a stale image never hides a v1/v2 difference. */
export default function globalSetup(): void {
  rmSync(join(__dirname, 'tests', '__screenshots__'), { recursive: true, force: true });
}
