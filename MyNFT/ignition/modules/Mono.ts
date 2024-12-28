import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MonoModule = buildModule("MonoModule", (m) => {
  const MonoMyNFT = m.contract("MonoMYNFT");
  return { MonoMyNFT };
});

export default MonoModule;