import { TbPumpkinScary } from 'react-icons/tb';
import styles from './styles/LoadingAnimation.module.css';

function LoadingAnimation() {
  return (
    <div className={styles.animationContainer}>
      <TbPumpkinScary className={styles.animation} />
    </div>
  );
}

export default LoadingAnimation;
