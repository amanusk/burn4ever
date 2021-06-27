import { ethers } from "ethers";
import { deployContract, VERSION } from "../src/deploy";
import { deployDeployer } from "../src/deployer";
import { Burn4Ever__factory } from "../typechain";

import * as dotenv from "dotenv";
dotenv.config();

const GWEI = 1000000000;

const MNEMONIC = process.env.MNEMONIC || "";
if (MNEMONIC === "") {
  console.warn("Must provide MNEMONIC environment variable");
  process.exit(1);
}

let provider = new ethers.providers.AlchemyProvider("mainnet");

const deployer = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);

async function main(): Promise<void> {
  let deployerContract = await deployDeployer(deployer);
  console.log("Deployer contract address", deployerContract.address);

  let nonce = await deployer.getTransactionCount();
  console.log("Current nonce", nonce);
  const burnForeverFactory = new Burn4Ever__factory(deployer);
  let deployTx = burnForeverFactory.getDeployTransaction();
  if (deployTx.data) {
    let burnForeverAddress = ethers.utils.getCreate2Address(
      deployerContract.address,
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(VERSION)),
      ethers.utils.keccak256(deployTx.data),
    );
    console.log("Burn 4 Ever Address", burnForeverAddress);

    let burnForeverBalance = await provider.getBalance(burnForeverAddress);
    console.log("B4EVER Balance before", ethers.utils.formatEther(burnForeverBalance));

    let deployedAddress = await deployContract(
      deployerContract,
      // otpFactory,
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(VERSION)),
      deployTx.data,
    );

    let nonce = await deployer.getTransactionCount();
    console.log("Deployer nonce", nonce);

    console.log("B4EVER address", deployedAddress);
    if (deployedAddress) {
      let burnForeverBalanceAfter = await provider.getBalance(burnForeverAddress);
      console.log("B4EVER Balance after", ethers.utils.formatEther(burnForeverBalanceAfter));
    }
  }
}

main();
