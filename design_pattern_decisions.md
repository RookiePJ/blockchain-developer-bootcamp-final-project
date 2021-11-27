### Design Pattern Decisions

#### Inheritance
  I used multiple inheritance extending Open Zepplin contracts to provide
  NFT and security functionality. Inherited ERC1155 functions were wrapped
  by my own, as they offered features that I needed.
  Other security features were used directly like the Ownable
  contract/interface.

#### Access Control Patterns
  Made use of the Ownable and AccessControlEnumerable contracts to help
  restrict access and provide functionality. Central to my use case was
  that only a contract owner should be allowed to create an item and mint
  the associated token.

#### Secure NFT Transfer ERC1155
  For the actual NFT transfer, I used the ERC1155 safeTransferFrom function
  which offers functionality to transfer tokens with built-in security.

#### Emergency Stop - Pausable
  Used the Pausable feature from ERC1155 Open Zepplin to offer the ability
  to pause the critical functions in a deployed contract instance.
  In case any issues are discovered. Only allowed the contract owner to pause or unpause.

#### Guard Check
  Used modifiers require guards to restrict access to functions based on their account address.


##### Other / General Thoughts
  Reuse (more a design idea) - the choice to use Open Zepplin ERC1155 Preset
  Minter Pauser (ERC1155PresetMinterPauser.sol) as the basis of my NFT
  contract. Offered security functionality for the contract as well as
  other needed functionality. Avoiding the anti-pattern of "not invented
  here!"

  Did try to adopt SOLID principles as much as possible;

    1) S - Adopted the single responsibility principle within functions. Not
           so much at the contract level [single reponsibity]
    2) O - Did extend Open Zepplin contracts without needing to alter their
           internals. [open closed]
    3) L - I chose to wrap existing inherited functions rather than try to override
           them. So this was not followed. [Liskov substitution]
    4) I - Did try initially to implement the specifications as interfaces, and
           then implement these as solidity contracts but it proved too complex.
           Idea was to try and adapt the interface segregation principle, but solidity
           has some unique constraints making this more difficult than in
           traditional (object) languages. [interface segregation]
    5) D - My contract has tight coupling due to using inheritance, and not
           using interfaces to provide an abstraction of the implementation
           [dependancy inversion]
