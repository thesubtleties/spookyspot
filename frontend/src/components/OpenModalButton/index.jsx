import React from 'react';
import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
  className
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    console.log('OpenModalButton clicked');
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onButtonClick) onButtonClick();
  };

  return (
    <button onClick={onClick} className={className}>
      {buttonText}
    </button>
  );
}

export default OpenModalButton;
