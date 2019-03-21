var SalonToken = artifacts.require("./SalonToken.sol");
var Salon = artifacts.require("./Salon.sol");

// module.exports = function (deployer) {
//   deployer.deploy(SalonToken, "AnHui Blockchain Salon Token", "AHBC", 18);
// };

module.exports = function(deployer) {
  deployer.deploy(SalonToken,"AnHui Blockchain Salon Token", "AHBC", 18).then(function() {
    return deployer.deploy(Salon, SalonToken.address);
  });
};