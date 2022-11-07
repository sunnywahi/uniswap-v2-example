// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract AToken is ERC20, Ownable{

    constructor(string memory _tokenName, string memory _tokenSymbol) ERC20(_tokenName, _tokenSymbol) {}

    //will emit transfer event
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Returns the number of decimal precision points for the token
     *
     * We explicitly opt into 6 decimal points for our token decimal precision
     *
     * @return The number of decimal precision points
     */
    function decimals() public pure virtual override returns (uint8) {
        return 6;
    }
}
