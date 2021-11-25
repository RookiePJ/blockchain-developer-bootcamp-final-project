//Constants
let ItemContract = artifacts.require("ItemContract");
let {catchRevert} = require("./exceptionsHelpers.js");
let BN = web3.utils.BN;

let DEBUG=true;       // set to true to get console log output

contract("ItemContract", function (accounts) {
  const [owner,        // the contract owner, only account that can create items.
    retailAccount1,    // a retailer (shop) owns the item in order to sell it on to a customer
    retailAccount2,
    customerAccount1,  // a customer owns the item, until they sell it to another customer
    customerAccount2,
    customerAccount3,
    outsideAccount1   // outside customer, never owns items but checks authentication
  ] = accounts;

  if (DEBUG === true) { console.log(accounts); }

    // create some test data
    const ITEM_NAME_1 = "Item Name 1";
    const ITEM_DESC_1 = "Item Description 1";
    const ITEM_UNIQUE_ID_1 = "Secert 1";
    const ITEM_NAME_2 = "Item Name 2";
    const ITEM_DESC_2 = "Item Description 2";
    const ITEM_UNIQUE_ID_2 = "Secert 2";
    const ITEM_NAME_3 = "Item Name 3";
    const ITEM_DESC_3 = "Item Description 3";
    const ITEM_UNIQUE_ID_3 = "Secert 3";
    const ITEM_NAME_4 = "Item Name 4";
    const ITEM_DESC_4 = "Item Description 4";
    const ITEM_UNIQUE_ID_4 = "Secert 4";
    const ITEM_UNIQUE_ID_HASH_1 = "0x3848543dad16541672a7d2cf64499d6b1bac3d5619f35e773c827ccbe9eb350b"
    const ITEM_UNIQUE_ID_HASH_2 = "0xcf4b0d11c61891b27677f4d932ad63d5923d87c8e38f92f1cbe5c4705907581d"
    const ITEM_UNIQUE_ID_HASH_3 = "0xbeb91ebbefcc484307c204b38da1aa73123295bbc4a7670893682c76f7e654a8"
    const ITEM_UNIQUE_ID_HASH_4 = "0xe5458a3032f8abc187e01a96f64b03803d06866f41a3c5a5712791cdf615716d"

    let itemAccountInstance;

    beforeEach( async () => {
      itemInstance = await ItemContract.new();
    });

    // Test for the existance of variables within the storage data
    // note - possibly way too much testing here, would drive other developers mad!
    describe("Storage Data", () => {
        it("Should have an contractOwner", async () => {
          assert.equal(typeof itemInstance.contractOwner, 'function', "the contract has no owner");
        });

        describe("Enum ItemState", () => {
          let enumItemState;
          before(() => {
            enumItemState = ItemContract.enums.ItemState;
            assert(enumItemState, "The contract should have a ItemState enum type");
          });
          it("should define `New` as a ItemState", () => {
            assert(enumItemState.hasOwnProperty('New'), "The enum does not have a `New` value");
          });
          it("should define `Retail` as a ItemState", () => {
            assert(enumItemState.hasOwnProperty('Retail'), "The enum does not have a `Retail` value");
          });
          it("should define `Customer` as a ItemState", () => {
            assert(enumItemState.hasOwnProperty('Customer'), "The enum does not have a `Customer` value");
          });
          it("should define `Distoryed` as a ItemState", () => {
            assert(enumItemState.hasOwnProperty('Destroyed'), "The enum does not have a `Destroyed` value");
          });
        }) // Enum ItemState
    }); // Storage Data

  // Use cases
  describe("Use cases", () => {

    // --> Create Item <-- createNewItem function
    it("createNewItem: Owner account should be able to create a new item", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const result = await itemInstance.getItemData.call(0);
      if (DEBUG === true) { console.log(result); }

      assert.equal(result[0], ITEM_NAME_1, "the name of the new item should match the expected value");
      assert.equal(result[1], ITEM_DESC_1, "the description of the new item should match the expected value");
      assert.equal(result[2].toString(10), ItemContract.ItemState.New, "the state of the new item should match the expected value");
      assert.equal(result[3], owner, "the itemCreatorAddress of the new item should match the expected value");
      assert.equal(result[4].toString(66), ITEM_UNIQUE_ID_HASH_1, "the unique id hash of the new item should match the expected value");
    });
    // createNewItem another function
    it("createNewItem: Owner account should be able to create another new item", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const result = await itemInstance.getItemData.call(0);
      if (DEBUG === true) { console.log(result); }

      assert.equal(result[0], ITEM_NAME_2, "the name of the new item should match the expected value");
      assert.equal(result[1], ITEM_DESC_2, "the description of the new item should match the expected value");
      assert.equal(result[2].toString(10), ItemContract.ItemState.New, "the state of the new item should match the expected value");
      assert.equal(result[3], owner, "the itemCreatorAddress of the new item should match the expected value");
      assert.equal(result[4].toString(66), ITEM_UNIQUE_ID_HASH_2, "the unique id hash of the new item should match the expected value");
    });
    // createNewItem create three new items
    it("createNewItem: Owner account should be able to create three new items", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const result1 = await itemInstance.getItemData.call(0);
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const result2 = await itemInstance.getItemData.call(1);
      await itemInstance.createNewItem(ITEM_NAME_3, ITEM_DESC_3, ITEM_UNIQUE_ID_3, {from: owner});
      const result3 = await itemInstance.getItemData.call(2);

      if (DEBUG === true) { console.log(result1); console.log(result2); console.log(result3); }
      // first item
      assert.equal(result1[0], ITEM_NAME_1, "the name of the new item should match the expected value");
      assert.equal(result1[1], ITEM_DESC_1, "the description of the new item should match the expected value");
      assert.equal(result1[2].toString(10), ItemContract.ItemState.New, "the state of the new item should match the expected value");
      assert.equal(result1[3], owner, "the itemCreatorAddress of the new item should match the expected value");
      assert.equal(result1[4].toString(66), ITEM_UNIQUE_ID_HASH_1, "the unique id hash of the new item should match the expected value");
      // second item
      assert.equal(result2[0], ITEM_NAME_2, "the name of the new item should match the expected value");
      assert.equal(result2[1], ITEM_DESC_2, "the description of the new item should match the expected value");
      assert.equal(result2[2].toString(10), ItemContract.ItemState.New, "the state of the new item should match the expected value");
      assert.equal(result2[3], owner, "the itemCreatorAddress of the new item should match the expected value");
      assert.equal(result2[4].toString(66), ITEM_UNIQUE_ID_HASH_2, "the unique id hash of the new item should match the expected value");
      // third item
      assert.equal(result3[0], ITEM_NAME_3, "the name of the new item should match the expected value");
      assert.equal(result3[1], ITEM_DESC_3, "the description of the new item should match the expected value");
      assert.equal(result3[2].toString(10), ItemContract.ItemState.New, "the state of the new item should match the expected value");
      assert.equal(result3[3], owner, "the itemCreatorAddress of the new item should match the expected value");
      assert.equal(result3[4].toString(66), ITEM_UNIQUE_ID_HASH_3, "the unique id hash of the new item should match the expected value");
    });

    // --> Authenticate <-- authenticateHistory(uint) function
    it("authenticateHistory(unit): authenticate history of item - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_3, ITEM_DESC_3, ITEM_UNIQUE_ID_3, {from: owner});
      const authHistoryResult1 = await itemInstance.authenticateHistory.call(0, {from: owner});
      assert.equal(authHistoryResult1, true, "authenticate item history should return true");
    });
    // authenticateOwner(uint, string) function
    it("authenticateOwner(uint, string): authenticate owner of item from owner account - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const authOwnerResult1 = await itemInstance.authenticateOwner(0, ITEM_UNIQUE_ID_1, {from: owner});
      assert.equal(authOwnerResult1, true, "authenticate item owner should return true");
    });

    // authenticateOwner(uint, string) function - false
    it("authenticateOwner(uint, string): authenticate owner of item from owner account with incorrect secret - should return false", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const authOwnerResult2 = await itemInstance.authenticateOwner(0, ITEM_UNIQUE_ID_3, {from: owner});
      assert.equal(authOwnerResult2, false, "authenticate item owner should return false");
    });

    // authenticateHistoryOwner(uint, string) function
    it("authenticateHistoryOwner(uint, string): authenticate history/owner of item from owner account - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const authOwnerResult1 = await itemInstance.authenticateHistoryOwner(0, ITEM_UNIQUE_ID_2, {from: owner});
      assert.equal(authOwnerResult1, true, "authenticate item history/owner should return true");
    });
    // authenticateHistoryOwner(uint, string) function - false
    it("authenticateHistoryOwner(uint, string): authenticate history/owner of item from owner account with incorrect secret - should return false", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const authOwnerResult2 = await itemInstance.authenticateHistoryOwner(0, ITEM_UNIQUE_ID_3, {from: owner});
      assert.equal(authOwnerResult2, false, "authenticate item history/owner should return false");
    });

    // checkUniqueIdHash function
    it("checkUniqueIdHash: Check unique id hash should return true when passed the correct unique id", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const result3 = await itemInstance.checkUniqueIdHash(0, ITEM_UNIQUE_ID_1, {from: owner});
      assert.equal(result3, true, "checking unique id hash should return true");
    });
    // checkUniqueIdHash function - false
    it("checkUniqueIdHash: Check unique id hash should return false when passed the incorrect unique id", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const result4 = await itemInstance.checkUniqueIdHash(0, ITEM_UNIQUE_ID_2, {from: owner});
      assert.equal(result4, false, "checking unique id hash should return false");
    });
    // --> Destory Item <--
    it("destroyItem(uint, string): owner should be able to destory item - delete item and burn nft", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const burnt1 = await itemInstance.destroyItem(0, ITEM_UNIQUE_ID_2, {from: owner});
      if (DEBUG === true) { const result = await itemInstance.getItemData.call(0); console.log(result); }
    });
    // --> Transfer Item <--
    it("transferToAddress(address, uint): should be able to transfer item and nft", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const transfer1 = await itemInstance.transferToAddress(retailAccount1, 1, {from: owner});
      if (DEBUG === true) { const result = await itemInstance.getItemData.call(0); console.log(result); }
    });
    it("transferToAddress(address, uint): should be able to transfer (x2) item and nft", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const transfer1 = await itemInstance.transferToAddress(retailAccount1, 1, {from: owner});
      const transfer2 = await itemInstance.transferToAddress(customerAccount1, 1, {from: retailAccount1});
      if (DEBUG === true) { const result = await itemInstance.getItemData.call(0); console.log(result); }
    });
    // --> Full lifecycle use case <--
    it("A full lifecycle use case; create, transfer, authenticate, destroy", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const authOwnerResultF1 = await itemInstance.authenticateHistoryOwner(0, ITEM_UNIQUE_ID_1, {from: owner});
      // to retail account 1 and authorise
      const transferF1 = await itemInstance.transferToAddress(retailAccount1, 1, {from: owner});
      const authOwnerResultF2 = await itemInstance.authenticateHistoryOwner(0, ITEM_UNIQUE_ID_1, {from: retailAccount1});
      // to customer account 1 and authorise
      const transferF2 = await itemInstance.transferToAddress(customerAccount1, 1, {from: retailAccount1});
      const authOwnerResultF3 = await itemInstance.authenticateHistoryOwner(0, ITEM_UNIQUE_ID_1, {from: customerAccount1});
      // to owner and then destoryed
      const transferF3 = await itemInstance.transferToAddress(owner, 1, {from: customerAccount1});
      const burntF = await itemInstance.destroyItem(0, ITEM_UNIQUE_ID_1, {from: owner});

      if (DEBUG === true) { const result = await itemInstance.getItemData.call(0); console.log(result); }
    });

    /* -- todo
    // authenticateHistory(address) function
    it("authenticateHistory(address): authenticate history of item from non item owner account - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const authHistoryResult2 = await itemInstance.authenticateHistory(owner, {from: outsideAccount1});
      assert.equal(authHistoryResult2, true, "authenticate item history should return true");
    });

    // authenticateOwner(address, string) function
    it("authenticateOwner(address, string): authenticate owner of item from non owner account - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const authOwnerResult3 = await itemInstance.authenticateOwner(owner, ITEM_UNIQUE_ID_2, {from: outsideAccount1});
      assert.equal(authOwnerResult3, true, "authenticate item owner should return true");
    });
    // authenticateOwner(address, string) function - false
    it("authenticateOwner(address, string): authenticate owner of item from non owner account with incorrect secret - should return false", async () => {
      await itemInstance.createNewItem(ITEM_NAME_3, ITEM_DESC_3, ITEM_UNIQUE_ID_3, {from: owner});
      const authOwnerResult2 = await itemInstance.authenticateOwner(owner, ITEM_UNIQUE_ID_1, {from: outsideAccount1});
      assert.equal(authOwnerResult2, false, "authenticate item owner should return false");
    });

    // authenticateHistoryOwner(address, string)
    it("authenticateHistoryOwner(address, string): authenticate history/owner of item from non owner account - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const authOwnerResult3 = await itemInstance.authenticateHistoryOwner(owner, ITEM_UNIQUE_ID_2, {from: outsideAccount1});
      assert.equal(authOwnerResult3, true, "authenticate item history/owner should return true");
    });
    // authenticateOwner(address, string) function - false
    it("authenticateHistoryOwner(address, string): authenticate history/owner of item from non owner account with incorrect secret - should return false", async () => {
      await itemInstance.createNewItem(ITEM_NAME_3, ITEM_DESC_3, ITEM_UNIQUE_ID_3, {from: owner});
      const authOwnerResult2 = await itemInstance.authenticateHistoryOwner(owner, ITEM_UNIQUE_ID_1, {from: outsideAccount1});
      assert.equal(authOwnerResult2, false, "authenticate item history/owner should return false");
    });
    */

    });

  // Admin / Pausable / Owner / Security Functions
  describe("Admin / Pausable / Onwer / Security Functions", () => {
    // --> Pausing Contract <--
    it("Contract owner should be able to pause the contract", async () => {
      const pause = await itemInstance.pause({from: owner});
      const pauseResult = await itemInstance.paused({from: owner});
      assert.equal(pauseResult, true, "checking that the contract has been paused");
    });
    it("Contract owner should be able to unpause the contract", async () => {
      const pause = await itemInstance.pause({from: owner});
      const unpause = await itemInstance.unpause({from: owner});
      const unPauseResult = await itemInstance.paused({from: owner});
      assert.equal(unPauseResult, false, "checking that the contract has been unpaused (after being first paused)");
    });
    it("Paused contract should not be able to create a new item whenNotPaused() modifier", async () => {
      const pause = await itemInstance.pause({from: owner});
      await catchRevert(
        itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner})
      );
    });
    it("NoncContract owner should not be able to pause the contract", async () => {
      await catchRevert( itemInstance.pause({from: outsideAccount1}) );
    });
    // --> Creating <-- createNewItem function from non contract owner account - should fail - revert due to modifier isContractOwner
    it("createNewItem: Retail account should not be able to create a new item", async () => {
      await catchRevert(
        itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: retailAccount2})
      );
    });
    // --> Burning <-- Ower should be able to burn item / nft
    it("Contract owner should be able to burn item and nft", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const burnt1 = await itemInstance.destroyItem(0, ITEM_UNIQUE_ID_1, {from: owner});
      if (DEBUG === true) { const result = await itemInstance.getItemData.call(0); console.log(result); }
    });
    // non owner should not be able to burn item / nft
    it("Non contract owner should not be able to burn item and nft", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      await catchRevert( itemInstance.destroyItem(0, ITEM_UNIQUE_ID_2, {from: retailAccount1}) );
    });
    it("Contract owner providing the wrong secret phrase should not be able to burn item and nft", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      await catchRevert( itemInstance.destroyItem(0, ITEM_UNIQUE_ID_3, {from: owner}) );
    });
    // --> Transfer Item <--
    it("transferToAddress(address, uint): Non item owner should not be able to transfer item and nft", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      await catchRevert( itemInstance.transferToAddress(retailAccount1, 1, {from: retailAccount1}) );
      if (DEBUG === true) { const result = await itemInstance.getItemData.call(0); console.log(result); }
    });
    /* Todo code is not working
    // --> Approve <--
    it("Contract owner should be able to approve address for token transfer", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const approveResult = await itemInstance.approveAddress(retailAccount1, {from: owner});
      console.log("approveResult " + approveResult);
      assert.equal(approveResult, true, "checking that the address has been approved");
    });
    */
  }) // End of Admin / Owner / Security Functions

});  // contract ItemContract
