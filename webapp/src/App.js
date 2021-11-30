import React, { useState } from "react";
import { itemAbi } from "./abi/ItemContractABI.js";
import Web3 from "web3";
import './App.css';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x42851cD309381Cb82ecF509B29bc1bf2A96fc123";  // rinkeby ItemContract 21:30 29/11
const contract = new web3.eth.Contract(itemAbi, contractAddress);

//const contractAddress = "0xf84bA9dA6790806417B4Ffb7106A07cB7C29f8AF";  // Rinkeby ItemContract 15:40 29/11
//const contractAddress = "0xc6ac8C9A8e89dC7f75005CA71D5aaA5D3932435b";  // Ropsten ItemContract 18:30 29/11 not working?
//const contractAddress = "0x3801be3C2f4Fad5B4d33079cAd5D60E361b0DCB4";  // Goerli ItemContract
//const contractAddress = "0xb2Cf3586410734c79f9E881745CEd50dB5859D96";  // ropsten simple storage - worked!
//const contractAddress = "0xcc331359fEf4de4756725Fb100Fa2dBdA6C786a4";  // ganache-cli simple storage - not working nonce?
//const contractAddress = "0x9422A945C8CB5d8c199ACd9dA1417eE1b964d586";  // ganache-cli item - not working nonce?

/// Writen [hacked together] as part of the consensys bootcamp to provide a basic interface to
/// a solidity smart contract.
/// Sends one ethereum transaction to a public testnet to create an item (and an ERC1155 NFT)
/// Sends another transaction to reteive the item name from the blockchain.
/// Nasty front end application that looks like something written as an java applet or even in cobol!
/// There's a good reason I'm a backend developer ;-)

/// Works (mostly) as of 15:30 (GMT) on 30-Nov-2021


function App() {
  const [itemName, setItemName] = useState("");     // the item name
  const [number, setUint] = useState(0);
  const [getNumber, setGet] = useState("Not yet called");  // the item name from the blockchain
  const [text, setText] = useState("");
  var   [statusInfo, setStatusInfo] = useState("Waiting for user input");  // hold the status of blockchain calls
  //const [authText, setAuthText] = useState("");

  // working 16:00 30/11
  const numberSet = async (t) => {
    t.preventDefault();

    // some very basic wallet checking
    if (typeof window.ethereum === "undefined") {
      alert("Please Note; This page requires digital wallet, please install MetaMask. Web site: https://metamask.io");
      return false;
    }

    // should take three inputs then create an item
    // (todo) but oh no it's react, horrid, fragile and I don't know how it works!
    //console.log("Create New Item Called");
    //console.log(itemName);
    //console.log(number);
    var ItemName = itemName;                  // Grab item name
    var ItemDesc = "Test Item Description"    // Create dummy data
    var ItemUniqueId = number.toString();     // crazy really but just get hack it to work for now!

    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    //console.log(account);
    setStatusInfo("Waiting for confirmation from the blockchain");
    const txReturn = await contract.methods.createNewItem(ItemName, ItemDesc, ItemUniqueId).send({ from: account });
    if (txReturn) { setStatusInfo("Item Created"); }
    else {          setStatusInfo("Encountered a problem creating Item"); }  // react will have threw an exception anyway!
  };

  // working 16:00 30/11
  const numberGet = async (t) => {
    t.preventDefault();

    // some very basic wallet checking
    if (typeof window.ethereum === "undefined") {
      alert("Please Note; This page requires digital wallet, please install MetaMask. Web site: https://metamask.io");
      return false;
    }
    //console.log("Retrive called");
    setStatusInfo("Waiting for item name retrieval from the blockchain");
    const itemCount = await contract.methods.getItemCountCurrent().call();   // working on rinkeby 22:00 29/11
    var itemLast = itemCount - 1;
    const post = await contract.methods.getItemDetails(itemLast).call();     // working on 22:25 29/11
    //console.log(post);
    setGet(post);    // calls a setter on a state varabile?
    setStatusInfo("Last item name retrieved successfully");
  };

  /** taken out 30 Nov - now causing problems - maybe react?
  const authOwner = async (t) => {
    t.preventDefault();
    console.log("Auth Owner called");
    // need input of sercet number - text to number - then into abi call

    const itemCount = await contract.methods.getItemCountCurrent().call();   // working on rinkeby 22:00 29/11
    console.log(itemCount);
    var itemLast = itemCount - 1;
    const isAuth = await contract.methods.authenticateOwner(itemLast, "Test").call();  // working on rinkeby 22:20 29/11
    var itemStatus = "";
    if (isAuth) {
       itemStatus = "TRUE: sercet code provided matches recorded details";
    } else {
      itemStatus = "FALSE: Please check the code provided";
    }
  }
            <!--
            <h4>Authenticate Item</h4>
            <button className="button" onClick={authOwner} type="button">Authenticate Last Item</button>
            <label><b>Item Authenticicy: {authText}</b></label>
            <br/> -->
  */

  return (
     <div className="main">
          <div className="card">

            <label><h2><b>Create Item and Authenticate Prototype</b></h2></label>

            <h4>Create New Item</h4>
            <form className="form" onSubmit={numberSet}>
              <label>Please Enter The Item Name:
                <input className="input" type="text" name="iname" onChange={(t) => setItemName(t.target.value)} />
              </label>
              <label>Please Enter a secret code number:
                <input className="input" type="text" name="name" onChange={(t) => setUint(t.target.value)} />
              </label>
              <button className="button" type="submit" value="Confirm">Create Test Item (Opens MetaMask)</button>
            </form>
            <br/>

            <h4>Retrive Item</h4>
            <button className="button" onClick={numberGet} type="button">Retrieve Last Item</button>
            <br/>
            <label><b>Item Name: {getNumber}</b></label>
            <br/>
            <br/>
            <label><b>Status: {statusInfo}</b></label>
          </div>
    </div>
 );
}

export default App;
