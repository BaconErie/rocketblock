import SurfaceButton from '../SurfaceButton/SurfaceButton';
import styles from './WebsiteDisplay.module.css';

export default function WebsiteDisplay({ website }) {
  return (<>
    <div className={styles.mainDisplay}>
      <SurfaceButton className={styles.button}>x</SurfaceButton>
      <span className={styles.span}>{website}</span>
    </div>
  </>)
}