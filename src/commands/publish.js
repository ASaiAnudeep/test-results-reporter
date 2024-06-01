const path = require('path');
const trp = require('test-results-parser');
const prp = require('performance-results-parser');

const pkg = require('../../package.json');
const { processData } = require('../helpers/helper');
const beats = require('../beats');
const target_manager = require('../targets');
const logger = require('../utils/logger');

/**
 * @param {import('../index').PublishOptions} opts
 */
async function run(opts) {
  logger.info(`🥁 TestBeats v${pkg.version}`);
  if (!opts) {
    throw new Error('Missing publish options');
  }
  if (!opts.config) {
    throw new Error('Missing publish config');
  }
  if (typeof opts.config === 'string') {
    const cwd = process.cwd();
    const file_path = path.join(cwd, opts.config);
    try {
      opts.config = require(path.join(cwd, opts.config));
    } catch (error) {
      throw new Error(`Config file not found: ${file_path}`);
    }
  }
  const config = processData(opts.config);
  if (config.reports) {
    for (const report of config.reports) {
      validateConfig(report);
      await processReport(report);
    }
  } else {
    validateConfig(config);
    await processReport(config);
  }
  logger.info('✅ Results published successfully!');
}

/**
 *
 * @param {import('../index').PublishReport} report
 */
async function processReport(report) {
  logger.info('🧙 Processing results...');
  const parsed_results = [];
  for (const result_options of report.results) {
    if (result_options.type === 'custom') {
      parsed_results.push(result_options.result);
    } else if (result_options.type === 'jmeter') {
      parsed_results.push(prp.parse(result_options));
    } else {
      parsed_results.push(trp.parse(result_options));
    }
  }

  for (let i = 0; i < parsed_results.length; i++) {
    const result = parsed_results[i];
    await beats.run(report, result);
    if (report.targets) {
      for (const target of report.targets) {
        await target_manager.run(target, result);
      }
    } else {
      logger.warn('⚠️ No targets defined, skipping sending results to targets');
    }
  }
  logger.debug('✔️ Results processed successfully!');
}

/**
 *
 * @param {import('../index').PublishReport} config
 */
function validateConfig(config) {
  logger.info("🛠️  Validating configuration...")
  if (!config) {
    throw new Error('Missing configuration');
  }
  validateResults(config);
  validateTargets(config);
}

/**
 *
 * @param {import('../index').PublishReport} config
 */
function validateResults(config) {
  logger.debug("Validating results...")
  if (!config.results) {
    throw new Error('Missing results properties in config');
  }
  if (!Array.isArray(config.results)) {
    throw new Error('results must be an array');
  }
  if (!config.results.length) {
    throw new Error('At least one result must be defined');
  }
  for (const result of config.results) {
    if (!result.type) {
      throw new Error('Missing result type');
    }
    if (result.type === 'custom') {
      if (!result.result) {
        throw new Error('Missing result');
      }
    } else {
      if (!result.files) {
        throw new Error('Missing result files');
      }
      if (!Array.isArray(result.files)) {
        throw new Error('result files must be an array');
      }
      if (!result.files.length) {
        throw new Error('At least one result file must be defined');
      }
    }
  }
  logger.debug("Validating results - Successful!")
}

/**
 *
 * @param {import('../index').PublishReport} config
 */
function validateTargets(config) {
  logger.debug("Validating targets...")
  if (!config.targets) {
    logger.warn('⚠️ Targets are not defined in config');
    return;
  }
  if (!Array.isArray(config.targets)) {
    throw new Error('targets must be an array');
  }
  for (const target of config.targets) {
    if (!target.name) {
      throw new Error('missing target name');
    }
    if (target.name === 'slack' || target.name === 'teams' || target.name === 'chat') {
      if (!target.inputs) {
        throw new Error(`missing inputs in ${target.name} target`);
      }
    }
    if (target.inputs) {
      const inputs = target.inputs;
      if (target.name === 'slack' || target.name === 'teams' || target.name === 'chat') {
        if (!inputs.url) {
          throw new Error(`missing url in ${target.name} target inputs`);
        }
        if (typeof inputs.url !== 'string') {
          throw new Error(`url in ${target.name} target inputs must be a string`);
        }
        if (!inputs.url.startsWith('http')) {
          throw new Error(`url in ${target.name} target inputs must start with 'http' or 'https'`);
        }
      }
    }
  }
  logger.debug("Validating targets - Successful!")
}

module.exports = {
  run
}