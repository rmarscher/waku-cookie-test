import type { ReactNode } from "react";

export default async function RootElement({ children }: { children: ReactNode }) {
  console.log("in RootElement render");
  // await (new Promise((resolve) => setTimeout(resolve, 1000)));
  // console.log("in RootElement render after sleep");
  return (
    <html lang="en">
      {/* <head></head> */}
      <body data-version="1.0">{children}</body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};
