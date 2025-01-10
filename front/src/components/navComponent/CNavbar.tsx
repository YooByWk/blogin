import { useState, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { accounts } from "web3/lib/commonjs/eth.exports";
import useUserStore from "../../stores/user";

const CNavBar = () => {
  const navigate = useNavigate();
  const { metaAddress, accounts, refreshToken } = useUserStore();

  const [isLogined, setIsLogined] = useState(false);
  const [loginType, setLoginType] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      if (metaAddress && (accounts.length > 0 || refreshToken)) {
        setIsLogined(true);
        setLoginType('both');
      } else if (metaAddress) {
        setIsLogined(true);
        setLoginType('metamask');
      } else if (accounts.length > 0) {
        setIsLogined(true);
        setLoginType('wepin');
      } else {
        setIsLogined(false);
      }
    };
    checkLogin();
  }, [metaAddress, accounts, refreshToken]);


  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand onClick={() => navigate("/")}>
          Blockchain Wallet & NFT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loginType !== 'both' && <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>}
            <Nav.Link onClick={() => navigate("/wallet")}>Wallet</Nav.Link>
            <Nav.Link onClick={() => navigate("/nft")}>NFT</Nav.Link>
            <Nav.Link onClick={() => navigate("/gallery")}>Gallery</Nav.Link>
            <Nav.Link onClick={() => navigate("/wepin")}>Wepin</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default CNavBar;
