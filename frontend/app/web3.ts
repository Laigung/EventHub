import Web3 from "web3";

const web3 = new Web3('http://127.0.0.1:3000');

const contractAddress = "0x59c8d78BF4D1df17B1910517eCD75D278EF13ece";
 
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
				"internalType": "uint32",
				"name": "date",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "venue",
				"type": "string"
			},
			{
				"internalType": "uint64",
				"name": "maxParticipants",
				"type": "uint64"
			},
			{
				"internalType": "uint8",
				"name": "ageLimit",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isVisible",
				"type": "bool"
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
				"internalType": "uint32",
				"name": "date",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "venue",
				"type": "string"
			},
			{
				"internalType": "uint64",
				"name": "maxParticipants",
				"type": "uint64"
			},
			{
				"internalType": "uint8",
				"name": "ageLimit",
				"type": "uint8"
			},
			{
				"internalType": "uint64",
				"name": "fee",
				"type": "uint64"
			},
			{
				"internalType": "bool",
				"name": "isVisible",
				"type": "bool"
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
						"internalType": "uint32",
						"name": "date",
						"type": "uint32"
					},
					{
						"internalType": "string",
						"name": "venue",
						"type": "string"
					},
					{
						"internalType": "uint64",
						"name": "maxParticipants",
						"type": "uint64"
					},
					{
						"internalType": "uint8",
						"name": "ageLimit",
						"type": "uint8"
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
								"internalType": "uint8",
								"name": "age",
								"type": "uint8"
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
					},
					{
						"internalType": "bool",
						"name": "isVisible",
						"type": "bool"
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
				"internalType": "uint8",
				"name": "age",
				"type": "uint8"
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
				"internalType": "uint32",
				"name": "date",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "venue",
				"type": "string"
			},
			{
				"internalType": "uint64",
				"name": "maxParticipants",
				"type": "uint64"
			},
			{
				"internalType": "uint8",
				"name": "ageLimit",
				"type": "uint8"
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
						"internalType": "uint8",
						"name": "age",
						"type": "uint8"
					}
				],
				"internalType": "struct EventPlatform.User",
				"name": "admin",
				"type": "tuple"
			},
			{
				"internalType": "bool",
				"name": "isVisible",
				"type": "bool"
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
						"internalType": "uint32",
						"name": "date",
						"type": "uint32"
					},
					{
						"internalType": "string",
						"name": "venue",
						"type": "string"
					},
					{
						"internalType": "uint64",
						"name": "maxParticipants",
						"type": "uint64"
					},
					{
						"internalType": "uint8",
						"name": "ageLimit",
						"type": "uint8"
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
								"internalType": "uint8",
								"name": "age",
								"type": "uint8"
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
					},
					{
						"internalType": "bool",
						"name": "isVisible",
						"type": "bool"
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
		"name": "getAllVisibleEvents",
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
						"internalType": "uint32",
						"name": "date",
						"type": "uint32"
					},
					{
						"internalType": "string",
						"name": "venue",
						"type": "string"
					},
					{
						"internalType": "uint64",
						"name": "maxParticipants",
						"type": "uint64"
					},
					{
						"internalType": "uint8",
						"name": "ageLimit",
						"type": "uint8"
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
								"internalType": "uint8",
								"name": "age",
								"type": "uint8"
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
					},
					{
						"internalType": "bool",
						"name": "isVisible",
						"type": "bool"
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
						"internalType": "uint8",
						"name": "age",
						"type": "uint8"
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
						"internalType": "uint8",
						"name": "age",
						"type": "uint8"
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