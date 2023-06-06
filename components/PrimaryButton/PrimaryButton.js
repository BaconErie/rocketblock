import styles from './PrimaryButton.module.css';
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({
  weight: '500',
  subsets: [ 'latin' ]
})

export default function PrimaryButton({ onClick, children, disabled }) {
  let overlay = disabled ? null : (<span className={styles.overlay}></span>)

  return (<>
    <button onClick={onClick} className={styles.button} style={openSans.style} disabled={disabled}>
      {overlay}
      {children}
    </button>
  </>)
}