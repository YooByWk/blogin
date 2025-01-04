import { ethers } from "ethers";
import { useState } from "react";
import { Button } from "react-bootstrap";

import abi from "../../abi/MyNFTV3.json";
const constractABI = abi.abi;
const contractAddress = "0x0eeC786AF0C92a40E0B4D46D750fdd0a1fC8211F";

const MyNFTs = ({ signer, provider }) => {
  const [cnt, setCnt] = useState(0); // 기본값 0으로 초기화
  const [urlLst, setUrlLst] = useState<string[]>([]); // URL 리스트 상태

  const getNFT = async () => {
    try {
      // 스마트 컨트랙트 인스턴스 생성
      const contract = new ethers.Contract(
        contractAddress,
        constractABI,
        signer,
      );
      const recipient = await signer.getAddress(); // 현재 사용자 주소 가져오기

      // 사용자 소유 NFT의 토큰 ID 리스트 가져오기
      const res = await contract.getNFTsByOwner(recipient);
      console.log("Recipient Address:", recipient);
      console.log("NFT Token IDs:", res);

      // 총 발행된 NFT 개수 가져오기
      const totalTokenCnt = await contract.totalMintedNFTs();
      console.log("Total Minted NFTs:", totalTokenCnt);
      setCnt(res.length); // NFT 개수 업데이트

      // 각 토큰의 URI 가져오기
      const tmpLst: string[] = await Promise.all(
        res.map(async (id) => {
          const uri = await contract.getTokenURI(id);
          return uri;
        }),
      );

      console.log("Token URIs:", tmpLst);
      setUrlLst(tmpLst); // 상태 업데이트
    } catch (err) {
      console.error("Error fetching NFTs:", err);
    }
  };

  return (
    <>
      <div>
        <Button onClick={getNFT}>NFT 불러오기</Button>
      </div>
      <div>
        <h3>내 NFT 목록</h3>
        <p>소유한 NFT 개수: {cnt}</p>
        <ul>
          {urlLst.map((url, index) => (
            <li key={index}>
              {url.includes("imgur") ? (
                <>
                  <blockquote
                    className="imgur-embed-pub"
                    lang="en"
                    data-id="2tgN2ti"
                  >
                    <a href={url}> View post on imgur.com</a>
                  </blockquote>
                  <script
                    async
                    src="//s.imgur.com/min/embed.js"
                    charSet="utf-8"
                  ></script>
                </>
              ) : (
                <img src={url}></img>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MyNFTs;
