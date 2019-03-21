const SalonTokenStorage = artifacts.require('SalonTokenStorage');
const assertRevert = require('../helpers/assertRevert');

contract('SalonTokenStorage', (accounts) => {
  let storage;

  beforeEach(async () => {
    storage = await SalonTokenStorage.new();
  });

  it('Set and get name test', async () => {
    let name = await storage.getName();
    assert.equal(name, '');

    await storage.setName('salonToken');
    
    name = await storage.getName();
    assert.equal(name, 'salonToken');

    await assertRevert(storage.setName('salonToken1', {from: accounts[1]}));
    name = await storage.getName();
    assert.equal(name, 'salonToken');
  });
});
