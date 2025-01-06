import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import useUserStore from '../../stores/user';
import { Contract } from 'web3';
import abi from "../../abi/MyNFTV3.json";

const constractABI = abi.abi;

interface IMetaOver {
  provider: any;
  contract: Contract<typeof constractABI>;
}
const MetaOver = ({ provider, contract }: IMetaOver) => {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const { metaAddress } = useUserStore();

  const [urlLst, setUrlLst] = useState<string[]>([]); // URL 리스트 상태



  const getNFTInfo = async () => {
    if (!contract) return;
    try {
      console.log(contract);
      const res: string[] = (await contract.methods.getNFTsByOwner(metaAddress).call()) || []; // 빈 배열 처리
      const nfts: string[] = await Promise.all(
        res.map(async (id) => {
          const uri: string = await contract.methods.getTokenURI(id).call();
          return uri;
        })
      );
      console.log(nfts);
      setUrlLst(nfts);
    } catch (error) {
      console.log(error);
      setUrlLst([]); // 에러 발생 시 빈 배열로 초기화
    }
  };


  const mintNFT = async () => {
    if (!contract) return;
    try {
      console.log(await contract.methods.owner().call());
      const url = 'https://github.com/user-attachments/assets/9e317262-7e2e-4521-9f04-959b32ad0639';
      await contract.methods.mintNFT(metaAddress, url).send({ from: metaAddress });
      getNFTInfo();
      window.alert('성공~');
    }
    catch (error) {
      console.log(error);
    }
  };

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
        <h1 className='d-flex justify-content-center align-items-center'>내 NFT 목록</h1>
        <Row className='d-flex justify-content-center align-items-center mb-3 g-3' xs={1} md={2} lg={3}>
          {urlLst.map((url, index) => (
            <Col key={index} style={colStyle}>
              <Card style={cardContStyle}>
                <Card.Img variant="top" src={url} style={cardStyle} />
              </Card>
            </Col>))}
        </Row>
      </Container>
      <Container>
        <Button onClick={mintNFT}>NFT 민팅</Button>
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