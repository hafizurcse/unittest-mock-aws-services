const commonFunc = require('../lib/commonFunc');
const sinon = require('sinon');
const chai = require('chai');
let expect = chai.expect;

describe('commonFunc', () => {
  describe('sleep', () => {
    it('will call setTimeout once with 3000 milliseconds', async done => {
      let sleepTime = 3000;

      let spy = sinon.spy(setTimeout);

      commonFunc.sleep(sleepTime);

      expect(spy.withArgs(Promise, sleepTime).calledOnce);

      done();
    });
  });

  describe('log', () => {
    it('will call log once with a string', async done => {
      let logStr = 'test';

      let spy = sinon.spy(commonFunc.logger);

      commonFunc.logger(logStr);

      expect(spy.withArgs(logStr).calledOnce);

      done();
    });

    it('will call log once with a json object', async done => {
      let logObj = {
        key1: 'val1',
        key2: 'val2'
      };

      let spy = sinon.spy(commonFunc.logger);

      commonFunc.logger(logObj);

      expect(spy.withArgs(logObj).calledOnce);

      done();
    });
  });

  describe('xml2json', () => {
    it('will xml data to json xml2json', async done => {
      let xmlText = '<Project>Test</Project>';
      var result = {'Project': 'Test'};
      let logEnabled = false;
      commonFunc.xmlToJson(xmlText, logEnabled).then(json => {
        expect(json).to.deep.equal(result);
      });
      done();
    });

    it('will error for xml to json conversion', async done => {
      let xmlText = '<Project>Test';
      let logEnabled = true;
      commonFunc.xmlToJson(xmlText, logEnabled).catch(err => {
        let typeOfErr = typeof err;
        expect(typeOfErr).to.equal('object');
      });
      done();
    });

    it('with no logEnbaled value, it will use default value and error for xml to json conversion', async done => {
      let xmlText = '<Project>Test';
      commonFunc.xmlToJson(xmlText).catch(err => {
        let typeOfErr = typeof err;
        expect(typeOfErr).to.equal('object');
      });
      done();
    });
  });

  describe('csvtojson', () => {
    it('will convert the csv string json with headers information', async done => {
      let csvStr = 'a,b,c \n 1,2,3 \n 4,5,6 \n 7,8,9';
      let params = {
        delimiter: ',',
        noheader: false,
        output: 'json'
      };
      var result = [ { a: '1', b: '2', c: '3' },
        { a: '4', b: '5', c: '6' },
        { a: '7', b: '8', c: '9' } ];

      commonFunc.csvToJson(csvStr, params).then(json => {
        expect(json).to.deep.equal(result);
      });
      done();
    });

    it('will convert the csv string json with no headers information', async done => {
      let csvStr = 'a,b,c \n 1,2,3 \n 4,5,6 \n 7,8,9';
      let params = {
        delimiter: ',',
        noheader: true,
        output: 'json'
      };
      var result = [ { field1: 'a', field2: 'b', field3: 'c' },
        { field1: '1', field2: '2', field3: '3' },
        { field1: '4', field2: '5', field3: '6' },
        { field1: '7', field2: '8', field3: '9' } ];

      commonFunc.csvToJson(csvStr, params).then(json => {
        expect(json).to.deep.equal(result);
      });
      done();
    });

    it('it will error while conversion', async done => {
      let csvStr = 'h1,h2,h3\n' + 'rc11,r12,rc13';
      let CSV2JSON = require("csvtojson");
      let testErr = {error: "my error"};
      let fromStrStub,
          convStub;
      fromStrStub = sinon.stub({ fromString: Function() });
      convStub = sinon.stub(CSV2JSON, 'Converter');
      convStub.returns(fromStrStub);

      // set the `fromString` function behaviour
      fromStrStub.fromString.withArgs(sinon.match.any).rejects(testErr);

      let params = {
        delimiter: ',',
        noheader: true,
        output: 'json'
      };

      commonFunc.csvToJson(csvStr, params).catch(err => {
        expect(typeof err).to.deep.equal('object');
        expect(err).to.deep.equal(testErr);
      });

      // restore original
      convStub.restore();
      fromStrStub.fromString.reset();

      done();
    });

    it('it will pass logEnabled = false', async done => {
      let csvStr = 'a,b,c \n 1,2,3 \n 4,5,6 \n 7,8,9';
      let CSV2JSON = require("csvtojson");
      let result = [ { a: '1', b: '2', c: '3' },
        { a: '4', b: '5', c: '6' },
        { a: '7', b: '8', c: '9' } ];

      let logEnabled = false;
      let fromStrStub,
          convStub;
      fromStrStub = sinon.stub({ fromString: Function() });
      convStub = sinon.stub(CSV2JSON, 'Converter');
      convStub.returns(fromStrStub);

      // set the `fromString` function behaviour
      fromStrStub.fromString.withArgs(sinon.match.any).resolves(result);

      let params = {
        delimiter: ',',
        noheader: false,
        output: 'json'
      };

      commonFunc.csvToJson(csvStr, params, logEnabled).then(data => {
        expect(typeof data).to.deep.equal('object');
        expect(data).to.deep.equal(result);
      });

      // restore original
      convStub.restore();
      fromStrStub.fromString.reset();

      done();
    });
  });
});
