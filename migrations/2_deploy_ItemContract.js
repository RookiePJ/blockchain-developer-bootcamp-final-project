const ItemContract = artifacts.require("ItemContract");

module.exports = function (deployer) {
  deployer.deploy(ItemContract);
};
