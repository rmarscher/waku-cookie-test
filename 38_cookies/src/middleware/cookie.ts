import * as cookie from 'cookie';

import type { Middleware } from 'waku/config';

// XXX we would probably like to extend config.
const COOKIE_OPTS = {};

const cookieMiddleware: Middleware = () => {
  return async (ctx, next) => {
    const pathname = ctx.req.url.pathname;
    if (pathname.startsWith('/src') || pathname.startsWith('/favicon.') || pathname.startsWith('/@') || pathname.startsWith('/node_modules') || pathname.startsWith('/images')) {
      // dev server stuff
      // is there a better way to filter these requests out of middleware?
      return await next();
    }
    const cookies = cookie.parse(ctx.req.headers.cookie || '');
    ctx.data.count = Number(cookies.count) || 0;
    await next();
    console.log("post next", ctx.req.url.toString());
    ctx.res.headers ||= {};
    let origSetCookie = ctx.res.headers['set-cookie'] || ([] as string[]);
    if (typeof origSetCookie === 'string') {
      origSetCookie = [origSetCookie];
    }
    ctx.res.headers['set-cookie'] = [
      ...origSetCookie,
      cookie.serialize('count', String(ctx.data.count), COOKIE_OPTS),
    ];
  };
};

export default cookieMiddleware;
