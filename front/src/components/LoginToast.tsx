import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const LoginToast = ({ msg, stateFn, show }: { msg: string, stateFn: (state: boolean) => void, show: boolean; }) => {
  const handleClose = () => {
    console.log(show);
    stateFn(!show);
    console.log(show);
  };
  return (
    <ToastContainer position="bottom-end" className='p-3 mb-5'>
      <Toast delay={5000} bg="success" show={show} onClose={handleClose}>
        <Toast.Header >
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Notice</strong>
        </Toast.Header>
        <Toast.Body>{msg}</Toast.Body>
      </Toast>
    </ToastContainer >
  );
};


export default LoginToast;