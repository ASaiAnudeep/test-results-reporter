const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require("../src");

describe('TestBeats', () => {

  it('should send results to beats', async () => {
    const id1 = mock.addInteraction('post test results to beats');
    const id2 = mock.addInteraction('post test-summary with beats to teams');
    await publish({
      config: {
        api_key: 'api-key',
        project: 'project-name',
        run: 'build-name',
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            }
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/single-suite.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id1).exercised, true);
    assert.equal(mock.getInteraction(id2).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});