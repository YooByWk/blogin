import { Container, Row, Col, Button } from "react-bootstrap";
import MetamaskLoginBtn from "../components/metamask/MetamaskLoginBtn";
import "./LoginPage.css";
import CNavBar from "../components/navComponent/CNavbar";

function LoginPage() {
  return (<>
    <CNavBar />

    <Container fluid className="login-container">
      <Row className="h-100">
        <Col md={7} className="image-container p-0">
          <img
            src={require("../assets/bg.jpg")}
            alt="Blockchain illustration"
            className="login-image"
          />
        </Col>
        <Col
          md={5}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <h1 className="mb-4">
            블록체인 & NFT <br />
            서비스에 오신걸 환영합니다.
          </h1>
          <div className="d-grid gap-3 w-100">
            <MetamaskLoginBtn />

            <Button variant="outline-primary" size="lg">
              Wepin 지갑으로 로그인
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  </>
  );
}

export default LoginPage;
