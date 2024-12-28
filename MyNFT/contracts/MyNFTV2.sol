// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyNFTV2 is ERC721URIStorageUpgradeable, OwnableUpgradeable {
    uint256 private _tokenIds;

    function initialize() external initializer {
        __ERC721_init("MyNFT", "YooNFT");
        __Ownable_init(msg.sender);
    }

    function version() public pure returns (string memory) {
        return "1.0.1";
    }

    function author() public pure returns (string memory) {
        return "YBW";
    }

    function mintNFT(
        address recipient,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIds++; // Solidity 0.8 이상에서는 오버플로우 체크가 자동임.
        uint256 newTokenId = _tokenIds;

        _mint(recipient, newTokenId); // 새로운 NFT 발행 (recipient, tokenId)
        _setTokenURI(newTokenId, tokenURI); // 해당 tokenId에 대한 URI 설정

        return newTokenId; // 발행된 새로운 NFT의 tokenId 반환
    }
}
