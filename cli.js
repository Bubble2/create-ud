#!/usr/bin/env node

const yParser = require('yargs-parser');
const semver = require('semver');
const chalk = require('chalk');
const run = require('./lib/run');


const args = yParser(process.argv.slice(2));

if (!semver.satisfies(process.version, '>= 14.19.0')) {
  console.error(chalk.red('✘ The generator will only work with Node v14.19.0 and up!'));
  process.exit(1);
}

const name = args._[0] || '';

(async () => {
  await run({
    name
  });
  process.exit(0);
})();
