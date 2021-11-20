//Constants
let ItemContract = artifacts.require("ItemContract");

//const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper");
let {catchRevert} = require("./exceptionsHelpers.js");    // taken from the consensys supply chain exercise

contract("ItemContract", function (accounts) {
  const [owner,        // the contract owner, only account that can create items.
    retailAccount1,    // a retailer (shop) owns the item in order to sell it on to a customer
    retailAccount2,
    customerAccount3,  // a customer owns the item, until they transfer it to another customer
    customerAccount4,
    customerAccount5,
    outsideAccount1   // outside customer, never owns items but checks authentication by calling functions with the owner account address
  ] = accounts;

    // create some test item data
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
        it("Should have an owner", async () => {
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
            assert(enumItemState.hasOwnProperty('Distoryed'), "The enum does not have a `Distoryed` value");
          });
        }) // Enum ItemState

        /** NOT WORKING 
        describe("Item struct", () => {
          let itemStruct;
          before(() => {
            itemStruct = ItemStruct(ItemContract);

            console.log(itemStruct);

            assert(itemStruct !== null, "The contract should define an `Item Struct`");
          });
          it("should have a `itemName`", () => {
            assert(isDefined(itemStruct)("itemName"), "Struct Item should have a `itemName` member");
            //assert(isType(itemStruct)("itemName")("string"), "`itemName` should be of type `string`");
          });
        }); // Item struct
        */
    }); // Storage Data

  // Use cases
  describe("Use cases", () => {

    // createNewItem function
    it("createNewItem: Owner account should be able to create a new item", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const result = await itemInstance.getItemData.call(owner);
      //console.log(result);
      assert.equal(result[0], ITEM_NAME_1, "the name of the new item should match the expected value");
      assert.equal(result[1], ITEM_DESC_1, "the description of the new item should match the expected value");
      assert.equal(result[2].toString(10), ItemContract.ItemState.New, "the state of the new item should match the expected value");
      assert.equal(result[3], owner, "the itemCreatorAddress of the new item should match the expected value");
      assert.equal(result[4].toString(66), ITEM_UNIQUE_ID_HASH_1, "the unique id hash of the new item should match the expected value");
    });
    // createNewItem function from non contract owner account - should fail - revert due to modifier isContractOwner
    it("createNewItem: Retail account should not be able to create a new item", async () => {
      await catchRevert(
        itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: retailAccount2})
      );
    });

    // authenticateHistory() function
    it("authenticateHistory(): authenticate history of item - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_3, ITEM_DESC_3, ITEM_UNIQUE_ID_3, {from: owner});
      const authHistoryResult1 = await itemInstance.authenticateHistory.call(owner);
      assert.equal(authHistoryResult1, true, "authenticate item history should return true");
    });
    // authenticateHistory(address) function
    it("authenticateHistory(address): authenticate history of item from non item owner account - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const authHistoryResult2 = await itemInstance.authenticateHistory(owner, {from: outsideAccount1});
      assert.equal(authHistoryResult2, true, "authenticate item history should return true");
    });

    // authenticateOwner(string) function
    it("authenticateOwner(string): authenticate owner of item from owner account - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const authOwnerResult1 = await itemInstance.authenticateOwner(ITEM_UNIQUE_ID_1, {from: owner});
      assert.equal(authOwnerResult1, true, "authenticate item owner should return true");
    });
    // authenticateOwner(string) function - false
    it("authenticateOwner(string): authenticate owner of item from owner account with incorrect secret - should return false", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const authOwnerResult2 = await itemInstance.authenticateOwner(ITEM_UNIQUE_ID_3, {from: owner});
      assert.equal(authOwnerResult2, false, "authenticate item owner should return false");
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

    // authenticateHistoryOwner(string) function
    it("authenticateHistoryOwner(string): authenticate history/owner of item from owner account - should return true", async () => {
      await itemInstance.createNewItem(ITEM_NAME_2, ITEM_DESC_2, ITEM_UNIQUE_ID_2, {from: owner});
      const authOwnerResult1 = await itemInstance.authenticateHistoryOwner(ITEM_UNIQUE_ID_2, {from: owner});
      assert.equal(authOwnerResult1, true, "authenticate item history/owner should return true");
    });
    // authenticateHistoryOwner(string) function - false
    it("authenticateHistoryOwner(string): authenticate history/owner of item from owner account with incorrect secret - should return false", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const authOwnerResult2 = await itemInstance.authenticateHistoryOwner(ITEM_UNIQUE_ID_3, {from: owner});
      assert.equal(authOwnerResult2, false, "authenticate item history/owner should return false");
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

    // checkUniqueIdHash function
    it("checkUniqueIdHash: Check unique id hash should return true when passed the correct unique id", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const result3 = await itemInstance.checkUniqueIdHash(owner, ITEM_UNIQUE_ID_1, {from: owner});
      assert.equal(result3, true, "checking unique id hash should return true");
    });
    // checkUniqueIdHash function
    it("checkUniqueIdHash: Check unique id hash should return false when passed the incorrect unique id", async () => {
      await itemInstance.createNewItem(ITEM_NAME_1, ITEM_DESC_1, ITEM_UNIQUE_ID_1, {from: owner});
      const result4 = await itemInstance.checkUniqueIdHash(owner, ITEM_UNIQUE_ID_2, {from: owner});
      assert.equal(result4, false, "checking unique id hash should return true");
    });

    // transfer function

  }); // Use Cases

  // others itemAccount1 should not be able to creaete new items

});  // contract ItemContract
