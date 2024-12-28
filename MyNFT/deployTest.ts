
const { ethers } = require("hardhat");

async function main() {
  const proxyAddress = "0x0eeC786AF0C92a40E0B4D46D750fdd0a1fC8211F"; // 프록시 주소

  // Hardhat 환경에서 계정 가져오기
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // MyNFT 계약 ABI
  const myNFTABI = [
    "function version() public pure returns (string memory)",
    "function author() public pure returns (string memory)",
  ];

  // 프록시 계약을 통해 MyNFT 계약 인스턴스를 생성
  const proxy = await ethers.getContractAt("TransparentUpgradeableProxy", proxyAddress);
  console.log(proxy === proxyAddress);
  console.log(proxy);

  const myNFT = await ethers.getContractAt(myNFTABI, proxyAddress); // 프록시 주소를 통해 MyNFT 계약 접근



  // version() 호출
  const nftVersion = await myNFT.version();
  console.log(`MyNFT version: ${nftVersion}`);
  const author = await myNFT.author();
  console.log(author);
}

// 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
