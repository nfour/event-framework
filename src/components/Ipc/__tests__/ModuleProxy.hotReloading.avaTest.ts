import test from 'ava';
import { delay } from 'bluebird';
import { copy, emptyDir, mkdirp, readFileSync, writeFile } from 'fs-extra';
import { resolve } from 'path';

import { ModuleProxy } from '../ModuleProxy';

const stagingDir = resolve(__dirname, 'modules/staging');
const fixturesDir = resolve(__dirname, 'modules/fixtures');
const components: ModuleProxy[] = [];
const originalFooFile = readFileSync(resolve(fixturesDir, 'foo.ts'), 'utf8');

test.after(() => {
  components.forEach((component) => component.teardown());
});

test.before(async () => {
  await mkdirp(stagingDir);
  await emptyDir(stagingDir);
});

test('can modify an imported module and have its changes reflected', async (t) => {
  const targetFilePath = resolve(stagingDir, './foo.ts');
  await writeFile(targetFilePath, originalFooFile);

  const foo = await new ModuleProxy({
    fork: false,
    name: 'foo',
    type: 'function-action-module',
    module: {
      path: targetFilePath,
      member: 'foo',
      watch: true,
    },
  }).initialize();

  components.push(foo);

  t.is(await foo.emit('execute'), 1);

  const modifiedFooFile = originalFooFile.replace(/1/, '2');

  await writeFile(targetFilePath, modifiedFooFile);

  await delay(200);

  t.is(await foo.emit('execute'), 2);
});

test('should reload 5 times concecutively', async (t) => {
  const targetFilePath = resolve(stagingDir, './baz.ts');
  await writeFile(targetFilePath, originalFooFile);

  const foo = await new ModuleProxy({
    fork: false,
    name: 'foo',
    type: 'function-action-module',
    module: {
      path: targetFilePath,
      member: 'foo',
      watch: true,
    },
  }).initialize();

  components.push(foo);

  for (const n of [2, 3, 4, 5, 6]) {
    await writeFile(targetFilePath, originalFooFile.replace(/\d/, String(n)));

    await delay(200); // Wait for the file to emit the change even etc.

    t.is(await foo.emit('execute'), n);
  }
});

test('should reload dependent imports for a provided component', async (t) => {
  const depOfEntry = readFileSync(resolve(fixturesDir, 'deep/depOfEntry.ts'), 'utf8');
  const depOfDep = readFileSync(resolve(fixturesDir, 'deep/depOfDep.ts'), 'utf8');

  await copy(resolve(fixturesDir, 'deep'), resolve(stagingDir, 'deep'));

  const entryPath = resolve(stagingDir, './deep/entry.ts');
  const depOfEntryPath = resolve(stagingDir, './deep/depOfEntry.ts');
  const depOfDepPath = resolve(stagingDir, './deep/depOfDep.ts');

  const foo = await new ModuleProxy({
    fork: false,
    name: 'foo',
    type: 'function-action-module',
    module: {
      path: entryPath,
      member: 'foo',
      watch: true,
    },
  }).initialize();

  components.push(foo);

  // Ensure things are setup correctly
  t.is(await foo.emit('execute'), 1);

  await writeFile(depOfEntryPath, depOfEntry.replace(/\d/, '2'));
  await delay(200);

  t.is(await foo.emit('execute'), 2);

  await writeFile(depOfDepPath, depOfDep.replace(/\d/, '2'));
  await delay(200);

  t.is(await foo.emit('execute'), 4);
});

test.todo('file with a .js or .ts extension will reload when not provided an extension');
