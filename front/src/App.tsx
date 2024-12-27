import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Test from './pages/Test';
import { WepinLogin } from '@wepin/login-js';
import WepinLoginPage from './pages/WepinLoginPage';
import WepinWidget from './components/WepinWidget';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/wepinLogin" element={<WepinLoginPage />} />
      <Route path="/wepinWidget" element={<WepinWidget />} />
    </Routes>
  );
}

export default App;
