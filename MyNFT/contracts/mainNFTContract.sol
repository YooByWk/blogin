// SPDX-License-Identifier: M

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract mainNFTContract is Ownable, ERC721URIStorage {
    uint256 private _curTokenId;

    constructor() ERC721("YBWNFT", "YBWNFT") Ownable(msg.sender) {}

    event Minted(address indexed to, uint256 tokenId, string tokenURI); // Minted event
    event Burnt(address indexed owner, uint256 tokenId); // Burnt event

    /**
     * @dev 새로운 NFT를 발급하는 함수
     * @param to 발급 대상 주소
     * @param tokenURI 토큰 URI
     * @return newTokenId 발급된 토큰 ID
     */
    function custom_mintNFT(
        address to,
        string memory tokenURI
    ) external returns (uint256) {
        uint256 newTokenId = _getNextTokenId();
        _safeMint(to, newTokenId); // ERC721
        _setTokenURI(newTokenId, tokenURI); // ERC721

        // 이벤트 호출
        emit Minted(to, newTokenId, tokenURI);
        return newTokenId;
    }

    /**
     * @dev NFT를 소각하는 함수
     * @param tokenId 소각 대상 토큰 ID
     * @return success 성공 여부
     */
    function custom_burnNFT(uint256 tokenId) external returns (bool) {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner"); // ERC721
        _burn(tokenId); // ERC721

        // 이벤트 호출
        emit Burnt(msg.sender, tokenId);

        return true;
    }

    /**
     * @dev 토큰 Id
     * @return _curTokenId 토큰 Id
     */
    function _getNextTokenId() private returns (uint256) {
        return ++_curTokenId;
    }

    /**
     * @dev 현재 발급된 NFT의 총 개수를 반환
     * @return uint256 발급된 NFT 개수
     */
    function totalSupply() external view returns (uint256) {
        return _curTokenId;
    }

    /**
     *  @dev URI 변경 - 관리자 기능
     *  @param tokenId 변경할 토큰 ID
     *  @param newTokenURI 변경할 URI
     *  @return success 성공 여부
     */
    function changeTokenURI(
        uint256 tokenId,
        string memory newTokenURI
    ) external onlyOwner returns (bool) {
        _setTokenURI(tokenId, newTokenURI);
        return true;
    }
}
