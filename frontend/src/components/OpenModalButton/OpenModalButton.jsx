import { useModal } from '../../context/Modal';
import styles from './styles/OpenModalButton.module.css'; // Create this CSS module

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
  className,
}) {
  const { setModalContent, setOnModalClose } = useModal();
  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === 'function') onButtonClick();
  };

  return (
    <button
      onClick={onClick}
      className={`${styles.modalButton} ${className || ''}`}
    >
      {buttonText}
    </button>
  );
}

export default OpenModalButton;
