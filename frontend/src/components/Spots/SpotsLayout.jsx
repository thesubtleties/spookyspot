import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './SpotsLayout.module.css';

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
