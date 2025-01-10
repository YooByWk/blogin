import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import proxyModule from "./MyNFT_hol";


const hol_2nd_upgradeModule = buildModule("UpgradeModule", (m) => {
  // const proxyAdminOwner = m.getAccount(0);
  const { proxyAdmin, proxy } = m.useModule(proxyModule);

  const holmyNFTV2 = m.contract("MyNFTV5");
  console.log('MyNFTV5 배포');
  const encodedFuntionCall = m.encodeFunctionCall(holmyNFTV2, "initialize");
  m.call(proxyAdmin, "upgradeAndCall", [proxy, holmyNFTV2, encodedFuntionCall]);

  return { proxyAdmin, proxy };

});

const myNFTV2Module = buildModule("myNFTV2Module", (m) => {
  const { proxy } = m.useModule(hol_2nd_upgradeModule);

  const myNFT = m.contractAt("MyNFTV5", proxy);
  console.log(myNFT);

  return { myNFT }; // deploy 환경에서 실패하는 것이 정상.
});

export default myNFTV2Module;