import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const v4 = buildModule("v4", (m) => {
  const MonoMyNFT = m.contract("MyNFTV4");
  return { MonoMyNFT };
});

export default v4;

