import { delay } from 'bluebird';
import { emptyDir, mkdirp, readFile, readFileSync, writeFile } from 'fs-extra';
import { resolve } from 'path';

import { ModuleProxy } from '../ModuleProxy';

const stagingDir = resolve(__dirname, 'modules/staging');
const components: ModuleProxy[] = [];
let interval;

afterAll(() => {
  components.forEach((component) => component.teardown());
  clearInterval(interval);
});

it('can modify an imported module and have its changes reflected', async () => {
  let i = 1;
  interval = setInterval(() => console.log(++i), 50);

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

  await delay(100);

  expect(await fooProxy.emit('execute')).toBe(1);

  const modifiedFooFile = originalFooFile.replace(/1/, '2');

  await writeFile(targetFilePath, modifiedFooFile);

  console.log(Date.now(), 'testing');
  expect(
  await fooProxy.emit('execute'),
  ).toBe(2);
  console.log(Date.now(), 'tested');

});

it('should reload many times (5)', () => {});

async function prepareStagingDir () {
  await mkdirp(stagingDir);
  await emptyDir(stagingDir);
}
