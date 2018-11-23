const spec = {
    version: "0.2",
    address: "",
    submission: {
        comments: "",
        ipfs: [],
    },
    metadata: {
        name: "",
        url: "",
        logo: "",
        description: "",
        contact: [],
        contract: {
            name: "",
            abi: "",
            source: "",
            compiler: "", //0.4.24+commit.e67f0147
            language: "", //Solidity
            optimizer: -1, //200
            swarm: "",
            constructor_arguments: "",
            interfaces: [],
            erc: [],
        },
        token: {
            ticker: "",
            decimals: 18,
        },
        reputation: {
            verified: [],
            status: "",
            category: "",
            subcategory: "",
            description: "",
            related: [],
        },
    },
};

export default spec;
