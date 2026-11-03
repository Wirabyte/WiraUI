import { Routes } from '@angular/router';
import { provideWiraUI } from '@wirabyte/ui/config';
import { THEME_LANDING } from '../versions/v3/theme-v3';
import { DocsNotFound } from './not-found';

/** Any address outside /v1, /v2 and /v3 the site does not know: the 404 page on its own, in the landing page's look. */
export const NOT_FOUND_ROUTES: Routes = [
  { path: '', component: DocsNotFound, data: { standalone: true, notFound: true }, providers: [provideWiraUI({ locale: 'th', calendar: 'buddhist' }), THEME_LANDING] },
];
