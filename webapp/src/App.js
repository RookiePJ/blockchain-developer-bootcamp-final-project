import React, { useState } from "react";
//import { itemAbi } from "./abi/ItemContract.js";
import { itemAbi } from "./abi/ItemContractABI.js";
import Web3 from "web3";
import './App.css';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x42851cD309381Cb82ecF509B29bc1bf2A96fc123";  // rinkeby ItemContract 21430 29/11
const contract = new web3.eth.Contract(itemAbi, contractAddress);

//const contractAddress = "0xc6ac8C9A8e89dC7f75005CA71D5aaA5D3932435b";  // Ropsten ItemContract 18:30 29/11
//const contractAddress = "0xf84bA9dA6790806417B4Ffb7106A07cB7C29f8AF";  // Rinkeby ItemContract 15:40 29/11
//const contractAddress = "0x3801be3C2f4Fad5B4d33079cAd5D60E361b0DCB4";  // Goerli ItemContract
//const contractAddress = "0xb2Cf3586410734c79f9E881745CEd50dB5859D96";  // ropsten simple storage - worked!
// const contractAddress = "0xcc331359fEf4de4756725Fb100Fa2dBdA6C786a4";  // ganache-cli simple storage - not working nonce?
// const contractAddress = "0x9422A945C8CB5d8c199ACd9dA1417eE1b964d586";  // ganache-cli item - not working nonce?

function App() {
  const [itemName, setItemName] = useState("");
  const [number, setUint] = useState(0);
  const [getNumber, setGet] = useState("");
  const [text, setText] = useState("");

  // working 10:30 29/11
  const numberSet = async (t) => {
    t.preventDefault();
    //console.log("Set called");
    // should take three inputs then create an item
    // - but (todo) as I can't work out how react works with text boxes - and its horrid and fragile
    console.log("Create New Item Called");
    console.log(itemName);
    var ItemName = itemName;;       // Just hack some input together
    var ItemDesc = "Test Item Description 1" // Create test data
    var ItemUniqueId = number.toString();    // crazy really but too difficult to do anything in React!

    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(account);
    //const gas = await contract.methods.createNewItem(ItemName, ItemDesc, ItemUniqueId).estimateGas();
    //const post = await contract.methods.createNewItem(ItemName, ItemDesc, ItemUniqueId).send({ from: account, gas, });
    const post = await contract.methods.createNewItem(ItemName, ItemDesc, ItemUniqueId).send({ from: account });
  };

  // working 10:30 29/11
  const numberGet = async (t) => {
    t.preventDefault();
    console.log("Retrive called");
    const itemCount = await contract.methods.getItemCountCurrent().call();   // working on rinkeby 22:00 29/11
    var itemLast = itemCount - 1;
    const post = await contract.methods.getItemDetails(itemLast).call();     // working on 22:25 29/11
    console.log(post);
    setGet(post);
  };


    //const post = await contract.methods.authenticateOwner(0, "Test").call();  // working on rinkeby 22:20 29/11

/*
            <!-- <button className="connectMetaMask" onClick={connectMetaMask} type="button">
              Connect To MetaMask
            </button>  -->
*/
  return (
     <div className="main">
          <div className="card">

            <label><h3><b>Create Item and Authenticate Prototype</b></h3></label>
            <h4>Create New Item</h4>

            <form className="form" onSubmit={numberSet}>
              <label>Please Enter The Item Name:
                <input className="input" type="text" name="iname" onChange={(t) => setItemName(t.target.value)} />
              </label>
              <label>Please Enter a secret id number:
                <input className="input" type="text" name="name" onChange={(t) => setUint(t.target.value)} />
              </label>
              <button className="button" type="submit" value="Confirm">Create Test Item (opens metamask)</button>
            </form>

            <br/>
            <br/>

            <h4>Retrive Item</h4>
            <button className="button" onClick={numberGet} type="button">Retrieve Last Item</button>
            <label><b>Item Name: {getNumber}</b></label>
            <br/>

          </div>
    </div>
 );
}

export default App;
