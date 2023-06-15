import styles from './PrimaryButton.module.css';

export default function PrimaryButton({ onClick, children, disabled }) {
  let overlay = disabled ? null : (<span className={styles.PrimaryButton_overlay}></span>)

  return (<>
    <button onClick={onClick} className={styles.PrimaryButton_button} disabled={disabled}>
      {overlay}
      {children}
    </button>
  </>)
}