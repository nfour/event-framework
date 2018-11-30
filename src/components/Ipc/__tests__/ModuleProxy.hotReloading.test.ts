import { delay } from 'bluebird';
import { readFileSync } from 'fs';
import { emptyDir, mkdirp, writeFile } from 'fs-extra';
import { resolve } from 'path';

import { ModuleProxy } from '../ModuleProxy';

const stagingDir = resolve(__dirname, 'modules/staging');
const components: ModuleProxy[] = [];

afterAll(() => {
  components.forEach((component) => component.teardown());
});

it('can modify an imported module and have its changes reflected', async () => {
  await prepareStagingDir();

  const originalFooFile = readFileSync(resolve(__dirname, './modules/fixtures/foo.ts'), 'utf8');
  const targetFilePath = resolve(stagingDir, './foo.ts');

  await writeFile(targetFilePath, originalFooFile);

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

  const result = await fooProxy.emit('execute', 1);

  console.log({ result });

  expect(result).toBe(2);

  const modifiedFooFile = originalFooFile.replace(/1/, '2');

  await writeFile(targetFilePath, modifiedFooFile);

  await delay(500); // Wait for the file to be saved etc.

  const result2 = await fooProxy.emit('execute', 1);

  expect(result2).toBe(3);
});

async function prepareStagingDir () {
  await mkdirp(stagingDir);
  await emptyDir(stagingDir);
}
