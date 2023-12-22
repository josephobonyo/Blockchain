// Script to interact with the Coin Game using Hardhat

const { ethers } = require("hardhat");
require('dotenv').config();
const { METAMASK_PRIVATE_KEY } = process.env;

async function main() {
  const coinGameAddress = "0x7623b89b431c57c38bc5154b005bd3d634e70b27";
  const tokenAddress = "0x022cd252d19B9A4A6e09555C142D5f936CCaAFe0";
  const playerPrivateKey = METAMASK_PRIVATE_KEY; // Acct #1
  //"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Replace with the actual private key

  // Get the signer from the private key
  const playerSigner = new ethers.Wallet(playerPrivateKey, ethers.provider);

  // Get the contract instance of the ERC20 token and Coin Toss Game
  const Token = await ethers.getContractAt("Token", tokenAddress, playerSigner);
  const CoinGame = await ethers.getContractAt("CoinGame", coinGameAddress);

  // Amount to wager, converted to the token's decimals.
  const wagerAmount = ethers.parseUnits("10", 0); // Use the correct decimals for the token

  // Connect the signer to the Token contract and approve the tokens for the Coin Toss Game
  const approveTx = await Token.connect(playerSigner).approve(coinGameAddress, wagerAmount);
  await approveTx.wait();
  console.log(`Approved ${wagerAmount} tokens for the Coin Toss Game.`);

  // Interact with the Coin Toss Game contract to play the game
  const playTx = await CoinGame.connect(playerSigner).play(wagerAmount);
  const receipt = await playTx.wait();
  await playTx.wait();

  // Assuming that 'Tossed' is the event we're interested in, and it's the last event
  // in the transaction events, we can find it by its event signature.
  const tossedEventSignature = "Tossed"; // Replace with the actual event signature hash if necessary

  // Find the Tossed event in the transaction's events
  const tossedEvent = receipt.logs.filter((x) => x.fragment && x.fragment.name === tossedEventSignature)[0];

  if (tossedEvent) {
    // The event's arguments are in the args property
    const [player, result, wager] = tossedEvent.args;

    // Use BigNumber formatting for displaying wager amount if it's a BigNumber
    const formattedWager = ethers.formatUnits(wager, 0); // Adjust '18' to match the token's actual decimals

    console.log(`Game played! Player: ${player}, Outcome: ${result ? "Won" : "Lost"}, Wager: ${formattedWager}`);
    } else {console.log('No game outcome found in the transaction receipt.');
  console.log('No game outcome found in the transaction receipt.');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });