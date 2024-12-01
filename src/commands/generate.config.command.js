const path = require('path');
const os = require('os');
const { prompt } = require('enquirer');

const beats = require('../beats');
const logger = require('../utils/logger');
const pkg = require('../../package.json');
const { MIN_NODE_VERSION } = require('../helpers/constants');

class ConfigCommand {

  constructor() {
    this.opts = {};
    this.config = {
      results:[]
    };
    this.errors = [];
  }

  async generate() {
    logger.info(`🥁 TestBeats v${pkg.version}`);

    this.#validateEnvDetails();
    this.#getConfigInput();
  }

  async #getConfigInput() {
    try {
      this.opts = await prompt([
        {
          type: 'toggle',
          name: 'testbeatsEnabled',
          header:  '========================',
          message: 'Setup testbeats portal publish?'
        }
      ])

      const targetList = await prompt([
        {
          type: 'multiselect',
          name: 'targets',
          message: 'Choose test results formats to include',
          choices: [
            { name: 'slack' },
            { name: 'teams' },
            { name: 'chat' }
          ]
        }
      ])

      for (const target of targetList.targets) {
        let filePath = await prompt([{
          type: 'input',
          name: 'filePath',
          message: `Provide the filepath for ${rFormat} results (.json, .xml etc)`,
        }])
        this.config["results"].push({
          type: rFormat,
          files: [filePath]
        })
      }

      const extensionsListResponse = await prompt([
        {
          type: 'multiselect',
          name: 'extensions',
          message: 'Choose test results formats to include',
          choices: [
            { name: 'hyperlinks' },
            { name: 'mocha' },
            { name: 'testng' },
            { name: 'cucumber' },
            { name: 'xunit' },
            { name: 'nunit' },
            { name: 'mstest' },
          ]
        }
      ])


      const resultListResponse = await prompt([
        {
          type: 'multiselect',
          name: 'resultsTypes',
          message: 'Choose test results formats to include',
          choices: [
            { name: 'junit' },
            { name: 'mocha' },
            { name: 'testng' },
            { name: 'cucumber' },
            { name: 'xunit' },
            { name: 'nunit' },
            { name: 'mstest' },
          ]
        }
      ])

      for (const rFormat of resultListResponse.resultList) {
        let filePath = await prompt([{
          type: 'input',
          name: 'filePath',
          message: `Provide the filepath for ${rFormat} results (.json, .xml etc)`,
        }])
        this.config["results"].push({
          type: rFormat,
          files: [filePath]
        })
      }


      console.log("opts", this.opts)
      console.log("config", this.config)
    } catch (error) {
      logger.error("error", error.message)
    }

  }

  #validateEnvDetails() {
    try {
      const current_major_version = parseInt(process.version.split('.')[0].replace('v', ''));
      if (current_major_version >= MIN_NODE_VERSION) {
        logger.info(`💻 NodeJS: ${process.version}, OS: ${os.platform()}, Version: ${os.release()}, Arch: ${os.machine()}`);
        return;
      }
    } catch (error) {
      logger.warn(`⚠️ Unable to verify NodeJS version: ${error.message}`);
      return;
    }
    throw new Error(`❌ Supported NodeJS version is >= v${MIN_NODE_VERSION}. Current version is ${process.version}`)
  }

  // logger.info('✅ Results published successfully!');
}

module.exports = { ConfigCommand }
