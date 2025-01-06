import useUserStore from '../stores/user';
import { useNavigate } from 'react-router-dom';
import WepinLoginButton from './WepinLoginPage';
import MetaMaskPageBtn from '../components/metamask/MetaMaskPageBtn';
import CNavBar from '../components/navComponent/CNavbar';
const Homepage = () => {
  const { username, setUsername } = useUserStore();
  const navigate = useNavigate();

  return (

    <div>
      <CNavBar />
      <h1>Homepage</h1>
      <WepinLoginButton />
      <MetaMaskPageBtn />
    </div>
  );
};

export default Homepage;