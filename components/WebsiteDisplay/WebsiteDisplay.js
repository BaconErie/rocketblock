import { useState } from 'react';

import SurfaceButton from '../SurfaceButton/SurfaceButton';
import styles from './WebsiteDisplay.module.css';

export default function WebsiteDisplay({ website, handleRemove }) {

  return (<>
    <div className={styles.mainDisplay}>
      <SurfaceButton className={styles.button} onClick={() => handleRemove(website)}>x</SurfaceButton>
      <span className={styles.span}>{website}</span>
    </div>
  </>)
}