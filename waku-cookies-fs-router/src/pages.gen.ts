import type { PathsForPages, GetConfigResponse } from 'waku/router';

import type { getConfig as Root_getConfig } from './pages/_root';

type Page =
| ({path: '/_root'} & GetConfigResponse<typeof Root_getConfig>)
| {path: '/'; render: 'dynamic'}
;

  declare module 'waku/router' {
    interface RouteConfig {
      paths: PathsForPages<Page>;
    }
    interface CreatePagesConfig {
      pages: Page;
    }
  }
  