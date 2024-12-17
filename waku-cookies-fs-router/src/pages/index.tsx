import { getContextData } from "waku/middleware/context";
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import App from "../components/App";
import { fileURLToPath } from "node:url";

export const HomePage: React.FC = async () => {
  const data = getContextData() as { count?: number };
  const items = JSON.parse(
    await fsPromises.readFile(
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../private/items.json',
      ),
      'utf8',
    ),
  );
  data.count = (data.count || 0) + 1;
  console.log("post read");
  return <App name={'Waku'} items={items} />;
};

export default HomePage;
