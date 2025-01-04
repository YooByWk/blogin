import React, { useCallback, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import useUserStore from "../../stores/user";
import { ethers } from "ethers";
import VersionBtn from "./VersionBtn";
import AuthorBtn from "./AuthorBtn";
import MintBtn from "./MintBtn";
import MyNFTs from "./MyNFTs";

const MetamaskMainPage = () => {
  const { metaAddress, setMetaAddress } = useUserStore();
  const [signer, setSigner] = useState<any>(undefined);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined,
  );
  const [chainId, setChainId] = useState<string | number | undefined>(
    undefined,
  );
  const [balance, setBalance] = useState<bigint | undefined>(undefined);
  const [provider, setProvider] = useState<ethers.BrowserProvider>();

  // MetaMask 연결 함수
  const connectWallet = useCallback(async () => {
    try {
      if (typeof (window as any).ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        setProvider(provider);
        const signer = await provider.getSigner();
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        setMetaAddress(accounts[0]);
        setSigner(signer); // signer 설정
      } else {
        alert("MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.");
      }
    } catch (err) {
      console.log(err);
    }
  }, [setMetaAddress]);
  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  // MetaMask에서 잔고 가져오는 함수
  const getBalance = async (signer: any) => {
    try {
      const balance = await provider!.getBalance(metaAddress); // signer에서 잔고 가져오기
      setBalance(balance);
      console.log("Current Balance: ", ethers.formatEther(balance)); // 이더 단위로 변환하여 출력
    } catch (err) {
      console.log("Error getting balance:", err);
    }
  };

  return (
    <div>
      <h1> MetaMask 페이지</h1>
      <div style={{ display: "flex", flexDirection: "row", gap: "10%" }}>
        <Card style={cardStyle} bg="dark" onClick={connectWallet}>
          {metaAddress ? `연결된 지갑: ${metaAddress}` : "지갑 연결하기"}
          {balance === undefined ? (
            <Button onClick={() => signer && getBalance(signer)}>
              {" "}
              잔고 가져오기
            </Button>
          ) : (
            <Card.Title>잔고: {ethers.formatEther(balance)}ETH</Card.Title>
          )}
        </Card>
        <Card style={cardStyle} bg="dark">
          {provider && signer && (
            <VersionBtn provider={provider} signer={signer} />
          )}
        </Card>
        <Card style={cardStyle} bg="dark">
          {provider && signer && (
            <AuthorBtn provider={provider} signer={signer} />
          )}
        </Card>
        <Card style={cardStyle} bg="dark">
          {provider && signer && (
            <MintBtn provider={provider} signer={signer}></MintBtn>
          )}
        </Card>
        <Card style={cardStyle} bg="dark">
          {provider && signer && <MyNFTs provider={provider} signer={signer} />}
        </Card>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  margin: "0 20px",
  justifyContent: "center",
  height: "150px",
  width: "30%",
  color: "whitesmoke",
  textAlign: "center" as "center",
  alignItems: "center",
};

export default MetamaskMainPage;
