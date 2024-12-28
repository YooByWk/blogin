import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ethers } from 'ethers';
import abi from '../../abi/MyNFTV3.json';


interface AuthorBtnProps {
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}
const constractABI = abi.abi;
const contractAddress = '0x0eeC786AF0C92a40E0B4D46D750fdd0a1fC8211F';

const AuthorBtn: React.FC<AuthorBtnProps> = ({ provider, signer }) => {
  const [author, setAuthor] = useState<string>();

  const checkAuthor = async () => {
    const contract = new ethers.Contract(contractAddress, constractABI, provider);
    console.log(contract);
    const res: string = await contract.author();
    console.log(res);
    window.alert(res);
    setAuthor(res);
    return res;
  };

  return (
    <div>
      <Button onClick={checkAuthor}>Author</Button>
      <p></p>
      {author && <>작성자 : {author}</>}
    </div>
  );
};

export default AuthorBtn;