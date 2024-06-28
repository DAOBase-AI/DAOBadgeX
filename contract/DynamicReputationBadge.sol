// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.0/security/Pausable.sol";
import "@openzeppelin/contracts@4.7.0/utils/Counters.sol"; 

contract DynamicReputationBadge is ERC721, Ownable, Pausable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    mapping(address => bool) private _hasMinted;
    string private _baseURIextended;

    constructor() ERC721("DAOBase: Dynamic Reputation Badge", "DRB") {}

    function safeMint() public whenNotPaused { // Add whenNotPaused modifier
        require(!_hasMinted[msg.sender], "Already minted a token");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _hasMinted[msg.sender] = true;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    // Add pause and unpause functions
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
    address from, 
    address to, 
    uint256 tokenId
    ) internal override virtual {
        require(from == address(0), "Err: token transfer is BLOCKED"); 
        super._beforeTokenTransfer(from, to, tokenId);  
    }
}