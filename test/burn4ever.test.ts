import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Burn4Ever__factory } from "../typechain";
import { deployContract, VERSION } from "../src/deploy";
import { deployDeployer } from "../src/deployer";
import { Contract } from "ethers";

chai.use(solidity);
const { expect } = chai;

describe("Test burn forever contract", () => {
  let deployerContract: Contract;

  describe("Pay", async () => {
    it("Should burn the eth forever", async () => {
      const [deployer, payer] = await ethers.getSigners();
      deployerContract = await deployDeployer(deployer);
      console.log("Deployer contract address", deployerContract.address);

      let nonce = await deployer.getTransactionCount();
      console.log("Current nonce", nonce);
      const burnForeverFactory = new Burn4Ever__factory(deployer);
      let deployTx = burnForeverFactory.getDeployTransaction();
      console.log(deployTx.data);
      if (deployTx.data) {
        let burnForeverAddress = ethers.utils.getCreate2Address(
          deployerContract.address,
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes(VERSION)),
          ethers.utils.keccak256(deployTx.data),
        );
        console.log("Brun forever address", burnForeverAddress);
        await payer.sendTransaction({ to: burnForeverAddress, value: ethers.utils.parseEther("1.0") });

        let burnForeverBalance = await ethers.provider.getBalance(burnForeverAddress);
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
          let burnForeverBalanceAfter = await ethers.provider.getBalance(burnForeverAddress);
          console.log("B4EVER Balance after", ethers.utils.formatEther(burnForeverBalanceAfter));

          expect(burnForeverBalanceAfter).to.be.equal(0);
        }
      }
    });

    it("Should still be 0 after contract is reiniated", async () => {
      const [deployer, payer] = await ethers.getSigners();
      deployerContract = await deployDeployer(deployer);
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
        console.log("Brun forever address", burnForeverAddress);
        await payer.sendTransaction({ to: burnForeverAddress, value: ethers.utils.parseEther("1.0") });

        let burnForeverBalance = await ethers.provider.getBalance(burnForeverAddress);
        console.log("B4EVER Balance before", ethers.utils.formatEther(burnForeverBalance));

        let deployedAddress = await deployContract(
          deployerContract,
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes(VERSION)),
          deployTx.data,
        );

        let nonce = await deployer.getTransactionCount();
        console.log("Deployer nonce", nonce);

        console.log("B4EVER address", deployedAddress);
        if (deployedAddress) {
          let burnForeverBalanceAfter = await ethers.provider.getBalance(burnForeverAddress);
          console.log("B4EVER Balance after", ethers.utils.formatEther(burnForeverBalanceAfter));

          expect(burnForeverBalanceAfter).to.be.equal(0);

          await deployContract(
            deployerContract,
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes(VERSION)),
            deployTx.data,
          );

          if (deployedAddress) {
            let burnForeverBalanceAfter = await ethers.provider.getBalance(burnForeverAddress);
            console.log("B4EVER Balance after reinit", ethers.utils.formatEther(burnForeverBalanceAfter));

            expect(burnForeverBalanceAfter).to.be.equal(0);
          }
        }
      }
    });
  });
});
