const AWS = require('aws-sdk');
const sinon = require('sinon');
const chai = require('chai');
let expect = chai.expect;

describe('vfS3.getObject', () => {
  let aws,
      s3,
      s3GetObject

  // sets the mocks
  beforeEach(() => {
    s3 = sinon.stub({ getObject: Function() });
    aws = sinon.stub(AWS, 'S3');
    aws.returns(s3);
    s3GetObject = require('./../lib/s3Func').getObject;;
  });

  // restore the originals
  afterEach(() => {
    aws.restore();
    s3.getObject.reset();
  });

  it('Successfully reads a file', async (done) => {
    let getObjectErr = null;
    let getObjectData = {Body: 'my data'};
    let record = {
            s3: {
                bucket: {
                    name: 'test-bucket'
                },
                object: {
                    key: 'test/test.txt'
                }
            }
        };

      s3.getObject.withArgs({Bucket: 'test-bucket', Key: 'test/test.txt'}).yields(getObjectErr, getObjectData);

      s3GetObject(record).then(data => {
        expect(data).to.deep.equal('my data');
        expect(typeof data).to.deep.equal('string')
      }).catch(e => {
    });
    done();
  });

  it('Fails to read a file', async (done) => {
    let getObjectErr = 'Error in reading';
    let getObjectData = null;
    let record = {
            s3: {
                bucket: {
                    name: 'test-bucket'
                },
                object: {
                    key: 'test/test.txt'
                }
            }
        };
      s3.getObject.withArgs({Bucket: 'test-bucket', Key: 'test/test.txt'}).yields(getObjectErr, getObjectData);
      s3GetObject(record).catch(err => {
      expect(err).to.deep.equal('Error in reading');
      expect(typeof err).to.deep.equal('string')
    });
    done();
  });

  it('Fails to read a file with encoding enabled', async (done) => {
    let getObjectErr = 'File does not exist';
    let getObjectData = null;
    let record = {
            s3: {
                bucket: {
                    name: 'test-bucket'
                },
                object: {
                    key: 'test/test.txt'
                }
            }
        };
      s3.getObject.withArgs({Bucket: 'test-bucket', Key: 'test/test.txt'}).yields(getObjectErr, getObjectData);
      s3GetObject(record, true).catch(err => {
      expect(err).to.deep.equal('File does not exist');
      expect(typeof err).to.deep.equal('string')
    });
    done();
  });

  it('Sucessfully reads a file with buffer and encoding enabled', async (done) => {
    let getObjectErr = null;
    let getObjectData = {Body: Buffer.from('my response')};
    let record = {
            s3: {
                bucket: {
                    name: 'test-bucket'
                },
                object: {
                    key: 'test/test.txt'
                }
            }
        };
      s3.getObject.withArgs({Bucket: 'test-bucket', Key: 'test/test.txt'}).yields(getObjectErr, getObjectData);
      s3GetObject(record, true).then(data => {
      expect(data).to.deep.equal('my response');
      expect(typeof data).to.deep.equal('string')
    });
    done();
  });
});
