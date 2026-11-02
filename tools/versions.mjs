// Single source of truth for which Angular majors each wiraui major accepts.
// `max` is exclusive; `null` means no upper limit. v3 takes every newer Angular major: CI runs `ng add` on Angular
// 22 and on the latest release, so a major that breaks it shows up there.
export const VERSIONS = {
  v1: { major: 1, min: 15, max: 18 },
  v2: { major: 2, min: 18, max: 21 },
  v3: { major: 3, min: 21, max: null },
};

export function peerRange({ min, max }) {
  return max === null ? `>=${min}.0.0` : `>=${min}.0.0 <${max}.0.0`;
}
