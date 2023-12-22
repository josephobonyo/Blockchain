// Hardhat script to deposit tokens to the CoinGame contract

// Import ethers directly from Hardhat
const { ethers } = require("hardhat");


async function main() {
  // Replace with your contract addresses and the amount to deposit
  const coinGameAddress = "0x7623b89b431c57c38bc5154b005bd3d634e70b27";
  const tokenAddress = "0x022cd252d19B9A4A6e09555C142D5f936CCaAFe0";
  const amountToDeposit = ethers.parseUnits("1000", 0); 

  // Get the signer to execute the deposit function
  const [owner] = await ethers.getSigners();
  
  //const token = await ethers.getContractFactory("Token")
  // Get the contract instance of the ERC20 token and CoinGame contract
  const Token = await ethers.getContractAt("Token", tokenAddress, owner);
  const CoinGame = await ethers.getContractAt("CoinGame", coinGameAddress, owner);

  // Approve the CoinGame contract to move your tokens
  const approveTx = await Token.approve(coinGameAddress, amountToDeposit);
  await approveTx.wait();
  console.log(`Approved CoinGame contract to spend ${amountToDeposit.toString()} tokens.`);

  // Deposit tokens into the CoinGame contract
  const depositTx = await CoinGame.depositTokens(amountToDeposit);
  await depositTx.wait();
  console.log(`Deposited ${amountToDeposit.toString()} tokens to the CoinGame contract.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
