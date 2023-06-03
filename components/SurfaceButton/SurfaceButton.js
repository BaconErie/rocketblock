import styles from './SurfaceButton.module.css';
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({
  weight: '500',
  subsets: [ 'latin' ]
})

export default function SurfaceButton({ onClick, children, className }) {
  const stylesToUse = className ? `${styles.button} ${className}` : styles.button;

  return (<>

    <button onClick={onClick} className={stylesToUse} style={openSans.style}>
      <span className={styles.overlay}></span>
      {children}
    </button>
  </>)
}