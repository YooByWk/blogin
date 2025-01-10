// npx hardhat run ./deployTest.ts --network sepolia
const { ethers } = require("hardhat");
const proxyAddress = "0x4cDD1C15371F5A902003Ecd5C59633f0d2253018"; // holesky
// const proxyAddress = "0x038852e125283121375032f483E61d9F1A4CE206"; // holesky - mono contract 
// const proxyAddress = "0x0eeC786AF0C92a40E0B4D46D750fdd0a1fC8211F"; // sepolia 프록시 주소
const { abi } = require("../MyNFT/artifacts/contracts/MyNFTV4.sol/MyNFTV4.json");
import { abi as holeskyAbi } from "../MyNFT/artifacts/contracts/MyNFTV5.sol/MyNFTV5.json";
import { abi as monoAbi } from "../MyNFT/artifacts/contracts/mainNFTContract.sol/mainNFTContract.json";
import { expect } from 'chai';
async function main() {
  // MyNFT 계약 ABI
  // 프록시 계약을 통해 MyNFT 계약 인스턴스를 생성
  const proxy = await ethers.getContractAt("TransparentUpgradeableProxy", proxyAddress);
  const myNFT = await ethers.getContractAt(abi, proxyAddress); // 프록시 주소를 통해 MyNFT 계약 접근
  const holesky_myNFT = await ethers.getContractAt(holeskyAbi, proxyAddress); // 프록시 주소를 통해 MyNFT 계약 접근
  const balanceOfMyAccount = await myNFT.balanceOf(process.env['ACC']);
  const monoNFT = await ethers.getContractAt(monoAbi, proxyAddress); // 프록시 주소를 통해 MyNFT 계약 접근
  console.log(`\nMyNFT balance: ${balanceOfMyAccount}\n`);
  console.log(await monoNFT.owner());

  // id 시작은 1부터.
  // 소유자 계정별 NFT 수
  const ownerOfRes = [];
  for (let i = 1; i <= balanceOfMyAccount; i++) {
    const owner = await myNFT.ownerOf(i);
    if (owner === process.env['ACC']) {
      ownerOfRes.push(i);
    }
    console.log(`MyNFT :  N.${i} token's owner: ${await myNFT.ownerOf(i)}`);
    console.log(`MyNFT : N.${i} token's URI: ${await myNFT.tokenURI(i) ? "링크가 존재함" : "링크가 존재하지 않음"}`);
  }

  console.log('\n총 발행된 NFT의 수 : ', await myNFT.totalMintedNFTs()), '\n';
  try {
    const getNFTsByOwnerRes = await myNFT.getNFTsByOwner(process.env['ACC']);
    console.log('TokenOwner mapping', getNFTsByOwnerRes);
    console.log(ownerOfRes, getNFTsByOwnerRes.map((v) => Number(v)));
  }
  catch {
    console.log('MyNFT : getNFTsByOwner 존재하지 않음');
  }

  console.log("");
  console.log("--- Author & Version ---");
  const nftVersion = await myNFT.version();
  console.log(`| MyNFT version: ${nftVersion} |`);
  const author = await myNFT.author();
  console.log(`|   ${author}     |`);
  console.log("--- Author & Version ---");

  try {
    const res = await holesky_myNFT.canMintCheck();
    console.log(res);

  }
  catch {
    console.log('해당 함수는 존재하지 않음');
  }
}

// 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run ./deployTest.ts --network sepolia