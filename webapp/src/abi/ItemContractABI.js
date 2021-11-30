
export const itemAbi = [
  {
      constant: false,
      inputs: [],
      name: "getItemCountCurrent",
      outputs: [
        {
          internalType: "uint256",
          name: "itemCountCurrent",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
  },
    {
    constant: false,
    inputs: [
        {
          internalType: "uint256",
          name: "_itemIndex",
          type: "uint256"
        }
      ],
      name: "getItemDetails",
      outputs: [
        {
          internalType: "string",
          name: "itemName",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
    constant: false,
    inputs: [
        {
          internalType: "uint256",
          name: "_itemIndex",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "_uniqueId",
          type: "string"
        }
      ],
      name: "authenticateOwner",
      "outputs": [
        {
          internalType: "bool",
          name: "isAuthentic",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function",
      constant: true
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_itemName",
          type: "string"
        },
        {
          internalType: "string",
          name: "_itemDescription",
          type: "string"
        },
        {
          internalType: "string",
          name: "_uniqueId",
          type: "string"
        }
      ],
      name: "createNewItem",
      "outputs": [
        {
          internalType: "bool",
          name: "newItemCreatedSuccess",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
];
