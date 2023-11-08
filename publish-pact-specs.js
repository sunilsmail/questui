#!/usr/bin/env node

const pact = require('@pact-foundation/pact-node');
const path = require('path');
const process = require('process');

const metadata = require('./package.json');

pact
  .publishPacts({
    pactFilesOrDirs: [path.resolve(__dirname, './pacts/')],
    pactBroker: process.env.PACT_BROKER_HOST || 'http://localhost', //:8888
    consumerVersion: process.env.CONSUMER_VERSION || metadata.version,
    tags: process.env.TAG ? [process.env.TAG] : undefined
  })
  .then(() => {
    console.log('success');
  })
  .catch(e => {
    console.log('failed ', e);
    process.exit(1);
  });
