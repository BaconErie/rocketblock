import Div from '../../components/div/Div';
import styles from './options.module.css';

export default function OptionsPage() {
  return (<>
    <Div>
      <h1><span className={styles.yellow}>RocketBlock</span> Settings</h1>
    </Div>

    <Div>
      <h1>Ignore list</h1>
    </Div>
  </>)
}