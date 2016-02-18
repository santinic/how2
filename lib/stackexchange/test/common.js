global.chai = require('chai');
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');
global.expect = global.chai.expect;

global.chai.use(global.sinonChai);
global.chai.Assertion.includeStack = true;
