// Single source of truth for which Angular majors each wiratheme major accepts.
// `max` is exclusive. Widen v3's `max` only after CI passes on the new Angular major.
export const VERSIONS = {
  v1: { major: 1, min: 15, max: 18 },
  v2: { major: 2, min: 18, max: 21 },
  v3: { major: 3, min: 21, max: 22 },
};

export function peerRange({ min, max }) {
  return max === null ? `>=${min}.0.0` : `>=${min}.0.0 <${max}.0.0`;
}
