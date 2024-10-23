import { Outlet } from 'react-router-dom';
import styles from './styles/SpotsLayout.module.css';

function SpotsLayout() {
  return (
    <div className={styles.spotsLayout}>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default SpotsLayout;
