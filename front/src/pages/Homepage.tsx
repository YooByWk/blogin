import useUserStore from '../stores/user';
import { useNavigate } from 'react-router-dom';
import WepinLoginButton from './WepinLoginPage';
import MetaMaskPageBtn from '../components/metamask/MetaMaskPageBtn';
import CNavBar from '../components/navComponent/CNavbar';
import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import LoginPage from './LoginPage';

const Homepage = () => {
  const { metaAddress, accounts, refreshToken } = useUserStore();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isLogined) {
      if (loginType === 'both') {
        // 로그인 상태에 따른 UI
        return;
      }

      if (loginType === 'metamask') {
        navigate('metamaskmainpage', { state: { toast: true } });
      }

      if (loginType === 'wepin') {
        navigate('wepinmainpage');
      }
    } else {
      navigate('/login');
    }
  }, [isLogined, loginType, navigate]);

  // 로그인 상태에 따라 UI 렌더링
  if (isLogined && loginType === 'both') {
    return (
      <div>
        <CNavBar />
        <h2>사용을 원하는 서비스를 선택해주세요</h2>
        <WepinLoginButton />
        <MetaMaskPageBtn />
      </div>
    );
  }

  return <LoginPage />;
};

export default Homepage;
