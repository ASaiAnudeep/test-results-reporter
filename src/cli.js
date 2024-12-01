#!/usr/bin/env node
require('dotenv').config();
const pkg = require('../package.json')

const sade = require('sade');

const prog = sade('testbeats');
const { PublishCommand } = require('./commands/publish.command');
const { ConfigCommand } = require('./commands/generate.config.command');
const logger = require('./utils/logger');

prog
  .version(pkg.version)
  .option('-l, --logLevel', 'Log Level', "INFO");

prog.command('generate')
  .describe('Generates valid testbeats config file')
  .example('generate')
  .example('generate -o .testbeats.json')
  .option('-o, --output', 'Ouput file for generated configuration', '.testbeats.json')
  .action(async (opts) => {
    try {
      logger.setLevel(opts.logLevel);
      logger.info(`🚧 Generate is still in BETA mode, please report any issues at ${pkg.bugs.url}`);
      const configCommand = new ConfigCommand(opts);
      await configCommand.generate();
    } catch (error) {
      logger.error(`Failed to generate configuration: ${error.message}`);
      process.exit(1);
    }
  });

prog.command('publish')
  .describe('Publish results to targets/channels and (or) testbeats portal')
  .option('-c, --config', 'path to config file')
  .option('--api-key', 'api key')
  .option('--project', 'project name')
  .option('--run', 'run name')
  .option('--slack', 'slack webhook url')
  .option('--teams', 'teams webhook url')
  .option('--chat', 'chat webhook url')
  .option('--title', 'title of the test run')
  .option('--junit', 'junit xml path')
  .option('--testng', 'testng xml path')
  .option('--cucumber', 'cucumber json path')
  .option('--mocha', 'mocha json path')
  .option('--nunit', 'nunit xml path')
  .option('--xunit', 'xunit xml path')
  .option('--mstest', 'mstest xml path')
  .option('-ci-info', 'ci info extension')
  .option('-chart-test-summary', 'chart test summary extension')
  .action(async (opts) => {
    try {
      logger.setLevel(opts.logLevel);
      const publish_command = new PublishCommand(opts);
      await publish_command.publish();
    } catch (error) {
      logger.error(`Report publish failed: ${error.message}`);
      process.exit(1);
    }
  });

prog.parse(process.argv);