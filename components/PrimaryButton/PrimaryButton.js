import styles from './PrimaryButton.module.css';
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({
  weight: '500',
  subsets: [ 'latin' ]
})

export default function PrimaryButton({ onClick, children }) {
  return (<>
    <button onClick={onClick} className={styles.button} style={openSans.style}>
      <span className={styles.overlay}></span>
      {children}
    </button>
  </>)
}