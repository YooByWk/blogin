import  useUserStore  from '../stores/user'
import { useNavigate } from 'react-router-dom';
import WepinLoginButton from './WepinLoginPage';
const Homepage = () => {
  const { username, setUsername } = useUserStore();
  const navigate = useNavigate()
  
  return (
    <div>
      <h1>Homepage</h1>
      <WepinLoginButton/>
    </div>
  );
};

export default Homepage;