import styles from './Div.module.css';

export default function Div({ className, children }) {
  if (!className) {
    className = styles.div;
  }

  return (<>
    <div className={className}>
      {children}
    </div>
  </>)
}