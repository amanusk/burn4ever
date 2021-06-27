# Burn 4 Ever

Do you _really_ want to burn some ETH?

Sending it to
`0x0000000000000000000000000000000000000000` or `0x000000000000000000000000000000000000dEaD` is a popular choice, but the ETH is not _really_ burned.

Of course, there is practically 0 chance of anyone ever finding the private key to these addresses, but if some does... it's a lot of ETH to dump on the market.

With Burn4Ever, ETH is really burned, forever :)

### How does it work?

A self destructing contract can send the remaining ETH in the contract to any address. Specifically, to itself.
ETH sent to the contract this way is truly burned and has no way to be restored (well maybe via a fork).

Thanks to `CREATE2` and [ERC-2470](https://eips.ethereum.org/EIPS/eip-2470) we can have a constant contract address, that anyone can deploy a contract to.
The contract has a single instruction: Burn all the ETH in the balance.

If there is ETH in the contract, once it is initiated, the ETH will be burned.

To compensate the burner, 0.1% of the ETH in the contract will be sent to the burner (Yay MEV!)

The contract will always be on the same address on all chains that support ERC-2470.

### Address:

[0xc326af5d2699b6554b5ed11cfc5829e373ae6284](https://etherscan.io/address/0xc326af5d2699b6554b5ed11cfc5829e373ae6284)

### Address generation:

#### Nonce

```
ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BURN4EVER"));
```

#### ByteCode

```
0x608060405234801561001057600080fd5b503273ffffffffffffffffffffffffffffffffffffffff166103e8478161003357fe5b04600067ffffffffffffffff8111801561004c57600080fd5b506040519080825280601f01601f19166020018201604052801561007f5781602001600182028036833780820191505090505b506040518082805190602001908083835b602083106100b35780518252602082019150602081019050602083039250610090565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114610115576040519150601f19603f3d011682016040523d82523d6000602084013e61011a565b606091505b5050503073ffffffffffffffffffffffffffffffffffffffff16fffe
```

#### Creator

```
0xce0042B868300000d44A59004Da54A005ffdcf9f
```

#### Verify Address

```
let burnForeverAddress = ethers.utils.getCreate2Address(
  deployerContract.address,
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes(VERSION)),
  ethers.utils.keccak256(deployTx.data),
);
```

## Library

The library shows an example and a code snippet to deploy the contract.

### Pre Requisites

Before running any command, make sure to install dependencies:

```sh
$ yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Burn ETH in the contract

Polupate the `.env` file as seen in the example file `.env.example`

```
ts-node ./src/Burn4Ever.ts
```
