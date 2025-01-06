import React, { useCallback, useEffect } from 'react';
import useUserStore from '../stores/user';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import detectEthereumProvider from '@metamask/detect-provider';
import { Spinner, Container, Button, Navbar, Nav } from 'react-bootstrap';
import MetaOver from '../components/newMetamask/MetaOver';
import { ethers } from 'ethers';
import abi from "../abi/MyNFTV3.json";
import Web3 from 'web3';
const constractABI = abi.abi;
const contractAddress = "0x0eeC786AF0C92a40E0B4D46D750fdd0a1fC8211F";

const MetamaskMain = () => {
  const navigate = useNavigate();
  const { metaAddress, setMetaAddress } = useUserStore();
  const [connected, setConnected] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [provider, setProvider] = React.useState<any>(undefined);
  const [activeTab, setActiveTab] = React.useState('balance');
  const [contract, setContract] = React.useState<any>(undefined);

  useEffect(() => {
    if (provider) {
      const web3 = new Web3(provider); // Web3 객체 생성
      const newContract = new web3.eth.Contract(constractABI, contractAddress);
      setContract(newContract);
    }
  }, [provider]);

  const connectWallet = useCallback(async () => {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {

        const isConnected = await (provider as any).isConnected();
        if (isConnected) {
          setConnected(true);
          setProvider(provider);
        } else {
          navigate('/login');
        }
      }

    } catch (error) {
      console.log(error);
      navigate('/login');
    }
    finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  if (loading) {
    return (
      <>
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" variant="primary" />
          <div>Loading...</div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Blockchain Wallet & NFT</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setActiveTab('balance')} >Wallet</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('mint')}>Mint NFT</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('gallery')}>NFT Gallery</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {metaAddress && activeTab === 'balance' && <MetaOver provider={provider} contract={contract} ></MetaOver>}
      {metaAddress && activeTab === 'mint' && <></>}
      {metaAddress && activeTab === 'gallery' && <></>}
    </>
  );
};
export default MetamaskMain;