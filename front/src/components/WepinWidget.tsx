import { Account, AccountBalanceInfo, WepinSDK } from '@wepin/sdk-js';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import TxWidget from './metamask/TxWidget';


const WepinWidget = () => {
  const [loading, setLoading] = useState(true);
  const [userWallet, setUserWallet] = useState<Account[]>();
  const [userBalance, setUserBalance] = useState<AccountBalanceInfo[]>();

  const appId = process.env['REACT_APP_WEPIN_APP_ID'] || '';
  const appKey = process.env['REACT_APP_WEPIN_APP_KEY_WEB'] || '';

  const wepinSdk = useMemo(() => {
    const appId = process.env.REACT_APP_WEPIN_APP_ID || '';
    const appKey = process.env.REACT_APP_WEPIN_APP_KEY_WEB || '';
    return new WepinSDK({ appId, appKey });
  }, []); // 컴포넌트가 처음 마운트될 때만 실행

  useEffect(() => {
    const initWepinSdk = async () => {
      try {
        if (!wepinSdk.isInitialized()) {
          await wepinSdk.init({
            type: 'hide',
            defaultLanguage: 'ko',
            defaultCurrency: 'KRW'
          });
        }
        console.log(wepinSdk.isInitialized());
        const accounts = await wepinSdk.getAccounts();
        const balance = await wepinSdk.getBalance(accounts);
        console.log('지갑 계정:', accounts);
        setUserWallet(accounts);
        setUserBalance(balance);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    initWepinSdk();
  }, [wepinSdk]);

  useEffect(() => {
    console.log('Updated userWallet:', userWallet);
    console.log(userBalance);
  }, [userWallet]);

  return (
    <div>
      {loading
        ? <Spinner></Spinner>
        :
        <>
          <Button onClick={() => wepinSdk.openWidget()}>지갑 위젯 열기</Button>
          <p style={{ height: '50px' }}></p>
          <Card bg={'dark'} style={{ color: 'whitesmoke', width: '80%' }}>
            {userWallet && userWallet.map((account, idx) => (
              <Card.Body key={idx}>
                <Card.Title>내 지갑 정보 : {idx + 1}</Card.Title>
                <Card.Text>네트워크 : {account.network}</Card.Text>
                <Card.Text>지갑 주소 : {account.address}</Card.Text>
                {userBalance && userBalance[idx] ? (
                  <Card.Text>잔고 : {userBalance[idx].balance || 0} {userBalance[idx].symbol}</Card.Text>
                ) : (
                  <Card.Text>잔고 정보를 가져올 수 없습니다.</Card.Text>
                )}
                {account.contract && <Card.Text>컨트랙트 {account.contract}</Card.Text>}
              </Card.Body>
            ))}
          </Card>
        </>

      }
    </div>
  );
};

export default WepinWidget;

