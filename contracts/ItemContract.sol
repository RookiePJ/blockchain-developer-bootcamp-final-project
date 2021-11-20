// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Change Log
// Date     | Who | Why is was done                     | What was done
//          |     |                                     |
// 16/11/21 | PJR | Created inital function headers     | stucture of contract drafted - functions, modifiers, events
// 17/11/21 | PJR | Storage data needed                 | added stuct and mapping, contract owner address
// 18/11/21 | PJR | Proof of ownership untility hash    | added hashing functions (with tests)
// 19/11/21 | PJR | Reduced complexity                  | removed some of the types in the item storage stuct (may revisit - time dependant)
// 19/11/21 | PJR | Ability to create item by owner     | add item function with modifer added
// 19/11/21 | PJR | Authorisation functionality needed  | implemented the authorisation functionality (with tests)

// Todo     | PJR | Difficult to modify mapping types   | use open zepplin set library to hold item stuct mapping and rework code
// Todo     | PJR | Change owner required               | implement and create tests
// Todo     | PJR | Increase contract security owner    | implement ower functionality from open zepplin
// Todo     | PJR | Record ownership history            | implement some sort of history ownership
// Todo     | PJR | Ability to pay in ether for items   | implement payments when transfer items (not part of original scope)


// General notes and known issues
// 1) The proof of historic ownership tracing back ownership is somewhat redundant as only the owner can create items.
//    Only authentic item exist anyway!  Exercise was a programming not a practical solution so left basic functionality in.
// 2) Code has a bad smell, with too many functions with not much code. Possibly needs refactoring.


/// @title Item proof of ownership contract
/// @author Peter Rooke
/// @notice Allows authentication of items using owership history and/or by providing a unique identification

contract ItemContract {

/** Storage Data */

  enum ItemState { New, Retail, Customer, Distoryed }  // State of the item

  /// @notice contractOwner - account used to mint and to trace back to for authentication
  address public contractOwner;      // @dev The address of the contracts owner, given by the deployment address

  struct Item {
      string itemName;
      string itemDescription;
      ItemState itemState;
      address itemCreatorAddress;
      bytes32 itemUniqueHash;      // @dev Hold a hash value of a unqiue identifier for the item. ZKP by compairing hashs
  }

  mapping(address => Item) items;  /// @dev Each item is mapped to its owners address.

  // To be used to provide owership history - maybe!
  //address[] previousOwners;        /// @dev array of previous owners - previousOwner[0] will always be the creator
  //uint previousOwnersIndex;        /// @dev keep a count of the prevous owners


/* **Events** */

  /// @notice event log when an item has changed owner address
  /// @param _oldOwner the previous owners address
  /// @param _newOwner the new owners address
  /// @param _oldItemState old state
  /// @param _newItemState new state
  event ItemOwerChangedEvent(address _oldOwner, address _newOwner,
                             ItemState _oldItemState, ItemState _newItemState);

  /// @notice event log when an item has been authenticated
  /// @param _owner owners address
  /// @param _isAuthentic boolean
  event AuthenticateEvent(address _owner, bool _isAuthentic);


/* **Modifiers** */

  /// @notice check that the account address calling the function is the owner of the contract
  /// @param _accountAddress - account address
  modifier isContractOwner(address _accountAddress) {
    require(_accountAddress == contractOwner, "Only the contract owner can perform this");
    _;
  }

  /// @notice check that the account address is the current owner address given in the items mapping
  /// @param _accountAddress - account address
  modifier isItemOwner(address _accountAddress) { _; }

/* **Functions** */

  /** --> Constuctor */
  constructor() { contractOwner = msg.sender; }


  /** --> Fallback functions */

  /** --> Creation function */

  /// @notice create a new item if the calling address is the contract owner
  /// @param _itemName - short name for the item
  /// @param _itemDescription - short description
  /// @param _uniqueId - a secret which is used to help authentice the item.
  /// @dev _uniqueId becomes a hashcode which is then stored as a basic zero knownledge proof
  function createNewItem(
      string memory _itemName,
      string memory _itemDescription,
      string memory _uniqueId)
      public
      isContractOwner(msg.sender)
      returns (bool newItemCreatedSuccess)
  {
      newItemCreatedSuccess = false;
      bytes32 itemUniqueHashNew = generateUniqueIdHash(_uniqueId);

      Item memory itemNew = Item({
        itemName: _itemName,
        itemDescription: _itemDescription,
        itemState: ItemState.New,
        itemCreatorAddress: msg.sender,
        itemUniqueHash: itemUniqueHashNew
      });
      items[msg.sender] = itemNew;
      return (newItemCreatedSuccess = true);
  }

  /** --> Transfer item ownership functions */

   /// @notice transfer the item to a new owner address and change its state
   /// -param {msg.sender} - current owner of the item
   /// @param _toAddress - the new owner of the item
   /// @param _newItemState - the new state after the item has been transfered
   /// @return transferSuccess - true if transfer was completed or false if msg.sender does not own the item or if problems are encountered
  function transfer(address _toAddress, ItemState _newItemState)
      public
      isItemOwner(msg.sender)
      returns (bool transferSuccess) {
         // how will this work!
         // items is referenced by its owners address....
         // pull all data out and put it back with new owner?
  }

   /// @notice transfer the item from an old owers address to a new owner and change its state
   /// @param _fromAddress - current item owners address
   /// @param _toAddress - the new owner of the item
   /// @param _newItemState - the new state after the item has been transfered
   /// @return transferSuccess - true if transfer was completed or false if _fromAddress does not own the item or if problems are encountered
  function transfer(address _fromAddress, address _toAddress, ItemState _newItemState)
      public
      isItemOwner(_fromAddress)
      returns (bool transferSuccess)  { }

  /** --> History authentication functions */

   /// @notice authenticate item history using owners {msg.sender} address
   /// -param {msg.sender} - the current owners address 
   /// @return isAuthentic - true if the owners address can be traced back to the original verified minter (creator) or false if not
  function authenticateHistory()
     public
     view
     isItemOwner(msg.sender)
     returns (bool isAuthentic) {
         address originalOwner = items[msg.sender].itemCreatorAddress;
         return (originalOwner == contractOwner);
     }

   /// @notice authenticate item history by providing the owners address
   /// @param _ownerAddress - the address of the item(s) current owner
   /// @return isAuthentic - true if the provided address can be traced back to the original verified minter (creator) or false if not
  function authenticateHistory(address _ownerAddress)
     public
     view
     isItemOwner(_ownerAddress)
     returns (bool isAuthentic) {
         address originalOwner = items[_ownerAddress].itemCreatorAddress;
         return (originalOwner == contractOwner);
     }

  /** --> Owner authentication function */

   /// @notice authenticate item by compairing the hash code of the provided _uniqueId with the stored hash code of the item
   /// -param {msg.sender} - the account address that called the function - should be the owner of the item
   /// @param _uniqueId - a unique id that can be used to tie to a physical item - car registration number, serial num
   /// @return isAuthentic - true (called by the owners account) and (the hash codes match) - false (if not the owner) or (hash codes do not match)
  function authenticateOwner(string memory _uniqueId)
     public
     view
     isItemOwner(msg.sender)
     returns (bool isAuthentic) { isAuthentic = checkUniqueIdHash(msg.sender, _uniqueId); }

  /// @notice authenticate item by compairing the hash code of the provided unique id with the stored hash code of an item owned by _ownersAddress
  /// @param _ownerAddress - the address of the item(s) current owner
  /// @param _uniqueId - a unique id that can be used to tie to a physical item - car registration number, serial num
  /// @notice called by an non owner address who has knowledge (consent) of the actual owners address
  /// @return isAuthentic - true (_ownersAddress owns the item) and (the hash codes match) - false (_ownersAddress does not own the item) or (the hash codes do not match)
  function authenticateOwner(address _ownerAddress, string memory _uniqueId)
      public
      view
      isItemOwner(_ownerAddress)
      returns (bool isAuthentic) { isAuthentic = checkUniqueIdHash(_ownerAddress, _uniqueId); }

  /** --> Owner and History authentication functions */

  /// @notice authenticateHistoryOwner authenticate item using both its owners history and owners unique id
  /// -param {msg.sender} the account address of the items owner
  /// @param _uniqueId the unique id taken from the physical item
  /// @notice called by the owners address who has knowledge of the items unique id
  /// @return isAuthentic - true (msg.sender owns the item) and (the hashes match) - false (msg.sender is not owner) or (hashes do not match)
  function authenticateHistoryOwner(string memory _uniqueId)
     public
     view
     isItemOwner(msg.sender)
     returns (bool isAuthentic) {
        bool historyAuthentic = authenticateHistory();
        bool ownerAuthentic = authenticateOwner(_uniqueId);
        return (historyAuthentic && ownerAuthentic);
  }

  /// @notice authenticateHistoryOwner authenticate item using both its owner history and owners unique id
  /// @param _ownerAddress - the account address of the items owner
  /// @param _uniqueId - a unqiue id taken from the physical item
  /// @notice called by an non owner address who has knowledge (consent) of the actual owners address and knows the items uniqie id
  /// @return isAuthentic - true (_ownerAddress owns the item) and (the hashes match) - false (does not own the item) or (the hashes do not match)
  function authenticateHistoryOwner(address _ownerAddress, string memory _uniqueId)
     public
     view
     isItemOwner(_ownerAddress)
     returns (bool isAuthentic) {
        bool historyAuthentic = authenticateHistory(_ownerAddress);
        bool ownerAuthentic = authenticateOwner(_ownerAddress, _uniqueId);
        return (historyAuthentic && ownerAuthentic);
  }

  /** --> Helper functions */

  /// @notice check the hash of the _uniqueId param compaired to to stored hash for the item in order to find if they are the same
  /// @dev a very simplistic zero knownledge proof - the item owner is able to verify using a secret that ties to the physical item
  /// @param _ownerAddress - the item  owners address
  /// @param _uniqueId - a string known to the items owner
  /// @return isAuthentic - true if both hash codes are the same - false if the hash codes are not the same
  function checkUniqueIdHash(address _ownerAddress, string memory _uniqueId)
     public
     view
     returns (bool isAuthentic) {
       bytes32 uniqueIdHash = generateUniqueIdHash(_uniqueId);
       return (items[_ownerAddress].itemUniqueHash == uniqueIdHash);
  }

  /// @notice storeUniqueIdHash store a given _uniqueIdHash to the item
  /// -param msg.sender - the account address calling - has to be the contract owner who mints/creates the original 
  /// @param _uniqueIdHash - the generated zKP hash code to store with the item
  /// @notice given the unique id hash value at minting time, store it with the assocated item
  /// @return storedHashSuccess - true (is the contract owner) and (hash code has been stored) - false (not owner) or (not stored)
  function storeUniqueIdHash(bytes32 _uniqueIdHash)
     private isContractOwner(msg.sender)
     returns (bool storedHashSuccess) { }

  /// @notice generateUniqueIdHash given an unique id generate its hash code. A simple zero knowledge proof
  /// @param _uniqueId - a unique id to tie to the physical item (example - car registration / item serial number)
  /// @return uniqueIdHash - the hash code of _uniqueId
  function generateUniqueIdHash(string memory _uniqueId)
     private
     pure
     returns (bytes32 uniqueIdHash)
     {  uniqueIdHash = keccak256(abi.encodePacked(_uniqueId));  }

  /** --> Test Helper functions */

  /// @notice getItemData - helper function that returns the item stuct data
  /// @param _ownerAddress - the owners address who owns the item
  /// @return itemName itemDescription itemState itemCreatorAddress itemUniqueHash
  function getItemData(address _ownerAddress)
      public
      view
      returns(
        string memory itemName,
        string memory itemDescription,
        uint itemState,
        address itemCreatorAddress,
        bytes32 itemUniqueHash)
  {
      itemName = items[_ownerAddress].itemName;
      itemDescription = items[_ownerAddress].itemDescription;
      itemState = uint(items[_ownerAddress].itemState);
      itemCreatorAddress = items[_ownerAddress].itemCreatorAddress;
      itemUniqueHash = items[_ownerAddress].itemUniqueHash;
  }

} // end of ItemContract
