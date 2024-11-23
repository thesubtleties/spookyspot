import { useModal } from '../../context/Modal';
import styles from './styles/OpenDeleteSpotModal.module.css';

function OpenDeleteSpotModal({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = (e) => {
    e.stopPropagation();
    if (onModalClose) setOnModalClose(onModalClose);
    console.log(modalComponent);
    setModalContent(modalComponent);
    if (typeof onItemClick === 'function') onItemClick();
  };

  return (
    <button onClick={onClick} className={styles.deleteButton}>
      {itemText}
    </button>
  );
}

export default OpenDeleteSpotModal;
