const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('post test-summary to slack', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#36A64F",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 00:02"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary to slack with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Regression Tests*\n\n*Results*: 8 / 20 Passed (40%)\n*Duration*: 23:23"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ desktop-chrome*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 03:22"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ mobile-ios*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 09:05"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary-slim to slack with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Regression Tests*\n\n*Results*: 8 / 20 Passed (40%)\n*Duration*: 23:23"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post failure-details to slack with multiple suites', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Regression Tests*\n\n*Results*: 8 / 20 Passed (40%)\n*Duration*: 23:23"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ desktop-chrome*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 03:22"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: GU\n*Error*: expected [A] but found [948474]\n\n*Test*: SBP_WA\n*Error*: Expected condition failed: : 95ddbda01ea4b3dbcb049e681a6...}\n\n*Test*: CB\n*Error*: element click intercepted:\n\n"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*❌ mobile-ios*\n\n*Results*: 2 / 5 Passed (40%)\n*Duration*: 09:05"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: GU\n*Error*: expected [A] but found [948474]\n\n*Test*: SBP_WA\n*Error*: Appium error: An unknown sr='Search...']}\n\n*Test*: CB\n*Error*: A script did not complete \n\n"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post failure-details to slack with single suite', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 00:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Test*: c4\n*Error*: expected [true] but found [false]\n\n"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with hyperlinks to slack', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#36A64F",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 00:02"
                }
              },
              {
                "type": "context",
                "elements": [
                  {
                    "type": "mrkdwn",
                    "text": "<some-url|Pipeline> ｜ <some-url|Video>"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary to slack with report portal analysis', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 00:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Report Portal Analysis*\n\n🔴 PB - 0 ｜ 🟡 AB - 0 ｜ 🔵 SI - 0 ｜ ◯ ND - 0 ｜ *🟠 TI - 4*"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('post test-summary with mentions to slack', () => {
  return {
    request: {
      method: 'POST',
      path: '/message',
      body: {
        "attachments": [
          {
            "color": "#DC143C",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Default suite*\n\n*Results*: 3 / 4 Passed (75%)\n*Duration*: 00:02"
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "<@ULA15K66M> ｜ <@ULA15K66N>"
                }
              }
            ]
          }
        ]
      }
    },
    response: {
      status: 200
    }
  }
});

// {
// 	"attachments": [
// 		{
// 			"color": "#36A64F",
// 			"blocks": [
// 				{
// 					"type": "section",
// 					"text": {
// 						"type": "mrkdwn",
// 						"text": "*Default suite*\nThe test started failing\n\n*Results*: 4 / 4 Passed (100%)\n*Duration*: 00:02"
// 					},
// 					"accessory": {
// 						"type": "image",
// 						"image_url": "https://quickchart.io/chart?c=%7B%0A%20%20type%3A%20%27radialGauge%27%2C%0A%20%20data%3A%20%7B%0A%20%20%20%20datasets%3A%20%5B%7B%0A%20%20%20%20%20%20data%3A%20%5B80%5D%2C%0A%20%20%20%20%20%20backgroundColor%3A%20getGradientFillHelper(%27horizontal%27%2C%20%5B%27green%27%5D)%2C%0A%20%20%20%20%7D%5D%0A%20%20%7D%2C%0A%20%20options%3A%20%7B%0A%20%20%20%20%2F%2F%20See%20https%3A%2F%2Fgithub.com%2Fpandameister%2Fchartjs-chart-radial-gauge%23options%0A%20%20%20%20domain%3A%20%5B0%2C%20100%5D%2C%0A%20%20%20%20trackColor%3A%20%27%23ff0000%27%2C%20%0A%20%20%20%20centerPercentage%3A%2080%2C%0A%20%20%20%20centerArea%3A%20%7B%0A%20%20%20%20%20%20text%3A%20(val)%20%3D%3E%20val%20%2B%20%27%25%27%2C%0A%20%20%20%20%7D%2C%0A%20%20%7D%0A%7D",
// 						"alt_text": "cute cat"
// 					}
// 				}
// 			]
// 		}
// 	]
// }
