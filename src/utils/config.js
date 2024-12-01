const config = {
    "targets": [
      {
        "name": "slack",
        "inputs": {
          "url": "<place-holder>",
          "publish": "test-summary-slim"
        },
        "extensions": [
            {
              "name": "mentions",
              "inputs": {
                "users": [
                  {
                    "name": "Test",
                    "slack_uid": ""
                  }
                ]
              }   
            }
          ]
      }
    ],
    "results": [
      {
        "type": "testng",
        "files": [
          "test/data/testng/single-suite-failures.xml"
        ]
      }
    ]
  }
  



module.exports = config;