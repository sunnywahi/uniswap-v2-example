// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UniswapV2 is Ownable {
    //Address is taken from https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#:~:text=Address,was%20built%20from%20commit%206961711.
    address private constant FACTORY_ADDRESS = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    //address of WETH token.  This is needed because some times it is better to trade through WETH.
    //you might get a better price using WETH.
    //example trading from token A to WETH then WETH to token B might result in a better price
    address private constant WETH = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;

    event AddLiquidity(address indexed from, uint256 amountA, uint256 amountB, uint256 liquidity);
    event RemoveLiquidity(uint256 amountA, uint256 amountB);
    event SwapTokens(address indexed from, uint256 amountIn, address indexed to);

    constructor(){
    }

    //Adds the liquidity
    function addLiquidity(address _tokenA, address _tokenB, uint256 _amountA, uint256 _amountB) external {
        require(IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA), "transfer failed for TokenA");
        require(IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB), "transfer failed for TokenB");

        require(IERC20(_tokenA).approve(address(ROUTER_ADDRESS), _amountA), "approve failed to router for tokenA");
        require(IERC20(_tokenB).approve(address(ROUTER_ADDRESS), _amountB), "approved failed to router for tokenB");

        (uint amountA, uint amountB, uint liquidity) = IUniswapV2Router02(ROUTER_ADDRESS).addLiquidity(_tokenA, _tokenB, _amountA, _amountB, 1, 1, address(this), block.timestamp);
        emit AddLiquidity(msg.sender, amountA, amountB, liquidity);
    }

    //Remove the liquidity
    function removeLiquidity(address _tokenA, address _tokenB) external onlyOwner {
        address pair = IUniswapV2Factory(FACTORY_ADDRESS).getPair(_tokenA, _tokenB);
        uint256 liquidity = IERC20(pair).balanceOf(address(this));
        IERC20(pair).approve(ROUTER_ADDRESS, liquidity);

        (uint256 amountA, uint256 amountB) = IUniswapV2Router02(ROUTER_ADDRESS).removeLiquidity(_tokenA, _tokenB, liquidity, 1, 1, address(this), block.timestamp);
        emit RemoveLiquidity(amountA, amountB);
    }

    //this swap function is used to trade from one token to another
    //the inputs are self explainatory
    //_tokenIn = the token address you want to trade out of
    //_tokenOut = the token address you want as the output of this trade
    //_amountIn = the amount of tokens you are sending in
    //to = the address you want the tokens to be sent to
    function swap(address _tokenIn, address _tokenOut, uint256 _amountIn, address _to) external {
        require(_tokenIn != address(0), "in token address can not be zero");
        require(_tokenOut != address(0), "out token address can not be zero");
        require(_amountIn > 0, "amount in can not be zero");
        require(_to != address(0), "address to send the tokens can not be zero");

        // transfer the amount in tokens from msg.sender to this contract
        require(IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn), "transfer failed for the token");

        //by calling IERC20 approve you allow the uniswap contract to spend the tokens in this contract
        require(IERC20(_tokenIn).approve(ROUTER_ADDRESS, _amountIn), "approved failed for router");

        //path is an array of addresses.
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        IUniswapV2Router02(ROUTER_ADDRESS).swapExactTokensForTokens(_amountIn, 1, path, _to, block.timestamp);
        emit SwapTokens(msg.sender, _amountIn, _to);
    }

}
