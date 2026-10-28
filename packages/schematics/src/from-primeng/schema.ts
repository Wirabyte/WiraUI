export interface FromPrimeNgOptions {
  /** Folder to migrate. Default: the whole workspace. */
  path?: string;
  /** Rename `<p-…>` tags in templates too. Default true. */
  templates?: boolean;
}
