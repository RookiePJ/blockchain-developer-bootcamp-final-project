# blockchain-developer-bootcamp-final-project
Goods Proof - a blockchain project that is part of the ConsenSys Bootcamp Academy course.

**Overview**
Goods Proof.  A simple proof of authenticity for Items sold within retail.

**Objective**
- To improve the trust in the retail supply chain by offering proof of ownership and authenticity when goods are sold.

**Description**
- This trust will be accomplished by using a "digital twin" ledger record, to represent a physical goods in order to provide proof of ownership and authenticity.
- If the physical ownership of an item changes, its ownership can then be recorded by adding to the ownership information held on the "digital twin" ledger  record.

**Problem Statement**

**Why (The Business case)**
- To _help_ prevent product counterfeiting.
- These fake products often undermine sales revenue and the credibility of the original products.
- Help to mitigate safety concerns due to fake items sold which do not reach the correct safety standards.
- Help to improve the visibility of the retail supply chain and establish a better foundation of trust between customers, retailers, and manufacturers.

**Why blockchain? (The Technology Justification)**

The following questions were asked(*);

- 1) _Does your application require a shared database?_
     Yes, between various actors.
- 2) _Does the database need to support multiple writing parties?_
     Yes, various actors will want to create new information.
- 3) _Do the writing parties have no trust in each other?_
     Creators and retailers will trust each other, but this trust will not exist with the customer.
- 4) _Do the writing parties want to modify the state of the database directly, without requiring a central entity trusted by all participants?_
     Yes, no actor can be trusted individually.
- 5) _Do transactions that the writing parties create interact collaboratively with each other?”_
     Yes, between each of the actors in terms of transference of ownership.

Blockchain technology could ensure that customers know where the fashion products come from. In addition, the use of unique identifiers for verifying the originality of goods will offer the promising benefit of traceability. The unique identifier will help to find out where the product has been in its journey through the supply chain.

**When**
- The project deadline is the end of November 2021, 30st of November at 23:59 AoE [PST/Yankie] (1st December at 08:00 GMT).
- Aim to have a working release at least a week before the deadline date.

**Primary Business Benefit**
Solution for consumers to verify the authenticity of (luxury) goods.
Items are created by their producer with a secert key which is tied to
the physical item.  This can then be used to authenticate after item has
been transfered to a retailer or customer.

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

    root -- /           - truffle project root
         -- /contracts  - smart contracts (ItemContract.sol)
         -- /test       - javascript tests (itemContract.test.js)
         -- /migrations - truffle deployment files
(2_deploy_ItemContract.js)
         -- /webapp     - web app (react based standard format)
            /webapp/abi - Abi for the web app
         -- /design     - design and use cases documents


