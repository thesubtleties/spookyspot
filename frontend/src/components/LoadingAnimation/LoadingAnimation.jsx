import { TbPumpkinScary } from 'react-icons/tb';
import styles from './styles/LoadingAnimation.module.css';

function LoadingAnimation({ message = 'Loading...' }) {
  return (
    <div className={styles.animationContainer}>
      <TbPumpkinScary className={styles.animation} />
      {/* {message && <p className={styles.loadingText}>{message}</p>} */}
    </div>
  );
}

export default LoadingAnimation;
