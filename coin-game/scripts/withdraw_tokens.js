// Hardhat script to withdraw tokens from the CoinGame contract

const hre = require("hardhat");

async function main() {
  // Replace with your contract addresses
  const coinGameAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  // Get the signer to execute the withdrawal function
  const [owner] = await hre.ethers.getSigners();
  
  // Get the contract instance of the ERC20 token and CoinGame contract
  const Token = await hre.ethers.getContractAt("Token", tokenAddress, owner);
  const CoinGame = await hre.ethers.getContractAt("CoinGame", coinGameAddress, owner);

  // Check the house balance
  const houseBalance = await CoinGame.houseBalance();
  console.log(`The house balance is: ${houseBalance.toString()} tokens`); // houseBalance is already a BigNumber

  // Prompt the user to enter the amount to withdraw
  const prompt = require('prompt-sync')({ sigint: true });
  const amountToWithdrawStr = prompt('Enter the amount of tokens you want to withdraw: ');
  if (!/^\d+$/.test(amountToWithdrawStr)) {
    console.error("Invalid input: please enter a valid number.");
    return;
  }  
  const amountToWithdraw = hre.ethers.toBigInt(amountToWithdrawStr);

  // Check if the withdrawal amount is less than or equal to house balance
  if (houseBalance < amountToWithdraw) { // Compare using BigNumber comparison
  console.error("Error: Not enough tokens in house balance to withdraw the specified amount.");
  return; // Exit if the withdrawal amount is too large
  }

  // Withdraw tokens from the CoinGame contract
  try {
    const withdrawTx = await CoinGame.withdrawTokens(amountToWithdraw);
    await withdrawTx.wait();
    console.log(`Withdrawn ${amountToWithdrawStr} tokens from the CoinGame contract.`);
  } catch (error) {
    console.error("An error occurred during the withdrawal: ", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });