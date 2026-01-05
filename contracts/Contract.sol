// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.5.0
pragma solidity ^0.8.33;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Contract is Initializable, OwnableUpgradeable {
    error WithdrawFailed();

    // Mapping to track clicks per user
    mapping(address => uint256) public clicks;

    // Total clicks across all users
    uint256 public totalClicks;

    // Track all players who have clicked
    address[] public players;
    mapping(address => bool) public isPlayer;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
    }

    // function initializeV2(...) public reinitializer(2) {}

    /**
     * @dev Click function - increments user's click count
     */
    function click() external {
        clicks[msg.sender]++;
        totalClicks++;

        // Track new players
        if (!isPlayer[msg.sender]) {
            players.push(msg.sender);
            isPlayer[msg.sender] = true;
        }
    }

    /**
     * @dev Get the total number of players
     */
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }

    /**
     * @dev Get clicks for a specific address
     */
    function getClicks(address user) external view returns (uint256) {
        return clicks[user];
    }

    /**
     * @dev Get top players (up to limit)
     */
    function getTopPlayers(uint256 limit) external view returns (address[] memory, uint256[] memory) {
        uint256 count = players.length < limit ? players.length : limit;
        address[] memory topAddresses = new address[](count);
        uint256[] memory topClicks = new uint256[](count);

        // Simple implementation - returns first N players
        // For a full leaderboard, you'd want to sort by clicks
        for (uint256 i = 0; i < count; i++) {
            topAddresses[i] = players[i];
            topClicks[i] = clicks[players[i]];
        }

        return (topAddresses, topClicks);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        if (!success) revert WithdrawFailed();
    }
}
