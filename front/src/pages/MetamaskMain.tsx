import React, { useCallback, useEffect, useState } from 'react';
import useUserStore from '../stores/user';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import detectEthereumProvider from '@metamask/detect-provider';
import { Spinner, Container, Button, Navbar, Nav } from 'react-bootstrap';
import MetaOver from '../components/newMetamask/MetaOver';
import { ethers } from 'ethers';
import Web3 from 'web3';
import LoginToast from '../components/LoginToast';
import abi from "../abi/mainNFTContract#mainNFTContract.json";



const constractABI = abi.abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;


console.debug(contractAddress);

const MetamaskMain = () => {
  const navigate = useNavigate();
  const { metaAddress, setMetaAddress } = useUserStore();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<any>(undefined);
  const [activeTab, setActiveTab] = useState('balance');
  const [contract, setContract] = useState<any>(undefined);
  const toast = useLocation().state?.toast;
  const [show, setShow] = useState(true);

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
        const chainId = await (provider as any).request({ method: 'eth_chainId' });
        // console.log(chainId, 'chainId');
        if (chainId !== '0x4268') { // 0x4268 = 17000
          console.log('다른 체인아이디 사용으로 인한 변경');

          await (provider as any).request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4268' }],
          });
        }

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
          <Navbar.Brand href="/">Blockchain Wallet & NFT</Navbar.Brand>
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
      {toast && <LoginToast msg="Metamask로 로그인 되었습니다." stateFn={setShow} show={show} />}
    </>
  );
};
export default MetamaskMain;