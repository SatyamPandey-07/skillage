// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SkillChainCert is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;

    struct Certificate {
        string topic;
        string difficulty;
        uint8 score;
        uint256 issuedAt;
        address learner;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public learnerCerts;

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed learner,
        string topic,
        uint8 score
    );

    constructor() ERC721("SkillChain Certificate", "SKILLCERT") Ownable(msg.sender) {}

    // Soulbound: block all transfers except minting (from == address(0))
    function _update(address to, uint256 tokenId, address auth)
        internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "SkillChain: certificates are soulbound and non-transferable");
        return super._update(to, tokenId, auth);
    }

    function mintCertificate(
        address learner,
        string memory topic,
        string memory difficulty,
        uint8 score
    ) external onlyOwner returns (uint256) {
        require(score >= 80, "SkillChain: score below passing threshold of 80");
        require(bytes(topic).length > 0, "SkillChain: topic cannot be empty");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(learner, tokenId);

        certificates[tokenId] = Certificate({
            topic: topic,
            difficulty: difficulty,
            score: score,
            issuedAt: block.timestamp,
            learner: learner
        });
        learnerCerts[learner].push(tokenId);

        emit CertificateMinted(tokenId, learner, topic, score);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "SkillChain: token does not exist");
        Certificate memory cert = certificates[tokenId];

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name":"SkillChain: ', cert.topic, '",',
            '"description":"Earned by ', Strings.toHexString(uint256(uint160(cert.learner)), 20),
            ' with a score of ', Strings.toString(cert.score), '/100 on ',
            cert.topic, ' (', cert.difficulty, '). Issued on Base Sepolia via SkillChain.',
            '","attributes":[',
            '{"trait_type":"Topic","value":"', cert.topic, '"},',
            '{"trait_type":"Difficulty","value":"', cert.difficulty, '"},',
            '{"trait_type":"Score","value":', Strings.toString(cert.score), '},',
            '{"trait_type":"Passing Threshold","value":80},',
            '{"trait_type":"Platform","value":"SkillChain"},',
            '{"trait_type":"Network","value":"Base Sepolia"},',
            '{"display_type":"date","trait_type":"Issued","value":', Strings.toString(cert.issuedAt), '}',
            ']}'
        ))));

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function getCertsByLearner(address learner) external view returns (uint256[] memory) {
        return learnerCerts[learner];
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
