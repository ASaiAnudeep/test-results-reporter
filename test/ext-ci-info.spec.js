const { mock } = require('pactum');
const assert = require('assert');
const { publish } = require('../src');

describe('extensions - ci-info', () => {

  beforeEach(() => {
    process.env.GITHUB_ACTIONS = '';
    process.env.GITHUB_SERVER_URL = '';
    process.env.GITHUB_REPOSITORY = '';
    process.env.GITHUB_REF = '';
    process.env.GITHUB_SHA = '';
    process.env.GITHUB_RUN_ID = '';
    process.env.GITHUB_RUN_NUMBER = '';
    process.env.GITHUB_WORKFLOW = '';

    process.env.GITLAB_CI = '';
    process.env.CI_PROJECT_URL = '';
    process.env.CI_PROJECT_NAME = '';
    process.env.CI_COMMIT_REF_NAME = '';
    process.env.CI_COMMIT_SHA = '';
    process.env.CI_JOB_URL = '';
    process.env.CI_JOB_ID = '';
    process.env.CI_JOB_NAME = '';
    process.env.CI_PIPELINE_SOURCE = '';
    process.env.GITLAB_USER_LOGIN = '';

    process.env.CIRCLECI = '';
    process.env.CIRCLE_REPOSITORY_URL = '';
    process.env.CIRCLE_PROJECT_REPONAME = ''; // Need to find a better match
    process.env.CIRCLE_SHA1 = '';
    process.env.CIRCLE_BRANCH = '';
    process.env.CIRCLE_BUILD_URL = '';
    process.env.CIRCLE_BUILD_NUM = '';
    process.env.CIRCLE_JOB = '';
    process.env.CIRCLE_USERNAME = '';

    process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI = '';
    process.env.BUILD_REPOSITORY_URI = '';
    process.env.BUILD_REPOSITORY_NAME = '';
    process.env.BUILD_SOURCEBRANCH = '';
    process.env.BUILD_SOURCEVERSION = '';
    process.env.BUILD_BUILDID = '';
    process.env.BUILD_BUILDNUMBER = '';
    process.env.BUILD_DEFINITIONNAME = '';
  });

  it('should send test-summary with ci-info to teams with no ci information', async () => {
    const id = mock.addInteraction('post test-summary to teams');
    await publish({
      config: {
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with build details when branch is a common branch', async () => {
    process.env.GITHUB_ACTIONS = 'GITHUB_ACTIONS';
    process.env.GITHUB_SERVER_URL = 'https://github.com';
    process.env.GITHUB_REPOSITORY = 'test/test';
    process.env.GITHUB_REF = 'refs/heads/master';
    process.env.GITHUB_SHA = 'sha';
    process.env.GITHUB_RUN_ID = 'id-123';
    process.env.GITHUB_RUN_NUMBER = 'number-123';
    process.env.GITHUB_WORKFLOW = 'Build';

    const id = mock.addInteraction('post test-summary with only build ci-info to teams');
    await publish({
      config: {
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with github ci information to teams', async () => {
    process.env.GITHUB_ACTIONS = 'GITHUB_ACTIONS';
    process.env.GITHUB_SERVER_URL = 'https://github.com';
    process.env.GITHUB_REPOSITORY = 'test/test';
    process.env.GITHUB_REF = 'refs/heads/feature-test';
    process.env.GITHUB_SHA = 'sha';
    process.env.GITHUB_RUN_ID = 'id-123';
    process.env.GITHUB_RUN_NUMBER = 'number-123';
    process.env.GITHUB_WORKFLOW = 'Build';
    const id = mock.addInteraction('post test-summary with ci-info to teams');
    await publish({
      config: {
        targets: [
          {
            name: 'teams',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with azure devops ci information to slack', async () => {
    process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI = 'https://dev.azure.com/';
    process.env.SYSTEM_TEAMPROJECT = 'test';
    process.env.BUILD_REPOSITORY_URI = 'https://github.com/test/test';
    process.env.BUILD_REPOSITORY_NAME = 'test/test';
    process.env.BUILD_SOURCEBRANCH = 'refs/pull/123/merge';
    process.env.BUILD_SOURCEVERSION = 'sha';
    process.env.BUILD_BUILDID = 'id-123';
    process.env.BUILD_BUILDNUMBER = 'number-123';
    process.env.BUILD_DEFINITIONNAME = 'Build';
    const id = mock.addInteraction('post test-summary with ci-info to slack');
    await publish({
      config: {
        targets: [
          {
            name: 'slack',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with gitlab ci information to slack', async () => {
    process.env.GITLAB_CI = true;
    process.env.CI_PROJECT_URL = 'https://gitlab.com/testbeats/demo';
    process.env.CI_PROJECT_NAME = 'demo';
    process.env.CI_COMMIT_REF_NAME = 'branch';
    process.env.CI_COMMIT_SHA = 'sha';
    process.env.CI_JOB_URL = 'https://gitlab.com/testbeats/demo/-/jobs/id-123';
    process.env.CI_JOB_ID = 'id-123';
    process.env.CI_JOB_NAME = 'Test';
    process.env.CI_PIPELINE_SOURCE = 'push';
    process.env.GITLAB_USER_LOGIN = 'dummy-user';

    const id = mock.addInteraction('post test-summary with gitlab ci-info to slack');
    await publish({
      config: {
        targets: [
          {
            name: 'slack',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with gitlab ci information to slack - with PR', async () => {
    process.env.GITLAB_CI = true;
    process.env.CI_OPEN_MERGE_REQUESTS = 'testbeats/demo!1';
    process.env.CI_PROJECT_URL = 'https://gitlab.com/testbeats/demo';
    process.env.CI_PROJECT_NAME = 'demo';
    process.env.CI_COMMIT_REF_NAME = 'branch';
    process.env.CI_COMMIT_SHA = 'sha';
    process.env.CI_JOB_URL = 'https://gitlab.com/testbeats/demo/-/jobs/id-123';
    process.env.CI_JOB_ID = 'id-123';
    process.env.CI_JOB_NAME = 'Test';
    process.env.CI_PIPELINE_SOURCE = 'push';
    process.env.GITLAB_USER_LOGIN = 'dummy-user';

    const id = mock.addInteraction('post test-summary with gitlab ci-info with PR to slack');
    await publish({
      config: {
        targets: [
          {
            name: 'slack',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with circle-ci\'s ci information to slack', async () => {
    process.env.CIRCLECI = true;
    process.env.CIRCLE_REPOSITORY_URL = '';
    process.env.CIRCLE_PROJECT_REPONAME = 'demo';
    process.env.CIRCLE_BRANCH = 'branch';
    process.env.CIRCLE_SHA1 = 'sja';
    process.env.CIRCLE_BUILD_URL = 'https://apphttps://app.circleci.com/jobs/circleci/uuid-1/uuid-2';
    process.env.CIRCLE_BUILD_NUM = 1;
    process.env.CIRCLE_JOB = 'Test_Build';
    process.env.CIRCLE_USERNAME = 'dummy-user@example.com';

    const id = mock.addInteraction('post test-summary with circle-ci ci-info to slack');
    await publish({
      config: {
        targets: [
          {
            name: 'slack',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with azure devops ci information to chat and extra data', async () => {
    process.env.GITHUB_ACTIONS = 'GITHUB_ACTIONS';
    process.env.GITHUB_SERVER_URL = 'https://github.com';
    process.env.GITHUB_REPOSITORY = 'org/repo';
    process.env.GITHUB_REF = 'refs/heads/feature-test';
    process.env.GITHUB_SHA = 'sha';
    process.env.GITHUB_RUN_ID = 'id-123';
    process.env.GITHUB_RUN_NUMBER = 'number-123';
    process.env.GITHUB_WORKFLOW = 'Build';
    const id = mock.addInteraction('post test-summary with ci-info to chat');
    await publish({
      config: {
        targets: [
          {
            name: 'chat',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info',
                inputs: {
                  data: [
                    {
                      "key": "Download Logs",
                      "value": "{LOGS_URL}",
                      "type": "hyperlink"
                    }
                  ]
                }
              }
            ]
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
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  it('should send test-summary with multiple suites and ci information to slack', async () => {
    process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI = 'https://dev.azure.com/';
    process.env.SYSTEM_TEAMPROJECT = 'test';
    process.env.BUILD_REPOSITORY_URI = 'https://github.com/test/test';
    process.env.BUILD_REPOSITORY_NAME = 'test/test';
    process.env.BUILD_SOURCEBRANCH = 'refs/pull/123/merge';
    process.env.BUILD_SOURCEVERSION = 'sha';
    process.env.BUILD_BUILDID = 'id-123';
    process.env.BUILD_BUILDNUMBER = 'number-123';
    process.env.BUILD_DEFINITIONNAME = 'Build';
    const id = mock.addInteraction('post test-summary with multiple suites and ci-info to to slack');
    await publish({
      config: {
        targets: [
          {
            name: 'slack',
            inputs: {
              url: 'http://localhost:9393/message'
            },
            extensions: [
              {
                name: 'ci-info'
              }
            ]
          }
        ],
        results: [
          {
            type: 'testng',
            files: [
              'test/data/testng/multiple-suites.xml'
            ]
          }
        ]
      }
    });
    assert.equal(mock.getInteraction(id).exercised, true);
  });

  afterEach(() => {
    mock.clearInteractions();
  });

});