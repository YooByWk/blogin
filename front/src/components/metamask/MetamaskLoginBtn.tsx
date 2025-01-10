import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import useUserStore from "../../stores/user";
import { ethers } from "ethers";
import { Button, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const MetamaskLoginBtn = () => {

  const [error, setError] = useState<string | null>(null);
  const { metaAddress, setMetaAddress } = useUserStore();
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await (provider as any).request({
          method: "eth_requestAccounts",
        });
        setMetaAddress(accounts[0]);

        navigate("/metamaskmainpage", { state: { toast: true } });

      }
    } catch (error) {
      console.log(error);
      window.alert("메타마스크를 설치해주세요");
    }
  };
  return (
    <>
      <Button size="lg" variant="outline-primary" onClick={connectWallet}>MetaMask 로그인</Button>
    </>
  );
};

export default MetamaskLoginBtn;
