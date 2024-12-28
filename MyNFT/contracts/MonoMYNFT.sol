// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MonoMYNFT is ERC721Enumerable {
    uint256 public constant MAX_SUPPLY = 20;

    // 토큰 ID에 해당하는 이름과 가격을 저장
    mapping(uint256 => string) private _tokenNames;
    mapping(uint256 => uint256) private _tokenPrices;

    constructor() ERC721("MonoMYNFT", "YOONFT") {}

    // mintNFT 함수에서 이름과 가격을 설정할 수 있게 수정
    function mintNFT(
        address recipient,
        string memory tokenName,
        uint256 price
    ) public returns (uint256) {
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");

        uint256 newTokenId = totalSupply() + 1; // totalSupply()를 사용해 토큰 ID 관리

        _mint(recipient, newTokenId); // 새로운 NFT 발행 (recipient, tokenId)

        _tokenNames[newTokenId] = tokenName; // 토큰 이름 설정
        _tokenPrices[newTokenId] = price; // 토큰 가격 설정

        return newTokenId; // 발행된 새로운 NFT의 tokenId 반환
    }

    // 이름을 조회하는 함수
    function getTokenName(uint256 tokenId) public view returns (string memory) {
        return _tokenNames[tokenId];
    }

    // 가격을 조회하는 함수
    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
    }
}
