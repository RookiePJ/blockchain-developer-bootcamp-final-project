#### Security Decisions 

##### Ownable Access Control
  Made use of the inherited Ownable and isOwner() modifier to restrict access to
  create and delete item functions. Also used this to restrict access to
  the pausable feature. 
   _Note this onlyOwner modifier was removed in release 2.0 due to
problems calling the create item function from the front end client.  We still have the role based access
controll (ie mintable)_

##### AccessControlEnumerable Role Based Access
  From ERC1155 only the contract owner was given the admin, minter and
  pauser roles at deployment time.  This helps to offer security around the token and
  contract.

##### Secure NFT Transfer ERC1155 safeTransferFrom
  For the actual NFT transfer, I used the ERC1155 safeTransferFrom function
  which offers functionality to transfer tokens with built-in security.
 Specifically safe transfer checks;
     a) that the sending address is not zero
     b) that the address sending the NFT is the caller (not using
        approved addresses)
     c) the sender account has an NFT balance of at least one, ie they own
        the NFT

##### Emergency Stop
  Used the Pausable feature from ERC1155 Open Zepplin to offer the ability
  to pause the critical functions in a deployed contract instance.
  In case any issues are discovered. Guarded this by only allowing the contract
  owner to pause or unpause. Also makes use of the pauser role.

##### Guard Check
  Used modifiers which required guards to restrict access to functions based on their account
  address.

##### Renentry
  The contract does not deal with ether, but token transfers were called
  after internal processing was completed.

##### Ensured that version 0.8.x (0.8.10) of the compiler was used.  This
  release now offers integer overflow/underflow protection when
  performing basic mathematical operations.

##### Avoided tx.origin
  Always used msg. sender rather than tx. origin to ensure the correct
  account address was being referenced.

##### Fallback functions
  Created fallback functions to revert if any ether is sent to the
  contract.  Currently, the contract does not accept either the
  functions are not financial and therefore not payable.  Therefore other than
  for gas fees, any ether sent in error is returned to the calling contract.
