import { LoginErrorResult, LoginResult, WepinLogin } from '@wepin/login-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/user';
import { WepinSDK } from '@wepin/sdk-js';

const WepinLoginButton = () => {
  const { accessToken, setAccessToken, refreshToken, setRefreshToken } = useUserStore();
  const appId = process.env['REACT_APP_WEPIN_APP_ID'] || '';
  const appKey = process.env['REACT_APP_WEPIN_APP_KEY_WEB'] || '';
  const navigate = useNavigate();

  // wepin 객체 초기화
  const wepinLogin = new WepinLogin({
    appId, appKey,
  });

  const wepinSdk = new WepinSDK({
    appId, appKey
  });

  const onGoogleLoginClick = async () => {
    if (!wepinLogin.isInitialized()) {
      await wepinLogin.init('ko');
    }

    if (!wepinSdk.isInitialized()) {
      await wepinSdk.init({ 'defaultLanguage': 'ko' });
    }
    console.log(wepinLogin.isInitialized());
    try {
      const res = await wepinLogin.loginWithOauthProvider({ provider: 'google' });

      if ((res as LoginResult).token) {
        const loginRes = res as LoginResult;
        const oAuthIdToken = loginRes.token.idToken;
        const oAuthRefreshToken = loginRes.token.refreshToken;

        const wepinUserInfo = await wepinLogin.loginWepin({ provider: 'google', token: { idToken: oAuthIdToken, refreshToken: oAuthRefreshToken } });
        setAccessToken(wepinUserInfo.token!.accessToken);
        setRefreshToken(wepinUserInfo.token!.refreshToken);
        console.log('로그인 성공', wepinUserInfo);
        if (wepinUserInfo.userStatus?.loginStatus !== 'complete') {
          const registerRes = await wepinSdk.register();
          console.log(registerRes);

        }
        window.alert('구글 계정으로 로그인 되었습니다.'); // toast로 변경
        navigate('/wepinWidget');

        // 해당 정보를 가지고 widget으로 이동
      } else {
        const errorRes = res as LoginErrorResult;
        console.error('로그인 실패', errorRes.error);
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <button onClick={onGoogleLoginClick} >Wepin Login with Google</button>
    </div >
  );
};

export default WepinLoginButton;
