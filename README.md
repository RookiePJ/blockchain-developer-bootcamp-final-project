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
    _All scripts run from project root directory_

***Quick Start - install and run tests locally***

    0) Clone repository
       git clone https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project.git

    1) Contracts - with truffle
       yarn install    (install javascript dependancies)
       truffle test    (runs tests after starting a local testnet on port 8040)
    
    2) Web App running locally with with React
       ./webapp/yarn install    (installs javascript dependancies)
       ./webapp/yarn start      (starts react webapp)
       Open a browser at [localhost:5000](http:localhost:5000) 
    
  The client web application hosted on [On GitHub Pages](https://rookiepj.github.io/item-contract-demo/)

  ***Truffle smart contracts***
  ****Install Compile****

      yarn install     (to install the javascript dependancies)
      truffle compile  (compile the smart contracts using solc-js version 0.8.10)

  ****Setting up access to public networks using Infra****
      - Set the envionment variables in `.env` file in the project root directory and replace the '<PLACE_YOUR_MNEMONIC_SEED_PHRASE_HERE>' and <PLACE_YOUR_NETWORK_ID_HERE>
      - See the example file [`env-example.txt`](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/evn-example.txt) 

  ****Deployment****

       truffle deploy --network ganache-cli  (deploy onto command line Ganache running on localhost:8545)
       truffle deploy --network ganache-gui  (deploy onto Ganache GUI running on localhost:7545)
       truffle deploy --network rinkeby      (deploy onto the rinkeby public testnet)
       truffle deploy --network ropsten      (deploy onto the ropsten public testnet)

  ****Runing Test****

       truffle test   (starts a local test chain on port 8040 and then runs the javascript tests)
       truffle test --network ganache-cli  (runs tests on a local ganache cli port 8545)
       truffle test --network ganache-gui  (runs tests on a local ganache GUI port 7545)
       truffle test --network rinkeby      (runs tests on the rinkeby public testnet)
       truffle test --network ropsten      (runs tests on the ropsten public testnet [costs a fortune!])

  ****Built with****
     - Truffle v5.4.15 (core: 5.4.15)
     - Solidity - ^0.8.10 (solc-js)
     - Node v16.12.0
     - Web3.js v1.5.3
     - Yarn 1.22.15
     - MacOS Catalina (Version 10.15.4)
     - Firefox version 94.0.2

***Supporting Documents***

   - [Security concerns](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/avoiding_common_attacks.md)
   - [Design Pattern Usage](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/design_pattern_decisions.md)
   - Client frontend Video of screen cast [Screen Cast on Youtube](https://youtu.be/XRQ27ee4Fqw)  [Screen Cast On IPFS](https://ipfs.io/ipfs/QmQj9kcthWDhv72aVjtHHfSoDAryCedd6AcvycP97vfBGW) [Test Video 1 On YouTube](https://youtu.be/I_F7qf-MGzQ)
   - Client frontend URL [On GitHub Pages](https://rookiepj.github.io/item-contract-demo/)
   - Public address where smart contract is deployed: [0x42851cD309381Cb82ecF509B29bc1bf2A96fc123](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/deployed_address.txt)
   - Public contract address on [Rinkeby Etherscan](https://rinkeby.etherscan.io/address/0x42851cD309381Cb82ecF509B29bc1bf2A96fc123)
   - [Unit test results](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/test/testResults/ItemContract.sol.test.results.29-Nov-21.23:30.txt)
   - Address for Consensys certificate: [0x835786aefB80899E024E96Ca690EcDE1303143E3](https://github.com/RookiePJ/blockchain-developer-bootcamp-final-project/blob/main/certificateAddress/certificateAddressEthereum.jpg)

