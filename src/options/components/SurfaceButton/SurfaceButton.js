import styles from './SurfaceButton.module.css';

export default function SurfaceButton({ onClick, children, className }) {
  const stylesToUse = className ? `${styles.SurfaceButton_button} ${className}` : styles.SurfaceButton_button;

  return (<>

    <button onClick={onClick} className={stylesToUse}>
      <span className={styles.SurfaceButton_overlay}></span>
      {children}
    </button>
  </>)
}