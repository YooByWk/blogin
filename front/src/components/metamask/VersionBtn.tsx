import React from "react";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import abi from "../../abi/MyNFTV3.json";
interface VersionBtnProps {
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}
const constractABI = abi.abi;
const contractAddress = "0x0eeC786AF0C92a40E0B4D46D750fdd0a1fC8211F";

const VersionBtn: React.FC<VersionBtnProps> = ({ provider, signer }) => {
  const checkVersion = async () => {
    const contract = new ethers.Contract(contractAddress, constractABI, signer);
    
    console.log(await contract.balanceOf("0x625fc12c23d6CE7C196900AaE0B1203369C04B2a"));
    console.log(contract);
    const res = await contract.version();
    console.log(res);
    window.alert(res);
    return res;
  };

  return (
    <div>
      <Button onClick={checkVersion}>버전확인</Button>
    </div>
  );
};

export default VersionBtn;
