import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import proxyModule from "./MyNFT_hol";


const upgradeModule = buildModule("UpgradeModule", (m) => {
  // const proxyAdminOwner = m.getAccount(0);
  const { proxyAdmin, proxy } = m.useModule(proxyModule);

  const myNFTV2 = m.contract("MyNFTV2");
  console.log('MyNFTV2 배포');
  const encodedFuntionCall = m.encodeFunctionCall(myNFTV2, "initialize");
  m.call(proxyAdmin, "upgradeAndCall", [proxy, myNFTV2, encodedFuntionCall]);

  return { proxyAdmin, proxy };

});

const myNFTV2Module = buildModule("myNFTV2Module", (m) => {
  const { proxy } = m.useModule(upgradeModule);

  const myNFT = m.contractAt("MyNFTV2", proxy);
  console.log(myNFT);

  return { myNFT }; // deploy 환경에서 실패하는 것이 정상.
});

export default myNFTV2Module;