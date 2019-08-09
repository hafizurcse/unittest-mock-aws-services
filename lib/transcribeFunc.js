const AWS = require('aws-sdk');
const log = require('./commonFunc').logger;
const config = require('./config');
const _isEmpty = require('lodash/isEmpty');

AWS.config.update({
  accessKeyId: config.awsCreds.accessKeyId,
  secretAccessKey: config.awsCreds.secretAccessKey,
  region: config.awsCreds.region
});

const transcribeFunc = {
  start: null,
  getList: null
}

/**
 * a start function will start the transcribe service
 * @param record: {S3: {Bucket: {Name: 'BUCKET_NAME'}}, Object: {Key: {'Key1'}}}
 * @param jobName: Transcribe job
 * @param outputBucketName: Output bucket name
 * @param vocabularyName: Vocabulary name
 * @returns {transcribe results}
 */
transcribeFunc.start = function(record, jobName, outputBucketName, vocabularyName) {
  return new Promise((resolve, reject) => {
    log('transcribeFunc.start');
    log(jobName);
    log(outputBucketName);
    log(record);

    const transService = new AWS.TranscribeService();

    let recordUrl = [
      `https://s3-${record.AwsRegion}.amazonaws.com`,
      record.S3.Bucket.Name,
      record.S3.Object.Key
    ].join('/');

    let params = {
      LanguageCode: 'en-AU',
      Media: { MediaFileUri: recordUrl },
      MediaFormat: 'wav',
      TranscriptionJobName: jobName,
      OutputBucketName: outputBucketName,
      Settings: {
        ChannelIdentification: false,
        ShowSpeakerLabels: true,
        MaxSpeakerLabels: 2
      }
    };

    if (!_isEmpty(vocabularyName)) {
      params.Settings.VocabularyName = vocabularyName;
    }

    log('transcribeFunc.start.startTranscriptionJob - params', params);

    transService.startTranscriptionJob(params, function(err, data) {
      if (err) {
        log(err.stack); // an error occurred
        reject(err);
      } else {
        log(data);// successful response
        resolve(data);
      }
    });
  });
};

/**
 * It returns a list of transcribe jobs
 * @param status: status of the jobs sought: IN_PROGRESS | FAILED | COMPLETED
 * @returns {The de-serialized data returned from the request}
 */
transcribeFunc.getList = function(status) {
  return new Promise((resolve, reject) => {
    log('transcribeFunc.getList');

    const transService = new AWS.TranscribeService();
    var params = {
      Status: status
    };
    log('transcribeFunc.getList.listTranscriptionJobs - params', params);

    transService.listTranscriptionJobs(params, function(err, data) {
      if (err) {
        log(err.stack);
        reject(err); // an error occurred
      } else {
        log(data);
        resolve(data); // successful response
      }
    });
  });
};

module.exports = transcribeFunc;
