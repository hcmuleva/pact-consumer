const { Publisher } = require('@pact-foundation/pact-node');
const path = require('path');

const pactBrokerUrl = 'http://localhost:9292';
const pactBrokerUsername = 'admin';
const pactBrokerPassword = 'password';

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
  pactBroker: pactBrokerUrl,
  pactBrokerUsername: pactBrokerUsername,
  pactBrokerPassword: pactBrokerPassword,
  consumerVersion: process.env.GIT_COMMIT || '1.0.0',
  tags: ['main', 'test']
};

new Publisher(opts).publishPacts()
  .then(() => {
    console.log('✅ Pact contract publishing complete!');
    console.log('');
    console.log(`📊 Head over to ${pactBrokerUrl} to see your published contracts.`);
  })
  .catch(e => {
    console.log('❌ Pact contract publishing failed: ', e);
    process.exit(1);
  });