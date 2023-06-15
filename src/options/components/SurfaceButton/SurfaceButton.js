import styles from './SurfaceButton.module.css';

function SurfaceButton({ onClick, children, className }) {
  const stylesToUse = className ? `${styles.SurfaceButton_button} ${className}` : styles.SurfaceButton_button;

  return (<>

    <button onClick={onClick} className={stylesToUse}>
      <span className={styles.SurfaceButton_overlay}></span>
      {children}
    </button>
  </>)
}