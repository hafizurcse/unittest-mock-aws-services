const config = {
  awsCreds: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  },
  lambdaConfig: {
    invocationType: 'RequestResponse',
    logEnabled: true,
    batchSize: 5
  },
  consoleConfig: {
      flag: true
  }
};
module.exports = config;