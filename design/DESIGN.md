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

**What**

 **How**
 - To run within the ethereum blockchain system(s).
 - Due to restrictions (money), the deployment is to be restricted to an ethereum test network.
 - Truffle development environment to develop Solidity smart contracts with web3 and node.js JavaScript and a basic web page(s).
 - Non-fundable tokens (NFT) will be evaluated to determine suitability.
 - The aim is to adopt a test-driven development approach with agile practices, but not all as they may not fit.
 - And lots of testing, and auditing.

**Potential Issues**
 - 1) It is difficult to tie an actual physical item with its digital twin.  The phsyical item could potentially be substituted.
 - 2) potential manufacturers and retailers may not wish to publish their sales related information publicly, due to insights this may give their competitors.
 - 3) Various legal issues as sales of goods laws will be different for each country.
 - 4) Current transactions costs within the main production environment are prohibitive for low-value items - the target environment is to be an ethereum test network.


**Potental Actors / Use Cases (daft)**

        Creator      --> Create New Item (minting)
                     --> Deliver new Item to Retailer
                     --> Sell new Item to Customer

        Retailer     --> Receive Item from Creator
                     --> Return Item to Creator [faulty]
                     --> Sell Item to Customer
                     --> Authenticate Item

        Customer     --> Purchase Item
                     --> Resell or transfer Item to new Customer
                     --> Replace/Refunded Item, if Item proven to be faulty and original returned
                     --> Authenticate Item

        Admin        --> Update existing software
                     --> Stop deployed software (fatal issue found)


   **Potential Further Objectives**
   - Extend to include other types of items.
   - Extend into other markets, manufacturing, agriculture, food production, shipping.
   - Take Payments

   **References to known (real) projects**
   - 1) Blockchain for Luxury Goods and article from 101 Blockchains --> https://101blockchains.com/blockchain-for-luxury-goods/
   - 2) The Aura Blockchain Consortium --> https://auraluxuryblockchain.com


_*(Questions taken from Gideon Greenspan, “Avoiding the Pointless Blockchain Project” [http://mng.bz/4Oqg])._

