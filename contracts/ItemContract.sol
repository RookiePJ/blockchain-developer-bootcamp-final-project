// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Change Log
// Date     | Who | Why is was done                     | What was done
//          |     |                                     |
// 16/11/21 | PJR | Created inital function headers     | stucture of contract drafted - functions, modifiers, events
// 17/11/21 | PJR | Storage data needed                 | added stuct and mapping, contract owner address
// 18/11/21 | PJR | Proof of ownership untility hash    | added hashing functions (with tests)
// 19/11/21 | PJR | Reduced complexity                  | removed some of the types in the item storage stuct (may revisit - time dependant)
// 19/11/21 | PJR | Ability to create item by owner     | add item function with modifer added
// 19/11/21 | PJR | Authorisation functionality needed  | implemented the authorisation functionality (with tests)
// 22/11/21 | PJR | Don't reinventing the Owner wheel   | decided to implement openZepplin Ownable design pattern, refactor code.
// 22/11/21 | PJR | Found functionality in Oz preset    | merged existing code with the NFT preset ERC1155PresetMinterPauser from open zepplin
// 23/11/21 | PJR | Ability to destroy                  | created function to burn nft and blank out item (logical delete)

// Todo     | PJR | Change to single struct (see below) | remove mapping, just use a single stuct item for each NFT, and then change all the tests
// Todo     | PJR | Tranfer and change owner required   | implement and create tests
// Todo     | PJR | Record ownership history            | implement some sort of history ownership
// Todo     | PJR | Ability to pay in ether for items   | implement payments when transfer items (not part of original scope)

// General notes and known issues
// 1) The proof of historic ownership tracing back ownership is somewhat redundant as only the owner can create items.
//    Only authentic item exist anyway!  Exercise was a programming not a practical solution so left basic functionality in.
// 2) Code has a bad smell, with too many functions with not much code. Possibly needs refactoring.
// 3) Data stucture mapping is not really needed - should really just be a single stuct item for a token!
//    Also token data standard seems to be held off-chain in some URI JSON - todo as its now too late to rework!

/// @title Item proof of ownership contract
/// @author Peter Rooke
/// @notice Allows authentication of items using owership history and/or by providing a unique identification
/// @dev based upon the ERC1155PresetMinterPauser.sol preset sample code as it offers the ability to mint, pause, and role based access for an ERC1155 NFT token
/// @dev my existing functions now provide a wrapper around the base ERC functions

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev {ERC1155} token, including:
 *  - ability for holders to burn (destroy) their tokens
 *  - a minter role that allows for token minting (creation)
 *  - a pauser role that allows to stop all token transfers
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract ItemContract is Context, AccessControlEnumerable, ERC1155Burnable, ERC1155Pausable, Ownable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /** Storage Data */
    address public contractOwner;      // @dev The address of the contracts owner, given by the deployment address

    /// todo
    uint public constant ITEM_TYPE_CUSTOM = 0;
    uint public constant ITEM_TYPE_DIAMOND = 1;
    uint public constant ITEM_TYPE_RUBY = 2;
    uint public constant ITEM_TYPE_SAPHIRE = 3;
    uint public constant ITEM_TYPE_GOLD = 4;
    uint public constant ITEM_TYPE_SILVER = 5;


    /// @dev hold extra information for each item token
    uint itemCount;
    mapping (uint => Item) items;  // @dev items is indexed by the item type. For now we only mint one (NFT) of each (balance=1)
    struct Item {
      string itemName;             // @dev short name
      string itemDescription;      // @dev short description
      ItemState itemState;         // @dev the current state of the item
      address itemCreatorAddress;  // @dev a record of the creators address
      bytes32 itemUniqueHash;      // @dev hold a hash value of a unqiue identifier for the item. ZKP by compairing hashs
    }
    enum ItemState { New, Retail, Customer, Destroyed }  // State of the item


/* **Events** */
  /// @notice event after a new item has been created
  /// @param _owner - owner address
  /// @param _itemIndex - the item index
  /// @param _itemName - item name
  /// @param _itemDescription - item description
  /// @param _itemState - item state
  /// @param _itemCreatorAddress - creator address (owner)
  /// @param _itemUniqueHash - unique hash of sercet
  event CreatedItemEvent(
      address _owner,
      uint _itemIndex,
      string _itemName,
      string _itemDescription,
      ItemState _itemState,
      address _itemCreatorAddress,
      bytes32 _itemUniqueHash
  );

  /// @notice event log when an item has changed owner address
  /// @param _oldOwner the previous owners address
  /// @param _newOwner the new owners address
  /// @param _oldItemState old state
  /// @param _newItemState new state
  event ItemOwerChangedEvent(
      address _oldOwner,
      address _newOwner,
      ItemState _oldItemState,
      ItemState _newItemState
  );

  /// @notice event log when an item has been authenticated
  /// @param _owner owners address
  /// @param _itemIndex the index number of the item
  /// @param _isAuthentic boolean
  event AuthenticateEvent(address _owner, uint _itemIndex, bool _isAuthentic);


/* **Modifiers** */

  /// todo - grap the owner address compair with msg.sender
  /// @notice check that the account address is the current owner address given in the items mapping
  /// @param _accountAddress - account address
  modifier onlyItemOwner(address _accountAddress) { _; } // do something with address a = ownerOf(uint tokenId)

/* **Functions** */

    /** --> Constuctor */
    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, and `PAUSER_ROLE` to the account that deploys the contract.
     * @dev store the contract owner address
     */
    constructor() ERC1155("") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        contractOwner = msg.sender;
    }

    // original - but for now we don't need a url to an image or meta data
    //constructor(string memory uri) ERC1155(uri) {
    //    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    //    _setupRole(MINTER_ROLE, _msgSender());
    //    _setupRole(PAUSER_ROLE, _msgSender());
    //    contractOwner = msg.sender;
    // }


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
      onlyOwner()
      whenNotPaused()
      returns (bool newItemCreatedSuccess)
   {
      newItemCreatedSuccess = false;
      bytes32 itemUniqueHashNew = generateUniqueIdHash(_uniqueId);

      Item memory item = Item({
        itemName: _itemName,
        itemDescription: _itemDescription,
        itemState: ItemState.New,
        itemCreatorAddress: msg.sender,
        itemUniqueHash: itemUniqueHashNew
      });
      items[itemCount++] = item;       // @dev use value and then ++ (so zero is first element)
      _mint(msg.sender, 1, 1, "");     // @dev for now we are just creating one of one type of NFT (todo different types)
      emit CreatedItemEvent(
          msg.sender,
          itemCount,
          items[itemCount].itemName,
          items[itemCount].itemDescription,
          items[itemCount].itemState,
          items[itemCount].itemCreatorAddress,
          items[itemCount].itemUniqueHash);
      return (newItemCreatedSuccess = true);
  }

  /* todo - unable to get a clean unit test to pass for this code - not sure why - and no time!
  /// @notice allow contract owner to approve an address so that it can transfer
  /// @param _addressToApprove - the address to approve
  /// @return approvedAddressSuccess - return value (applogies, compiler enforces descriptions!)
  function approveAddress(address _addressToApprove)
     public
     onlyOwner()
     whenNotPaused()
     returns (bool approvedAddressSuccess)
  {
     //approve(_addressToApprove, 1);
     setApprovalForAll(_addressToApprove, true);   // since we only have one token type anyway!
     approvedAddressSuccess = isApprovedForAll(msg.sender, _addressToApprove);
  }
  */

  /// @notice todo transfer item after approval
  /// -param _to
  /// -param _itemIndex
  /// -return transferItemSuccess
  /** function transferItem(address _to, _itemIndex) returns (bool transferItemSuccess) */


  /// @notice destory an item if the correct secret is given. Logicical delete and burn nft
  /// @notice must be the contract owner
  /// @param _itemIndex the index for the item to be destroyed
  /// @param _uniqueId the secert phrase is required to remove the item
  /// @return itemBurntSuccess - true if logicially deleted and nft burnt - false if otherwise
  function destroyItem(
      uint _itemIndex,
      string memory _uniqueId)
      public
      onlyOwner()
      whenNotPaused()
      returns (bool itemBurntSuccess) {
        if (checkUniqueIdHash(_itemIndex, _uniqueId)) {
            items[_itemIndex].itemName = "deleted";   /// @dev do a logicical delete
            items[_itemIndex].itemDescription = "deleted";
            items[_itemIndex].itemState = ItemState.Destroyed;
            items[_itemIndex].itemCreatorAddress = address(0x0);
            items[_itemIndex].itemUniqueHash = "0-deleted-0";
            burn(msg.sender, 1, 1);
            itemBurntSuccess = true;
        } else {
          itemBurntSuccess = false;
          revert("destroyItem: incorrect unique secret provided, unable to destroy item");
        }
  }

  /// @notice authenticate item history using owners {msg.sender} address
  /// -param {msg.sender} - the current owners address.
  /// @param _itemIndex index of the item to check
  /// @return isAuthentic - true if the owners address can be traced back to the original verified minter (creator) or false if not
  function authenticateHistory(uint _itemIndex)
     public
     view
     onlyItemOwner(msg.sender)
     returns (bool isAuthentic) {
       isAuthentic = (items[_itemIndex].itemCreatorAddress == contractOwner);
       //emit AuthenticateEvent(msg.sender, _itemIndex, isAuthentic);
  }

   /** --> Owner authentication function */

   /// @notice authenticate item by compairing the hash code of the provided _uniqueId with the stored hash code of the item
   /// -param {msg.sender} - the account address that called the function - should be the owner of the item
   /// @param _itemIndex - the item index
   /// @param _uniqueId - a unique id that can be used to tie to a physical item - car registration number, serial num
   /// @return isAuthentic - true (called by the owners account) and (the hash codes match) - false (if not the owner) or (hash codes do not match)
  function authenticateOwner(uint _itemIndex, string memory _uniqueId)
     public
     view
     onlyItemOwner(msg.sender)
     returns (bool isAuthentic) {
     return (checkUniqueIdHash(_itemIndex, _uniqueId));
       //isAuthentic = checkUniqueIdHash(_itemIndex, _uniqueId);
       //emit AuthenticateEvent(msg.sender, _itemIndex, isAuthentic);
       //return (true);
   }


  /** --> Owner and History authentication functions */

  /// @notice authenticateHistoryOwner authenticate item using both its owners history and owners unique id
  /// -param {msg.sender} the account address of the items owner
  /// @param _itemIndex - the item index
  /// @param _uniqueId the unique id taken from the physical item
  /// @notice called by the owners address who has knowledge of the items unique id
  /// @return isAuthentic - true (msg.sender owns the item) and (the hashes match) - false (msg.sender is not owner) or (hashes do not match)
  function authenticateHistoryOwner(uint _itemIndex, string memory _uniqueId)
     public
     view
     onlyItemOwner(msg.sender)
     returns (bool isAuthentic) {

         return ( authenticateHistory(_itemIndex) && authenticateOwner(_itemIndex, _uniqueId) );
         //bool historyAuthentic = authenticateHistory(_itemIndex);
         //bool ownerAuthentic = authenticateOwner(_itemIndex, _uniqueId);
         //emit AuthenticateEvent(msg.sender, _itemIndex, isAuthentic);
         //isAuthentic = (historyAuthentic && ownerAuthentic);
         //return isAuthentic;
  }

  /** --> Helper functions */

  /// @notice check the hash of the _uniqueId param compaired to to stored hash for the item in order to find if they are the same
  /// @dev a very simplistic zero knownledge proof - the item owner is able to verify using a secret that ties to the physical item
  /// @param _uniqueId - a string known to the items owner
  /// @return isAuthentic - true if both hash codes are the same - false if the hash codes are not the same
  function checkUniqueIdHash(uint _itemIndex, string memory _uniqueId)
     public
     view
     returns (bool isAuthentic) {
       bytes32 uniqueIdHash = generateUniqueIdHash(_uniqueId);
       return (items[_itemIndex].itemUniqueHash == uniqueIdHash);
  }

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
  /// @return itemName itemDescription itemState itemCreatorAddress itemUniqueHash
  function getItemData(uint _itemIndex)
      public
      view
      returns(
        string memory itemName,
        string memory itemDescription,
        uint itemState,
        address itemCreatorAddress,
        bytes32 itemUniqueHash,
        uint itemCount_)
  {
      itemName = items[_itemIndex].itemName;
      itemDescription = items[_itemIndex].itemDescription;
      itemState = uint(items[_itemIndex].itemState);
      itemCreatorAddress = items[_itemIndex].itemCreatorAddress;
      itemUniqueHash = items[_itemIndex].itemUniqueHash;
      itemCount_ = itemCount;
  }

    /** ERC preset functions from open zepplin (not my code!) **/
    /** --> Creation function */
    /// @dev Creates `amount` new tokens for `to`, of token type `id`.  * See {ERC1155-_mint}.  * Requirements: - the caller must have the `MINTER_ROLE`.
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC1155PresetMinterPauser: must have minter role to mint");
        _mint(to, id, amount, data);
    }

    /**
     * Not implemented (yet) - would need some extra work to consider batches - my data stucture would not support it
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] variant of {mint}.
     *
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC1155PresetMinterPauser: must have minter role to mint");
        _mintBatch(to, ids, amounts, data);
    } */

    /**
     * @dev Pauses all token transfers.
     * See {ERC1155Pausable} and {Pausable-_pause}.
     * Requirements: - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ERC1155PresetMinterPauser: must have pauser role to pause");
        _pause();
    }

    /**
     * @dev Unpauses all token transfers
     * See {ERC1155Pausable} and {Pausable-_unpause}.
     * Requirements: - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ERC1155PresetMinterPauser: must have pauser role to unpause");
        _unpause();
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Pausable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
