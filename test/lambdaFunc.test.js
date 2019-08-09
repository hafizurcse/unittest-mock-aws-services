const AWS = require('aws-sdk');
const sinon = require('sinon');
const chai = require('chai');
let expect = chai.expect;


describe('lambdaFunc', () => {
  describe('invokeNormal', () => {
    let lambdaStub,
        invokeStub,
        vfInvokeFunc;

    // sets the mocks
    beforeEach(() => {
      invokeStub = sinon.stub({ invoke: Function() });
      lambdaStub = sinon.stub(AWS, 'Lambda');
      lambdaStub.returns(invokeStub);
      vfInvokeFunc = require('./../lib/lambdaFunc').invokeNormal;
    });

    // restore the originals
    afterEach(() => {
      lambdaStub.restore();
      invokeStub.invoke.reset();
    });

    it('it will invoke a lambda normally', async (done) => {
      let fName = 'my-test-lambda';
      let message = 'Test calling lambda normally';

      let fPayload = {
        key1: {
          kye2: {
            val2: 'my-val2'
          },
          key3: {
            key4: 'my-val4'
          }
        }
      };

      let err = null; let transData = {Payload: fPayload};

      invokeStub.invoke.withArgs(sinon.match.any).yields(err, transData);

      vfInvokeFunc(fName, fPayload, message).then(data => {
        expect(data).to.deep.equal(fPayload);
        expect(typeof data).to.deep.equal('object');
      });
      done();
    });

    it('when message =  null, it will not log the message, lambda invokation normally', async (done) => {
      let fName = 'my-test-lambda';

      let fPayload = {
        key1: {
          kye2: {
            val2: 'my-val2'
          },
          key3: {
            key4: 'my-val4'
          }
        }
      };

      let err = null; let transData = {Payload: fPayload};

      invokeStub.invoke.withArgs(sinon.match.any).yields(err, transData);

      vfInvokeFunc(fName, fPayload).then(data => {
        expect(data).to.deep.equal(fPayload);
        expect(typeof data).to.deep.equal('object');
      });
      done();
    });


    it('it will error in invoking a lambda normally', async (done) => {
      let fName = 'my-test-lambda';
      let message = 'Test calling lambda normally';

      let fPayload = {
        key1: {
          kye2: {
            val2: 'my-val2'
          },
          key3: {
            key4: 'my-val4'
          }
        }
      };

      let err = {error: 'my error'};
      let transData = null;

      invokeStub.invoke.withArgs(sinon.match.any).yields(err, transData);

      vfInvokeFunc(fName, fPayload, message).catch(resErr => {
        expect(resErr).to.deep.equal(err);
        expect(typeof resErr).to.deep.equal('object');
      });
      done();
    });
  });

  // invokeBatched

  describe('invokeBatched', () => {
    let lambdaStub,
        invokeStub,
        vfInvokeBatched;

    // sets the mocks
    beforeEach(() => {
      invokeStub = sinon.stub({ invoke: Function() });
      lambdaStub = sinon.stub(AWS, 'Lambda');
      lambdaStub.returns(invokeStub);
      vfInvokeBatched = require('./../lib/lambdaFunc').invokeBatched;
    });

    // restore the originals
    afterEach(() => {
      lambdaStub.restore();
      invokeStub.invoke.reset();
    });

    it('it will invoke a lambda batched', async (done) => {
      let fName = 'my-test-lambda';
      let message = 'Test calling lambda batched';

      let event = {
        Payload: [{Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'}]
      };

      let resObj = JSON.stringify({Key1: 'SomeVal1', Key2: 'SomeVal2'})
      let err = null; let transData = [resObj, resObj];

      invokeStub.invoke.withArgs(sinon.match.any).yields(err, transData);

      vfInvokeBatched(fName, event, message).then(data => {
        expect(data.length).to.deep.equal(2);
        expect(typeof data).to.deep.equal('object');
      });
      done();
    });

    it('with message not being sent in functoin call, it will invoke a lambda batched', async (done) => {
      let fName = 'my-test-lambda';

      let event = {
        Payload: [{Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'}]
      };

      let resObj = JSON.stringify({Key1: 'SomeVal1', Key2: 'SomeVal2'})
      let err = null; let transData = [resObj, resObj];

      invokeStub.invoke.withArgs(sinon.match.any).yields(err, transData);

      vfInvokeBatched(fName, event).then(data => {
        expect(data.length).to.deep.equal(2);
        expect(typeof data).to.deep.equal('object');
      });
      done();
    });


    it('it will invoke a lambda batched without any message', async (done) => {
      let fName = 'my-test-lambda';
      let message = null;

      let event = {
        Payload: [{Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'}]
      };

      let resObj = JSON.stringify({Key1: 'SomeVal1', Key2: 'SomeVal2'})
      let err = null; let transData = [resObj, resObj];

      invokeStub.invoke.withArgs(sinon.match.any).yields(err, transData);

      vfInvokeBatched(fName, event, message).then(data => {
        expect(data.length).to.deep.equal(2);
        expect(typeof data).to.deep.equal('object');
      });
      done();
    });

    it('it will encounter an error when callig a lambda batched', async (done) => {
      let fName = 'my-test-lambda';
      let message = 'Lambda will error';

      let event = {
        Payload: [{Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'},
        {Key1: 'SomeVal1', Key2: 'SomeVal2'}]
      };

      let err = {error: 'encountered an error'}; let transData = null;

      invokeStub.invoke.withArgs(sinon.match.any).yields(err, transData);

      vfInvokeBatched(fName, event, message).catch(resErr => {
        expect(resErr).to.deep.equal(err);
        expect(typeof resErr).to.deep.equal('object');
      });
      done();
    });
  });
});
