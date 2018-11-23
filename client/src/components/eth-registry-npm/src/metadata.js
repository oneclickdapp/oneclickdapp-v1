const abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: "contractName",
                type: "string",
            },
            {
                indexed: false,
                name: "migrationId",
                type: "string",
            },
        ],
        name: "Migrated",
        type: "event",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_address",
                type: "address",
            },
            {
                name: "_name",
                type: "string",
            },
            {
                name: "_ipfs",
                type: "string",
            },
        ],
        name: "addAddress",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: true,
        stateMutability: "payable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_address",
                type: "address",
            },
            {
                name: "_name",
                type: "string",
            },
            {
                name: "_ipfs",
                type: "string",
            },
        ],
        name: "addByCurator",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "a",
                type: "address",
            },
        ],
        name: "addCurator",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_o",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [],
        name: "initialize",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [],
        name: "lootBox",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "a",
                type: "address",
            },
        ],
        name: "removeCurator",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: "_address",
                type: "address",
            },
            {
                indexed: false,
                name: "_logo_ipfs",
                type: "string",
            },
            {
                indexed: false,
                name: "index",
                type: "uint256",
            },
        ],
        name: "SetData",
        type: "event",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_o",
                type: "address",
            },
        ],
        name: "setOwner",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_price",
                type: "uint256",
            },
        ],
        name: "setPrice",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "",
                type: "address",
            },
        ],
        name: "adresses",
        outputs: [
            {
                name: "_address",
                type: "address",
            },
            {
                name: "_name",
                type: "string",
            },
            {
                name: "_ipfs",
                type: "string",
            },
            {
                name: "_selfAttested",
                type: "bool",
            },
            {
                name: "_curated",
                type: "bool",
            },
            {
                name: "_exists",
                type: "bool",
            },
            {
                name: "_submitter",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "a",
                type: "address",
            },
        ],
        name: "getByAddress",
        outputs: [
            {
                name: "",
                type: "address",
            },
            {
                name: "",
                type: "string",
            },
            {
                name: "",
                type: "string",
            },
            {
                name: "",
                type: "bool",
            },
            {
                name: "",
                type: "bool",
            },
            {
                name: "",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "a",
                type: "uint256",
            },
        ],
        name: "getByIndex",
        outputs: [
            {
                name: "",
                type: "address",
            },
            {
                name: "",
                type: "string",
            },
            {
                name: "",
                type: "string",
            },
            {
                name: "",
                type: "bool",
            },
            {
                name: "",
                type: "bool",
            },
            {
                name: "",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "a",
                type: "address",
            },
            {
                name: "i",
                type: "uint256",
            },
        ],
        name: "getHistoricalVersion",
        outputs: [
            {
                name: "",
                type: "address",
            },
            {
                name: "",
                type: "string",
            },
            {
                name: "",
                type: "string",
            },
            {
                name: "",
                type: "bool",
            },
            {
                name: "",
                type: "bool",
            },
            {
                name: "",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "getIndex",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "getOwner",
        outputs: [
            {
                name: "",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "getPrice",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "a",
                type: "address",
            },
        ],
        name: "getVersions",
        outputs: [
            {
                name: "v",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "a",
                type: "address",
            },
        ],
        name: "isCurator",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "contractName",
                type: "string",
            },
            {
                name: "migrationId",
                type: "string",
            },
        ],
        name: "isMigrated",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "",
                type: "address",
            },
            {
                name: "",
                type: "uint256",
            },
        ],
        name: "versionHistory",
        outputs: [
            {
                name: "_address",
                type: "address",
            },
            {
                name: "_name",
                type: "string",
            },
            {
                name: "_ipfs",
                type: "string",
            },
            {
                name: "_selfAttested",
                type: "bool",
            },
            {
                name: "_curated",
                type: "bool",
            },
            {
                name: "_exists",
                type: "bool",
            },
            {
                name: "_submitter",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];

export default abi;
