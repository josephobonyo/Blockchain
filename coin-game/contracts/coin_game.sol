// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Interface for the ERC20 token used for wagering in the game.
interface IERC20 {
    function transfer(address recipient, uint256 amount) external;
    function transferFrom(address sender, address recipient, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

// Contract definition for the Coin Toss Game
contract CoinGame {
    // State variables
    address public owner; // Owner of the contract
    IERC20 public token; // Token contract address
    uint256 public houseBalance; // Balance of tokens the house (contract owner) has deposited

    // Events to log activities on the blockchain
    event Tossed(address indexed player, bool result, uint256 wager);
    event Deposit(address indexed owner, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);

    // Contract constructor sets the initial owner and the token used for betting
    constructor(address tokenAddress) {
        owner = msg.sender; // Set the contract deployer as the owner
        token = IERC20(tokenAddress); // Set the ERC20 token address
    }

    // Modifier to restrict function calls to the owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _; // Continue execution of the modified function
    }

    // Function for the owner to deposit tokens into the contract
    function depositTokens(uint256 amount) public onlyOwner {
        token.transferFrom(msg.sender, address(this), amount);
        houseBalance += amount; // Increment the house balance by the deposited amount
        emit Deposit(msg.sender, amount); // Emit a log of the deposit
    }

    // Function for the owner to withdraw tokens from the contract
    function withdrawTokens(uint256 amount) public onlyOwner {
        require(amount <= houseBalance, "Insufficient funds"); // Check if the houseBalance is sufficient
        token.transfer(msg.sender, amount); // Transfer the tokens to the owner
        houseBalance -= amount; // Decrement the house balance by the withdrawn amount
        emit Withdrawal(msg.sender, amount); // Emit a log of the withdrawal
    }

    // Function to allow a player to wager tokens on a coin toss
function play(uint256 wager) public {
    require(token.balanceOf(msg.sender) >= wager, "Insufficient token balance"); // Check player's token balance
    require(houseBalance >= wager, "Insufficient house balance"); // Ensure the house has enough tokens to pay out

    // Transfer the wager amount to the contract
    token.transferFrom(msg.sender, address(this), wager);
    console.log("Wager transferred from player to house:", wager);

    // Perform the coin toss using a pseudo-random number generator
    bool tossResult = random() == 1;
    console.log("Coin toss outcome:", tossResult ? "Heads" : "Tails");

    if (tossResult) {
        // If result is heads (true), player wins
        houseBalance -= wager; // Deduct the winning from the house balance
        token.transfer(msg.sender, wager * 2); // Send the winning tokens to the player
        console.log("Player wins. Tokens transferred to player:", wager * 2);
    } else {
        // If result is tails (false), house wins
        houseBalance += wager; // Increase house balance with the wager amount
        console.log("House wins. Wager added to house balance:", wager);
    }

    // Log final balances
    uint256 finalPlayerBalance = token.balanceOf(msg.sender);
    console.log("Player's final token balance:", finalPlayerBalance);
    console.log("House's final balance:", houseBalance);

    // Emit the result of the toss
    emit Tossed(msg.sender, tossResult, wager);
}


    // Private function to generate a pseudo-random number
    // WARNING: This is not secure and should be replaced for production
    function random() private view returns(uint) {
        // The following line combines several variables to attempt to achieve some randomness
        // It is insecure because miners and others can potentially manipulate these values to their advantage
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender))) % 2;
    }
}
