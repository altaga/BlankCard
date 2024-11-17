// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IStargatePoolUSDC.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

interface IUltraVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs)
        external
        view
        returns (bool);
}

contract BlankAccount is ReentrancyGuard {
    // Owner
    address owner;
    // ZK Settings
    IUltraVerifier noirVerifier;
    IStargatePoolUSDC stargatePoolUSDC;
    IPyth pyth;
    address stargatePoolUSDCAddress;
    IERC20 USDCContract = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(
        address _noirVeriferAddress,
        address _stargatePoolUSDCAddress,
        address _pythContract
    ) {
        owner = msg.sender;
        noirVerifier = IUltraVerifier(_noirVeriferAddress);
        stargatePoolUSDC = IStargatePoolUSDC(_stargatePoolUSDCAddress);
        stargatePoolUSDCAddress = _stargatePoolUSDCAddress;
        pyth = IPyth(_pythContract);
    }

    // Natives Abtraction

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBalanceECR20(address s_contract) public view returns (uint256) {
        IERC20 ERC20Contract = IERC20(s_contract);
        return ERC20Contract.balanceOf(address(this));
    }

    function transferNative(
        uint256 value,
        address payable to,
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) public {
        require(
            noirVerifier.verify(_proof, _publicInputs) == true,
            "Incorrect Proof"
        );
        to.transfer(value);
    }

    function transferECR20(
        uint256 value,
        address _to,
        address _tokenContract,
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) public {
        IERC20 ERC20Contract = IERC20(_tokenContract);
        require(
            noirVerifier.verify(_proof, _publicInputs) == true,
            "Incorrect Proof"
        );
        ERC20Contract.transfer(_to, value);
    }

    function transferECR721(
        address _to,
        address _tokenContract,
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) public {
        require(
            noirVerifier.verify(_proof, _publicInputs) == true,
            "Incorrect Proof"
        );
        IERC721 ERC721Contract = IERC721(_tokenContract);
        ERC721Contract.transferFrom(address(this), _to, 0);
    }

    // Crosschain Transfer

    function approveXUSDC(uint256 value) public onlyOwner {
        USDCContract.approve(stargatePoolUSDCAddress, value);
    }

    function transferXUSDC(
        SendParam calldata _sendParam,
        MessagingFee calldata _fee,
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) public payable{
        require(
            noirVerifier.verify(_proof, _publicInputs) == true,
            "Incorrect Proof"
        );
        stargatePoolUSDC.send{value: msg.value}(_sendParam, _fee, address(this));
    }

    // Pyth Updates

    function updatePyth(bytes[] calldata priceUpdate) public payable{
        uint256 fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{value: fee}(priceUpdate);
    }

    // Transfer Functions

    function newOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function newVerifier(address _noirVeriferAddress) public onlyOwner {
        noirVerifier = IUltraVerifier(_noirVeriferAddress);
    }

    // Receiver and Fallback Functions

    receive() external payable {} // Recieve Deposits

    fallback() external payable {} // Recieve Deposits if recieve doesn't work
}
