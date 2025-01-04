import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import proxyModule from "./MyNFT";

const upgradeModuleV4 = buildModule("upgradeModuleV4", (m) => {
  const { proxyAdmin, proxy } = m.useModule(proxyModule);
  const myNFTV4 = m.contract("MyNFTV4");

  // MyNFTV3를 업그레이드
  const encodedFunctionCall = m.encodeFunctionCall(myNFTV4, "author");
  m.call(proxyAdmin, "upgradeAndCall", [proxy, myNFTV4, encodedFunctionCall]);

  console.log("MyNFTV4 배포");
  return { proxyAdmin, proxy };
});

// MyNFTV3 모듈 정의
const myNFTV4Module = buildModule("myNFTV4Module", (m) => {
  const { proxy } = m.useModule(upgradeModuleV4);

  // MyNFTV3 계약을 해당 proxy에서 불러오기
  const myNFT = m.contractAt("MyNFTV4", proxy);
  console.log(myNFT.contractName); // MyNFTV3 확인

  return { myNFT };
});

export default myNFTV4Module;
