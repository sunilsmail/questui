// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const process = require('process');

// const pactConfig = {
//   'Testing Pact Service': {
//     port: base => base,
//     pathPrefix: '/api',
//     log: './pacts/lab_results_pact_server.log'
//   }
// };

const basePactPort = parseInt(process.env.PACT_SERVER_PORT, 10) || 9000;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      // require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('@alasdair/karma-scss-preprocessor'),
      // require('@pact-foundation/karma-pact')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
      }
      // pactPorts: Object.assign(
      //   {},
      //   ...Object.keys(pactConfig).map(provider => ({ [provider]: pactConfig[provider].port(basePactPort) }))
      // )
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      fixWebpackSourcePaths: true,
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ],
      check: {
        global: {
          statements: 0,
          lines: 0,
          branches: 0,
          functions: 0
        }
      }
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
      }
    },
    // junitReporter: {
    //   outputFile: `results-${new Date().getTime()}.xml`,
    //   outputDir: 'junit'
    // },
    // pact: Object.keys(pactConfig).map(provider => ({
    //   consumer: 'Appointment UI',
    //   provider: provider,
    //   port: pactConfig[provider].port(basePactPort),
    //   log: pactConfig[provider].log,
    //   dir: './pacts',
    //   logLevel: 'info'
    // })),
    // proxies: Object.assign(
    //   {},
    //   ...Object.keys(pactConfig).map(provider => ({
    //     [pactConfig[provider].pathPrefix]: `http://localhost:${pactConfig[provider].port(basePactPort)}${
    //       pactConfig[provider].pathPrefix
    //       }`
    //   }))
    // )
  });
};
