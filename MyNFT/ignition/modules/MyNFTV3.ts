import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import proxyModule from "./MyNFT";


const upgradeModuleV3 = buildModule("UpgradeModuleV3", (m) => {
  const { proxyAdmin, proxy } = m.useModule(proxyModule);
  const myNFTV3 = m.contract("MyNFTV3");

  // MyNFTV3를 업그레이드
  const encodedFunctionCall = m.encodeFunctionCall(myNFTV3, "author");
  m.call(proxyAdmin, "upgradeAndCall", [proxy, myNFTV3, encodedFunctionCall]);

  console.log('MyNFTV3 배포');
  return { proxyAdmin, proxy };
});

// MyNFTV3 모듈 정의
const myNFTV3Module = buildModule("myNFTV3Module", (m) => {
  const { proxy } = m.useModule(upgradeModuleV3);

  // MyNFTV3 계약을 해당 proxy에서 불러오기
  const myNFT = m.contractAt("MyNFTV3", proxy);
  console.log(myNFT.contractName);  // MyNFTV3 확인

  return { myNFT };
});

export default myNFTV3Module;
