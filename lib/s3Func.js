const AWS = require('aws-sdk');
const common = require('./commonFunc');
const config = require('./config');
const log = common.logger;

AWS.config.update({
  accessKeyId: config.awsCreds.accessKeyId,
  secretAccessKey: config.awsCreds.secretAccessKey,
  region: config.awsCreds.region
});

const s3Func = {
/**
 * Reading object from S3
 * @param record: JSON object containing Bucket name and Key,
 * @param encoding: flag for encoding {true, false}, default=false
 * @returns {File Content}
 */

  getObject: function(record, encoding=false) {
    log('s3Func.getObject', record, encoding);

    const S3 = new AWS.S3();

    return new Promise((resolve, reject) => {
      var params = {
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key
      };
      log('s3Func.getObject.params: ' + JSON.stringify(params));

      S3.getObject(params, function(err, data) {
        if (err) {
          log(err);
          reject(err);
        } else {
          resolve((encoding===true) ? data.Body.toString('utf-8') : data.Body)
        }
      });
    });
  },
};

module.exports = s3Func;
