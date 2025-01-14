import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import useUserStore from '../../stores/user';
import Web3, { Contract } from 'web3';
import abi from "../../abi/mainNFTContract#mainNFTContract.json";
import MetaMintModal from './MetaMintModal';
import axios from 'axios';
import { ethers } from 'ethers';

const constractABI = abi.abi;

interface IMetaOver {
  provider: any;
  contract: Contract<typeof constractABI>;
}
const MetaOver = ({ provider, contract }: IMetaOver) => {
  const web3 = new Web3();
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const { metaAddress } = useUserStore();

  const [urlLst, setUrlLst] = useState<any>([]); // URL 리스트 상태



  const getNFTInfo = async () => {
    if (!contract) return;
    try {
      const validAddress = ethers.getAddress(metaAddress);
      const res = await axios.get(`http://127.0.0.1:8080/token/${validAddress}`);
      console.log(res.data);
      setUrlLst(res.data);
    } catch (error) {
      console.log(error);
      setUrlLst([]); // 에러 발생 시 빈 배열로 초기화
    }
  };

  // NFT 클릭 시 이벤트 함수
  const onNFTClick = async (url) => {
    console.log(url);
    const res = await contract.methods.tokenURI(url).call();
    const owner: string = await contract.methods.ownerOf(url).call();
    console.log(res, String(owner).toLowerCase() === String(metaAddress).toLowerCase());
  };

  // NFT 민팅 함수 2025/01/10 수정 - holesky
  const mintNFT = async (url: string) => {
    if (!contract) return;
    console.log(contract);

    try {
      console.log(await contract.methods.owner().call());
      await contract.methods.custom_mintNFT(metaAddress, url).send({ from: metaAddress }).then(() => getNFTInfo());
      // console.log(receipt.transactionHash);
      // await web3.eth.getTransactionReceipt(receipt.transactionHash);
      // console.log(receipt);
      getNFTInfo();
      window.alert('성공~');
    }
    catch (error) {
      console.log(error);
    }
  }; // NFT 민팅 함수 끝

  useEffect(() => {
    const getBalance = async () => {
      try {
        const gweiBalance = await provider.request({
          method: 'eth_getBalance',
          params: [
            metaAddress,
            "latest"
          ]
        });
        const ether = parseInt(gweiBalance, 16) / 10 ** 18;
        console.log(ether);
        setBalance(ether);
      } catch (error) {
        console.log(error);
      }
    };
    getBalance();
  }, []);

  useEffect(() => {
    getNFTInfo();
  }, [contract]);


  return (
    <>
      <Container className='p-2 mt-2'>
        <Card className='p-2'>
          <Card.Body>
            <Card.Title className=''>내 지갑 정보</Card.Title>
            <Card.Text className=''>주소: {metaAddress}</Card.Text>
            <Card.Text className=''>잔고: {balance} ETH</Card.Text>
          </Card.Body>
        </Card>
      </Container>
      <Container className='p-2 mt-2 ' >
        {urlLst.length > 0 ?
          <>
            <h1 className='d-flex justify-content-center align-items-center'>내 NFT 목록</h1>
            <Row className='d-flex justify-content-center align-items-center mb-3 g-3' xs={1} md={2} lg={3}>
              {urlLst.map((token, index) => (
                token !== '' && (
                  <Col key={index} style={colStyle}>
                    <Card style={cardContStyle} onClick={() => onNFTClick(token.tokenId)}>
                      <Card.Img variant="top" src={token.tokenURI} style={cardStyle} />
                    </Card>
                  </Col>)
              )
              )}
            </Row>
          </>
          :
          <><h1 className='d-flex justify-content-center align-items-center'>NFT가 없습니다.</h1></>}
      </Container>
      <Container>
        <MetaMintModal mintNFT={mintNFT} />
      </Container>
    </>
  );
};



const colStyle = {
  marginBottom: '1rem',
} as React.CSSProperties;

const cardContStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

};

const cardStyle = {
  width: '18rem',
  height: '18rem',
  display: 'flex',
  margin: '0 auto',
};
export default MetaOver;;