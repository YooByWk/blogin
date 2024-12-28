import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MetaMaskPageBtn = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Button onClick={()=> navigate('/metamask')}>메타마스크 이용하기</Button>
    </div>
  );
};

export default MetaMaskPageBtn;