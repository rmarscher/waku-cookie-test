This repository is exploring a potential issue with fs router in Waku v0.21.9.

The Waku v0.21.9 fs router middleware completes before the page server component resolves promises in the render function.

The 38_cookies example (copied from the waku github repository) uses the minimal client which waits for the server component render promise.

There must be something different with how renderHtml is being run.

I edited 38_cookies to move updating data.count to after the promise where it loads the items JSON. It still works fine. It does not continue the middleware until the promise has resolved and data.count is updated.

I then copied that example to waku-cookies-fs-router and updated it to use a fs router page instead of the minimal client.

I also tried using a custom _root.tsx with a dynamic render config in case that is the cause of it returning the body stream early. But it seems to have the same behavior.

```sh
diff -r --exclude=node_modules --exclude=package-lock.json 38_cookies/package.json waku-cookies-fs-router/package.json
2,3c2,3
<   "name": "38_cookies",
<   "version": "0.1.0",
---
>   "name": "waku-cookies-fs-router",
>   "version": "0.0.0",
Only in 38_cookies/src: entries.tsx
Only in 38_cookies/src: main.tsx
Only in waku-cookies-fs-router/src: pages
Only in waku-cookies-fs-router/src: pages.gen.ts
```

Clone this repository, then navigate into each directory, run `npm i` and `npm run dev`. You should see output in the console. For 38_cookies, it is:

```txt
post read
post next http://localhost:3000/
```

For waku-cookies-fs-router, it is:

```txt
post next http://localhost:3000/
post read
```

Actually... after editing the data load to happen inside the server component for 38_cookies, it has the same exact behavior. OK. So this isn't a difference between fs router and minimal client. It's a difference between waku/middleware/rsc + waku/middleware/ssr and the new waku/middleware/handler.

UPDATE 2024-12-18: Applying https://github.com/dai-shi/waku/pull/1078 gets everything working. Patches have been added to the examples here. Navigate into each directory and run `patch -p1 < patches/waku@0.21.9.patch` to apply the patch and `patch -R -p1 < patches/waku@0.21.9.patch` to reverse it.
