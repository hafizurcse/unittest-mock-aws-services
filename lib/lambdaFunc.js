const AWS = require('aws-sdk');
const common = require('./commonFunc');
const log = common.logger;
const config = require('./config');
const _isEmpty = require('lodash/isEmpty');

AWS.config.update({
  accessKeyId: config.awsCreds.accessKeyId,
  secretAccessKey: config.awsCreds.secretAccessKey,
  region: config.awsCreds.region
});

const lambdaFunc = {
  invokeNormal: null,
  invokeBatched: null
};

/**
 * Invoking AWS lambda function normally
 * @param fName: Lambda function name
 * @param fPayload: Lambda payload
 * @param message: Any message wants to be passed
 * @returns {JSON}
 */
lambdaFunc.invokeNormal = function(fName, fPayload, message = null) {
  if (!_isEmpty(message)) {
    log('lambdaFunc.lambda.invoke - ' + message);
  } else {
    log('lambdaFunc.lambda.invoke');
  }

  log('lambdaFunc.lambda.invoke - fName:' + fName);

  if (config.lambdaConfig.logEnabled) {
    log('lambdaFunc.lambda.invoke - fPayload:' + JSON.stringify(fPayload));
  }

  return new Promise((resolve, reject) => {
    let lambda = new AWS.Lambda();

    let params = {
      FunctionName: fName,
      InvocationType: config.lambdaConfig.invocationType,
      LogType: 'Tail',
      Payload: JSON.stringify(fPayload)
    };

    if (config.lambdaConfig.logEnabled) {
      log('lambdaFunc.lambda.invoke - params:' + params);
    }

    lambda.invoke(params, function(err, data) {
      if (err) {
        log('lambdaFunc.lambda.invoke ERROR');
        log(err);
        reject(err);
      } else {
        log(data);
        resolve(data.Payload);
      }
    });
  });
}

/**
 * Batch invokation of AWS lambda function
 * @param fName: Lambda function name
 * @param event: Lambda event object
 * @param message: Any message wants to be passed
 * @returns {None}
 */
lambdaFunc.invokeBatched = function(fName, event, message = null) {
  if (message !== null) {
    log('lambdaFunc.lambda.invokeBatched - ' + message);
  } else {
    log('lambdaFunc.lambda.invokeBatched');
  }

  return new Promise((resolve, reject) => {
    let batchMessage,
        totalPayload,
        batchedResponse = [];

    totalPayload = event.Payload;
    log('lambdaFunc.lambda.invokeBatched - batchSize: ' + totalPayload.length);

    for (var i = 0; i < totalPayload.length; i += config.lambdaConfig.batchSize) {
      event.Payload = totalPayload.slice(i, i + config.lambdaConfig.batchSize);
      event.BatchNumber = i;
      batchMessage = 'Batch: ' + i + ' - ' + (i + config.lambdaConfig.batchSize);
      lambdaFunc.invokeNormal(fName, event, batchMessage).then(lambdaRes => {
        batchedResponse.push(JSON.stringify(lambdaRes));
      }).catch(e => {
        log('lambdaFunc.invokeBatched ERROR' + e);
        reject(e)
      });
    }
    resolve(batchedResponse);
  });
}

module.exports = lambdaFunc;
