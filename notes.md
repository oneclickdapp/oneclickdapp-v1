Setting ENS to resolve to IPFS hash
"setText" function
node bytes32: 0x7407156505d4facdb6474ccee4aac0c34679f5d6fddb603ab6e8976d8e138c02
key: dnslink
value: /ipfs/QmZQ3GzqXHCRM6uccP6TcZdPGPSyqJXyhwLETD2T2o8m73

Learn about (ENS)[https://docs.ens.domains/en/latest/introduction.html]

Tools for making calls (assuming you are running a node)
https://github.com/ethereum/ens/blob/master/ensutils.js
loadScript('/path/to/ensutils.js');

To transfer ownership of the name use `setOwner`
As the deed owner, your account has the right to reset name ownership back to itself at any time, by using `ethRegistrar.finalizeAuction` again. You can also choose to transfer the deed to another account with `transfer`
See more on ownership [https://docs.ens.domains/en/latest/userguide.html]
The ETH used to win the auction will be transfered along with the deed to the new deed owner.
ENS registry name > resolver contract address > your account address
{use graphic}https://docs.ens.domains/en/latest/implementers.html#resolving

Using https://www.npmjs.com/package/ethereum-ens
to resolve ETH names within a DApp

Give your contract the ability to use ENS registry https://github.com/ensdomains/ens/blob/master/contracts/ENS.sol

deploy ens registry
registrar
ens.setOwner(0, registrar.address, {from: web3.eth.accounts[0]});

then deploy FIFSRegistrar (maybe need to modify this?)

Consider using setABI if using a standard ABI

Is setText used to define IPFS hash?

domain - the complete, human-readable form of a name; eg, ‘vitalik.wallet.eth’.
label - a single component of a domain; eg, ‘vitalik’, ‘wallet’, or ‘eth’. A label may not contain a
period (‘.’).
label hash - the output of the keccak-256 func�on applied to a label; eg, keccak256(‘eth’) =
0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0.
node - the output of the namehash func�on, used to uniquely iden�fy a name in ENS.
