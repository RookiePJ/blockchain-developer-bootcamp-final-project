
** Security Decisions **

Ownable Access Control
Made use of the inherated Ownable and isOwner() modifier to restict access to
create and delete item functions. Also used this to restict access to
the pausable feature.

AccessControlEnumerable Role Based Access
From ERC1155 only the contract owner was given the admin, minter and
pauser roles at deployment time.  This helps to offer security around the token and
contract.

Secure NFT Transfer ERC1155
For the actual NFT transfer I used the ERC1155 safeTransferFrom function
which offers functionality to transfer tokens with built in security.

Emergency Stop
Used the Pausable feature from ERC1155 open zepplin to offer the ability
to pause the critical functions in a deployed contract instance.
In case any issues are discovered.  Guarded this by only alloweing the contract
owner to pause or unpause.  Also makes use of the pauser role.

Guard Check
Used modifers with require guards to restict access to functions based on their account
address.

Renentry
Contract does not deal with ether, but token transfers where called
after internal processing was completed.

Ensured that version 0.8.x (0.8.10) of the compiler was used.  This
release now offeres integer overflow/underflow protection when
performing basic mathematical operations.

Allways used msg.sender rather than tx.origin to ensure the correct
account address was being referenced.

Created fallback functions to revert if any ether is sent to the
contract.  Currently the contract does not accept ether as none of the
functions are financial and therefore not payable.  [TO DO]
