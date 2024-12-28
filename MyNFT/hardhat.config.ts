import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
dotenvConfig(); // .env 파일 로드

console.log(process.env["INFURA_API_KEY"]!);
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env['INFURA_API_KEY']!}`,
      accounts: [`0x${process.env["PRIVATE_KEY"]!}`]
    }
  }
};

export default config;
