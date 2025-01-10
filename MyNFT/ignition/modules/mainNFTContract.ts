import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const mainNFTContract = buildModule('mainNFTContract', (m) => {
  const MonoMyNFT = m.contract('mainNFTContract');
  return { MonoMyNFT };
});

export default mainNFTContract;