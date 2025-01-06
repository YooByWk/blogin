import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CNavBar = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand onClick={() => navigate("/")}>
          Blockchain Wallet & NFT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/wepinLogin")}>Login</Nav.Link>
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
