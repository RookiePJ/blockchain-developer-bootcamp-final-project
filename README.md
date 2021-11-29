# blockchain-developer-bootcamp-final-project
Goods Proof - a blockchain project that is part of the ConsenSys Bootcamp Academy course.

**Overview**
Goods Proof.  A simple proof of authenticity for Items sold within retail.

**Objective**
- To improve the trust in the retail supply chain by offering proof of ownership and authenticity when goods are sold.

**Description**
- This trust will be accomplished by using a "digital twin" ledger record, to represent a physical goods in order to provide proof of ownership and authenticity.
- If the physical ownership of an item changes, its ownership can then be recorded by adding to the ownership information held on the "digital twin" ledger  record.

**Primary Business Benefit**
Solution for consumers to verify the authenticity of (luxury) goods.
Items are created by their producer with a secert key which is tied to
the physical item.  This can then be used to authenticate after item has
been transfered to a retailer or customer.

**Why (The Business case)**
- To _help_ prevent product counterfeiting.
- These fake products often undermine sales revenue and the credibility of the original products.
- Help to mitigate safety concerns due to fake items sold which do not reach the correct safety standards.
- Help to improve the visibility of the retail supply chain and establish a better foundation of trust between customers, retailers, and manufacturers.


**Actors / Use Cases**

   Creator      --> Create New Item (minting)         [contract/client]
                --> Deliver new Item to Retailer      [contract]
                --> Sell new Item to Customer         [contract]
                --> Authenticate Item                 [contract]

   Retailer     --> Receive Item from Creator         [contract]
                --> Return Item to Creator, if faulty [contract]
                --> Sell Item to Customer             [contract]
                --> Authenticate Item                 [contract]

   Customer     --> Purchase Item                     [contract]
                --> Resell or transfer Item to new Customer [contract]
                --> Replace/Refunded Item, if item proven to be faulty and original returned [contract]
                --> Authenticate Item i               [contract]

   Admin        --> Stop deployed software (fatal issue found) [contract]

Please see inital [business case](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/design/DESIGN.md) for more information.

**Project Directory Stucture**
    GitHub repository: https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project

    ***Directory Stucture (normal truffle setup - with Web App in /webapp)***

    root -- / - truffle project root
            /truffle-config.js  - script config to compile/test/deploy
            /package.json  - javascript dependancies (yarn) 
            /deployed_address.txt - address(s) where contract is deployed on public network(s)
            /design_pattern_decisions.md - design patterns usage
            /avioding_common/attacks.md - security considerations
         -- /contracts  - smart contracts (ItemContract.sol)
         -- /test       - javascript tests (itemContract.test.js)
         -- /migrations - truffle deployment files (2_deploy_ItemContract.js)
         -- /webapp     - web app (react based standard format)
            /webapp/src - source for client frontend
            /webapp/abi - Abi for the web app front end
         -- /design     - design and use cases documents

**Project Install and Setup**

***Quick Start - install and run tests locally***

    1) Contracts - with truffle
       yarn install
       truffle test
    
    2) Web App running locally with with React
       ./webapp/yarn install
       ./webapp/yarn start
       Open a browser at localhost:5000

  ***Truffle smart contracts***
  ****Install Compile****

      yarn install     - to install the javascript dependancies
      truffle compile  - compile the smart contracts using solc-js version 0.8.10

  ****Setting up access to public networks using Infra****
      - Set the envionment variables in `.env` file in the project root directory and replace the '<PLACE_YOUR_MNEMONIC_SEED_PHRASE_HERE>' and <PLACE_YOUR_NETWORK_ID_HERE>
      - See the example file [`env-example.txt`](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/evn-example.txt) 

  ****Deployment****

       truffle deploy --network ganache-cli - command line ganache on localhost:8545
       truffle deploy --network ganache-gui - ganache gui on localhost:7545
       truffle deploy --network ropsten     - ropsten public testnet
       truffle deploy --network rinkeby     - rinkeby public testnet

  ****Runing Test****

       truffle test   - starts a local test chain on port 8040 and runs javascript tests
       truffle test --network ganache-cli  - runs on local ganache cli port 8545
       truffle test --network ganache-gui  - runs on local ganache GUI port 7545
       truffle test --network ropsten      - runs on ropsten public testnet (costs a fortune!)
       truffle test --network rinkeby      - runs on rinkeby public testnet

  ****Built with****
     - Truffle v5.4.15 (core: 5.4.15)
     - Solidity - ^0.8.10 (solc-js)
     - Node v16.12.0
     - Web3.js v1.5.3
     - Yarn 1.22.15

***Supporting Documents***
     - Frontend Video (if I ever get it working!)
     - Frontend URL (not sure - if React runs locally?)
     - [Security concerns](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/avoiding_common_attacks.md)
     - [Design Pattern
       Usage](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/design_pattern_decisions.md)
     - [Public address where smart contract is
       deployed](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/deployed_address.txt)


