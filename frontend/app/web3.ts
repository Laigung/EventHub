import Web3 from "web3";

const web3 = new Web3('http://127.0.0.1:3000');

const contractAddress = "0x9903511C25A4e00f222f17Dec8EA8D5C3Aa1cba7";
 
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "eventName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "venue",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "maxParticipants",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ageLimit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			}
		],
		"name": "addEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "eventID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "eventName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "venue",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "maxParticipants",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ageLimit",
				"type": "uint256"
			},
			{
				"internalType": "uint64",
				"name": "fee",
				"type": "uint64"
			}
		],
		"name": "editEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "eventID",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "eventName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "venue",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "maxParticipants",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "ageLimit",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "fee",
						"type": "uint256"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "userAddress",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "userName",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "age",
								"type": "uint256"
							}
						],
						"internalType": "struct EventPlatform.User",
						"name": "admin",
						"type": "tuple"
					},
					{
						"internalType": "address[]",
						"name": "participants",
						"type": "address[]"
					}
				],
				"indexed": false,
				"internalType": "struct EventPlatform.Event",
				"name": "detail",
				"type": "tuple"
			}
		],
		"name": "EventCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newParticipant",
				"type": "address"
			}
		],
		"name": "EventJoined",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "eventID",
				"type": "uint256"
			}
		],
		"name": "joinEvent",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "currentEvent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "eventID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "eventName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "venue",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "maxParticipants",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ageLimit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "userName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "age",
						"type": "uint256"
					}
				],
				"internalType": "struct EventPlatform.User",
				"name": "admin",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllEvents",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "eventID",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "eventName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "venue",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "maxParticipants",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "ageLimit",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "fee",
						"type": "uint256"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "userAddress",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "userName",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "age",
								"type": "uint256"
							}
						],
						"internalType": "struct EventPlatform.User",
						"name": "admin",
						"type": "tuple"
					},
					{
						"internalType": "address[]",
						"name": "participants",
						"type": "address[]"
					}
				],
				"internalType": "struct EventPlatform.Event[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getNumberOfEvents",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "eventID",
				"type": "uint256"
			}
		],
		"name": "getRemainingSeats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUserBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUserInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "userName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "age",
						"type": "uint256"
					}
				],
				"internalType": "struct EventPlatform.User",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "userName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "age",
						"type": "uint256"
					}
				],
				"internalType": "struct EventPlatform.User",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "participant",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "eventID",
				"type": "uint256"
			}
		],
		"name": "isUserJoined",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "eventID",
				"type": "uint256"
			}
		],
		"name": "isUserJoined",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const;

export {web3, contractAddress, contractABI};