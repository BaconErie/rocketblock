'use client'

import styles from './options.module.css';
import { Open_Sans } from 'next/font/google';

import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';

const openSans = Open_Sans({
  weight: '500',
  subsets: [ 'latin' ]
})


export default function OptionsPage() {
  return (<><main className={styles.main}>
    <div>
      <h1><span className={styles.yellow}>RocketBlock</span> Settings</h1>
    </div>

    <div>
      <h1>Ignore list</h1>

      <br />
      
      <div className={styles.inputWrapper}>
        <input className={styles.inputBox} style={openSans.style} type="text" placeholder="Add a website to ignore" />

        <PrimaryButton onClick={() => {console.log('ignore')}}>Ignore</PrimaryButton>
      </div>

      <p>Notes:</p>
      <ul className={styles.ul}>
          <li>Leave on the http:// or https:// to block only that page</li>
          <li>Remove the http part to block the entire domain/website</li>
          <li>Use * as a placeholder/wildcard</li>
      </ul>
    </div>
  </main></>)
}