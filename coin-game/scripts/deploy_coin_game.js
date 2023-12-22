async function main() {
  const [deployer] = await ethers.getSigners(); // Retrieve deployer from signers
  console.log("Deploying contract with the account:", deployer.address);

  // console.log("Account balance:", await deployer.provider.getBalance(deployer.address));

  // Replace 'YOUR_ERC20_TOKEN_ADDRESS' with the actual address of the ERC20 token
  // that your CoinGame contract will work with.
  const tokenAddress = "0xCd3b63f67A7CfC0C2bb674A0d3314eed6A090879"; 

  // Get the ContractFactory for the "CoinGame" contract.
  const CoinGame = await ethers.getContractFactory("CoinGame");

  // Deploy the contract using the deployer account and pass the constructor parameter.
  const game = await CoinGame.deploy(tokenAddress);//, {gasLimit: 10000000}
  
  // Wait for the deployment transaction to be mined.
  await game.waitForDeployment();

  console.log("Game deployed to:", await game.getAddress()); // Log the address of the deployed contract.
}

// Run the main function and handle any errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

