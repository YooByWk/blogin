# blogin

## 개요

### 개요 
1. **MetaMask** 및 **Wepin**을 활용한 블록체인 지갑 연결
   - 사용자는 MetaMask나 Wepin 지갑을 통해 블록체인 네트워크와 상호작용할 수 있습니다.
2. **NFT 발급**
   - 블록체인 네트워크에서 사용자 고유의 NFT를 발행할 수 있습니다.
   - **주의**: Wepin 서비스는 `Sepolia` 및 `Holesky` 테스트넷의 NFT 발급을 지원하지 않습니다. 이 경우 **MetaMask**를 이용해주세요.



### 소개
블록체인 기술을 활용하여 NFT 발급 및 관리 서비스를 제공합니다.

사용자는 Metamask 혹은 wepin을 선택해 간편하게 블록체인 네트워크에 접속하고, NFT 발급을 비롯한 다양한 기능을 사용할 수 있습니다.

### 설명
- **블록체인 네트워크 연결** : Metamask 혹은 wepin 지갑을 이용해 Ethereum 네트워크에 연결합니다.

## 기능

1. **지갑 연결**
   - MetaMask 및 Wepin을 통해 블록체인 네트워크에 안전하게 연결.
   - 지원 네트워크:  Sepolia, Holesky (MetaMask 한정).
   
2. **NFT 발급**
   - 사용자가 정의한 데이터를 기반으로 NFT를 발행.(URI 저장 방식)
   - MetaMask에서 사용자가 선택한 지갑 환경에서 발급 가능.
   
3. **거래 관리 (추가 예정)**
   - 발행된 NFT를 다른 사용자와 거래할 수 있는 기능 개발 계획.

4. **백엔드**를 활용한 오프체인 토큰 이력 추적
   - 가스비와 토큰 확인을 위해 이벤트에 기반하여 NFT의 발급, 소각, 이전 등의 기록을 생성함

   -  **백엔드 서버가 꺼져있던 동안의 이력을 모듈 실행시 블록 마지막 블록부터 최신 블록까지 추적하는 기능*    
   - **수정 예정...* 웹소켓 연결에 대한 안정성 확보... (재연결 기능 미구현)
   


## 설치 및 설정
1. 리포지토리 클론
2. 의존성 설치
   - 프론트엔드에서는 yarn을 사용합니다.
   - off-chain(BE)에서는 npm을 사용합니다.

**프론트엔드**

```bash
cd front
yarn install
```

**백엔드**

```bash
cd off-chain
npm install
```

3. 환경변수 설정

**프론트엔드(front)**

```env
REACT_APP_WEPIN_APP_ID=YOUR_WEPIN_APP_ID
REACT_APP_WEPIN_APP_KEY_WEB=YOUR_WEPIN_APP_KEY_WEB
REACT_INFURA_API_KEY=YOUR_INFURA_API_KEY

REACT_APP_CONTRACT_ADDRESS=0x038852e125283121375032f483E61d9F1A4CE206 # 이미 배포된 holesky 테스트넷의 컨트랙트입니다.
```

**블록체인(MyNFT)**

```env
ACC=블록체인지갑주소
PRIVATE_KEY=PK(metamask) # 배포시 사용
INFURA_API_KEY=YOUR_INFURA_API_KEY #
```

**백엔드(off-chain)**

prismaORM과 sqlite3 를 사용하기 위한 env 설정

```env
DATABASE_URL="file:./yourdbName.db"
```

4. 서버  및 클라이언트 실행 

```bash
# 프론트엔드
cd front
yarn start

# 백엔드
cd off-chain
npx prisma migrate dev # 최초 1회
npm start
```

## 사용법
1. 웹 브라우저에서 **http://localhost:3000**으로 접속합니다.
2. MetaMask 또는 Wepin 지갑을 연결합니다.
3. 지갑 연결 후, 원하는 데이터를 입력하고 NFT를 발급합니다.
4. 발급된 NFT는 사용자의 지갑에서 확인할 수 있습니다.

- 이미지를 가져온 모습

![image](https://github.com/user-attachments/assets/81b17c5a-913c-4232-ae2d-5019fc6fe6e9)

- wepin 지갑 위젯의 모습 
  ![image](https://github.com/user-attachments/assets/dca9dcd6-1922-4271-9dba-7356dc9462d3)


## 참고자료

- MetaMask 공식 문서
- Wepin 서비스 소개
- [Ethereum 네트워크 정보](https://ethereum.org/ko/)
- NFT 개념 및 활용
