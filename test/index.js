var should = require('chai').should(),
    dbgcensus = require('../index'),
    censusQuery = dbgcensus.Query;

describe('#Configure a census query', function() {
  it('initialize query', function() {
    var query = new censusQuery('character', 'ps2', 'myServiceId');
    query.service.should.equal('character');
    query.namespace.should.equal('ps2');
    query.key.should.equal('myServiceId');
  });

  it('initialize query with no key', function() {
    var query = new censusQuery('character', 'ps2');
    query.key.should.equal('example');
  });

  it('convert query into url', function() {
    var query = new censusQuery('character', 'ps2', 'myServiceId');
    var url = query.toUrl();
    url.should.equal('http://census.daybreakgames.com/s:myServiceId/get/ps2/character/')
  });
});
