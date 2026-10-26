import { InjectionToken } from '@angular/core';

/**
 * True inside the WiraTheme Studio's preview, where a component page shows only its live demos: no page header or
 * tabs (DocsComponentPage) and no code under the demos (DocsDemo). Elsewhere it is not provided.
 */
export const DOCS_PREVIEW = new InjectionToken<boolean>('DOCS_PREVIEW');
