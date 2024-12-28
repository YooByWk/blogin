import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const proxyModule = buildModule("NFTProxyModule", (m) => {
  const proxyAdminOwner = m.getAccount(0);

  const myNFT = m.contract("MyNFT");
  const proxy = m.contract("TransparentUpgradeableProxy", [
    myNFT,
    proxyAdminOwner,
    "0x"
  ]);
  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin"
  );
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  return { proxyAdmin, proxy };
});

const NFTModule = buildModule("NFTModule", (m) => {
  const { proxy, proxyAdmin } = m.useModule(proxyModule);
  const myNFT = m.contractAt("MyNFT", proxy);
  return { myNFT, proxy, proxyAdmin };
});

// export default NFTModule;