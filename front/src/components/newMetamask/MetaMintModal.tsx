import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'; // 로딩 스피너 컴포넌트 추가

function MetaMintModal({ mintNFT }: { mintNFT: (url: string) => void; }) {
  const [show, setShow] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isValid = (imgUrl.startsWith('http')) && imgUrl.includes('://');
    setIsValidInput(isValid);
  }, [imgUrl]);

  const onMintClick = async () => {
    if (!imgUrl) return;

    try {
      setIsLoading(true);
      await mintNFT(imgUrl);

      // 민팅이 성공하면 모달을 닫습니다.
      setShow(false);
    } catch {
      window.alert('민팅에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setImgUrl(e.target.value);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        신규 NFT 민팅
      </Button>

      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            NFT 민팅
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ position: 'relative' }}>
          {/* 로딩 오버레이 */}
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>민팅할 이미지의 주소를 입력해주세요</Form.Label>
              <Form.Control placeholder="이미지 주소" onChange={handleChange} />
              <Form.Text className="text-muted">
                Imgur는 지원하지 않습니다....
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(!show)} variant="secondary">취소</Button>
          <Button onClick={onMintClick} variant="primary" disabled={!isValidInput || isLoading}>민팅</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MetaMintModal;
