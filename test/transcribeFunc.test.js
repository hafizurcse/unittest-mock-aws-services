const sinon = require('sinon');
const chai = require('chai');
const AWS = require('aws-sdk');
let expect = chai.expect;

describe('transcribeFunc', () => {
  describe('start', () => {
    let awsStub,
      TnsJobStartStub,
      vfTStartFunc;

    // sets the mocks
    beforeEach(() => {
      TnsJobStartStub = sinon.stub({ startTranscriptionJob: Function() });
      awsStub = sinon.stub(AWS, 'TranscribeService');
      awsStub.returns(TnsJobStartStub);
      vfTStartFunc = require('./../lib/transcribeFunc').start;
    });

    // restore the originals
    afterEach(() => {
      awsStub.restore();
      TnsJobStartStub.startTranscriptionJob.reset();
    });

    it('it will return transcribed results', async done => {
      let jobName = 'TestJob';
      let outputBucketName = 'TEST-BUCKET';
      let vocabularyName = 'en-AU';

      let record = {
        S3: {
          Bucket: {
            Name: 'my-test-bucket'
          },
          Object: {
            Key: 'test/test.txt'
          }
        },
        awsRegion: 'ap-southeast-2'
      };

      let err = null; let transData = {response: 'my transcribe results'};

      TnsJobStartStub.startTranscriptionJob.withArgs(sinon.match.any).yields(err, transData);

      vfTStartFunc(record, jobName, outputBucketName, vocabularyName).then(data => {
        expect(data).to.deep.equal(transData);
        expect(typeof data).to.deep.equal('object');
      });
      done();
    });

    it('with vocabularyName = empty, it will return transcribed results', async done => {
      let jobName = 'TestJob';
      let outputBucketName = 'TEST-BUCKET';
      let vocabularyName = '';

      let record = {
        S3: {
          Bucket: {
            Name: 'my-test-bucket'
          },
          Object: {
            Key: 'test/test.txt'
          }
        },
        awsRegion: 'ap-southeast-2'
      };

      let err = null; let transData = {response: 'my transcribe results'};

      TnsJobStartStub.startTranscriptionJob.withArgs(sinon.match.any).yields(err, transData);

      vfTStartFunc(record, jobName, outputBucketName, vocabularyName).then(data => {
        expect(data).to.deep.equal(transData);
        expect(typeof data).to.deep.equal('object');
      });
      done();
    });


    it('it will error on getting transcribed results', async done => {
      let jobName = 'TestJob';
      let outputBucketName = 'TEST-BUCKET';
      let vocabularyName = 'en-AU';

      let record = {
        S3: {
          Bucket: {
            Name: 'my-test-bucket'
          },
          Object: {
            Key: 'test/test.txt'
          }
        },
        awsRegion: 'ap-southeast-2'
      };

      let err = {stack: 'my error'}; let transData = null;

      TnsJobStartStub.startTranscriptionJob.withArgs(sinon.match.any).yields(err, transData);

      vfTStartFunc(record, jobName, outputBucketName, vocabularyName).catch(returnedError => {
        expect(returnedError).to.deep.equal(err);
        expect(typeof returnedError).to.deep.equal('object');
      });
      done();
    });
  });

  describe('getList', () => {
    let getListAWSStub,
      getListTnsJobStub,
      vfTnsGetListFunc;

    // sets the mocks
    beforeEach(() => {
      getListTnsJobStub = sinon.stub({ listTranscriptionJobs: Function() });
      getListAWSStub = sinon.stub(AWS, 'TranscribeService');
      getListAWSStub.returns(getListTnsJobStub);
      vfTnsGetListFunc = require('./../lib/transcribeFunc').getList;
    });

    // restore the originals
    afterEach(() => {
      getListAWSStub.restore();
      getListTnsJobStub.listTranscriptionJobs.reset();
    });

    it('it will return a list of jobs for a specific status', async done => {
      let jobStatus = 'COMPLETED';

      let err = null;
      let jobList = [{jobId: 'ABC123'}, {jobId: 'ABC124'}];

      getListTnsJobStub.listTranscriptionJobs.withArgs(sinon.match.any).yields(err, jobList);

      vfTnsGetListFunc(jobStatus).then(data => {
        expect(data).to.deep.equal(jobList);
        expect(typeof data).to.deep.equal('object');
      });
      done();
    });

    it('it will an error on getting job status', async done => {
      let jobStatus = 'COMPLETED';

      let err = {stack: 'my error'}; let jobList = null;

      getListTnsJobStub.listTranscriptionJobs.withArgs(sinon.match.any).yields(err, jobList);

      vfTnsGetListFunc(jobStatus).catch(returnedError => {
        expect(returnedError).to.deep.equal(err);
        expect(typeof returnedError).to.deep.equal('object');
      });
      done();
    });
  });
});
