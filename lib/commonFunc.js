const xml2json = require('xml2js');
const csv2json = require('csvtojson');

const commonFunc = {
  'sleep': null,
  'logger': null,
  'xmlToJson': null,
  'csvToJson': null
};

/**
 * a sleep function with setTimeout
 * @param ms: milliseconds to sleep
 * @returns {None}
 */
commonFunc.sleep = function(ms) {
  return new Promise(resolve => {
    commonFunc.logger('sleep:' + ms);
    setTimeout(resolve, ms);
  });
};

/**
 * a custom logger
 * @param message: message/payload to log
 * @returns {None}
 */
commonFunc.logger = function(message) {
  if (typeof message === 'string' || typeof message === 'number') {
    console.log('== ' + message);
  } else {
    console.log('== ' + JSON.stringify(message));
  }
};

/**
 * an XML to JSON converter
 * @param xmlText: XML data,
 * @param logEnabled: log flag with true as default
 * @returns {json}
 */

commonFunc.xmlToJson = function(xmlText, logEnabled = true) {
  commonFunc.logger('commonFunc.xmlToJson');
  return new Promise((resolve, reject) => {
    xml2json.parseString(xmlText, function(err, result) {
      if (err) {
        commonFunc.logger(err.stack);
        reject(err);
      }

      if (logEnabled) {
        commonFunc.logger(result);
      }
      resolve(result);
    });
  });
};

/**
 * an CSV to JSON converter
 * @param csvStr: CSV data,
 * @param parseParams: parsing parameters,
 * @param logEnabled: log flag with true as default
 * @returns {json}
 */
commonFunc.csvToJson = function(csvStr, parseParams, logEnabled = true) {
  commonFunc.logger('commonFunc.csvToJson');
  return new Promise((resolve, reject) => {
    var Converter = csv2json.Converter;
    //set the Converter with params
    var converter = new Converter(parseParams);
    converter
      .fromString(csvStr)
      .then((jsonObj) => {
        if (logEnabled) {
          commonFunc.logger(jsonObj);
        }
        resolve(jsonObj);
      }).catch(e => {
        commonFunc.logger(e);
        reject(e);
      });
  });
};

module.exports = commonFunc;
