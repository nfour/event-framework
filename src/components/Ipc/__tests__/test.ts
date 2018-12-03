import { delay } from 'bluebird';
import * as expect from 'expect';
import { emptyDir, mkdirp, readFileSync, writeFile } from 'fs-extra';
import { resolve } from 'path';

import { ModuleProxy } from '../ModuleProxy';

const stagingDir = resolve(__dirname, 'modules/staging');
const components: ModuleProxy[] = [];

void (async () => {
  await prepareStagingDir();

  const originalFooFile = readFileSync(resolve(__dirname, './modules/fixtures/foo.ts'), 'utf8');
  const targetFilePath = resolve(stagingDir, './foo.ts');

  await writeFile(targetFilePath, originalFooFile);
  await delay(40); // Wait for the file to be saved etc.

  const fooProxy = new ModuleProxy({
    fork: false,
    name: 'foo',
    type: 'function-action-module',
    module: {
      path: targetFilePath,
      member: 'foo',
    },
  });

  components.push(fooProxy);

  await fooProxy.initialize();

  expect(await fooProxy.emit('execute')).toBe(1);

  const modifiedFooFile = originalFooFile.replace(/1/, '2');

  await writeFile(targetFilePath, modifiedFooFile);

  expect(
   await fooProxy.emit('execute'),
  ).toBe(2);
})();

async function prepareStagingDir () {
  await mkdirp(stagingDir);
  await emptyDir(stagingDir);
}
