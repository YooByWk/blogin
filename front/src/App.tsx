import "./App.css";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import WepinLoginPage from "./pages/WepinLoginPage";
import WepinWidget from "./components/WepinWidget";
import MetamaskMainPage from "./components/metamask/MetamaskMainPage";
import CNavBar from "./components/navComponent/CNavbar";
import { Container } from "react-bootstrap";
import LoginPage from "./pages/LoginPage";
import MetamaskMain from "./pages/MetamaskMain";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/wepinLogin" element={<WepinLoginPage />} />
        <Route path="/wepinWidget" element={<WepinWidget />} />
        <Route path="/metamaskmainpage" element={<MetamaskMain />} />
        <Route path="/metamask" element={<MetamaskMainPage />} />
      </Routes>
    </>
  );
}

export default App;
