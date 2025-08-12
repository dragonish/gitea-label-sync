import fs from 'node:fs';
import { exit } from 'node:process';

try {
  const data = fs.readFileSync('./package.json', 'utf-8');
  const sourcePackage = JSON.parse(data);

  const publishPackage = JSON.stringify(
    sourcePackage,
    (key, value) => {
      if (!['scripts', 'publishConfig', 'packageManager'].includes(key)) {
        return value;
      } else {
        return undefined;
      }
    },
    2
  );

  fs.writeFileSync('publish/package.json', publishPackage);
} catch (err) {
  console.error(err);
  exit(1);
}
