import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import abi from "../../abi/MyNFTV3.json";
interface VersionBtnProps {
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}
const contractABI = abi.abi;
const contractAddress = "0x0eeC786AF0C92a40E0B4D46D750fdd0a1fC8211F";
const MintBtn: React.FC<VersionBtnProps> = ({ provider, signer }) => {
  const [txRes, setTxRes] = useState();
  const onClickMint = async () => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );

      const recipient = await signer.getAddress();
      console.log(recipient, await contract.owner());
      console.log(contract);
      const tokenURI = "https://imgur.com/2tgN2ti";
      console.log("민팅");
      const tx = await contract.mintNFT(recipient, tokenURI);
      console.log("트랜잭션 전송 완료");
      const res = await tx.wait();
      console.log(res);
      window.alert(res);
      setTxRes(res);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Button onClick={onClickMint}>민팅~</Button>
      {txRes && <div></div>}
    </div>
  );
};

export default MintBtn;
