'use client'; // Allows us to use event handlers. Doesn't matter if it's client or server components, this is all going to compiled to client anyway

import { useState } from 'react';

import styles from './options.module.css';
import { Open_Sans } from 'next/font/google';

import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import WebsiteDisplay from '../../components/WebsiteDisplay/WebsiteDisplay';

const openSans = Open_Sans({
  weight: '500',
  subsets: [ 'latin' ]
})

function isBlocking() {
  return false;
}


function WebsiteList({ ignoreDisplay, setIgnoreDisplay }) {

  function handleRemove(website) {
    

    if (isBlocking()) {
      const reallyDelete = confirm(`Are you sure you want to remove {website} from you ignore list? You won't be able to add it back until your block has ended!`); 

      if (!reallyDelete) {
        return;
      }
    }

    //TODO: ACTUALLY REMOVE THE WEBSITE FROM THE IGNORE LIST
    let newIgnoreDisplay = [...ignoreDisplay];
    const index = newIgnoreDisplay.indexOf(website);
    if (index > -1) { 
      newIgnoreDisplay.splice(index, 1); 
    }

    setIgnoreDisplay(newIgnoreDisplay);
  }

  if (ignoreDisplay.length == 0) {
    return (<>
      <div className={`${styles.websiteList} ${styles.blankList}`}>
        No websites to ignore added
      </div>
    </>)
  }

  const listItems = ignoreDisplay.map(website =>
    (<WebsiteDisplay key={website} website={website} handleRemove={handleRemove} />)
  );

  return (<>
    <div className={styles.websiteList}>
      {listItems}
    </div>
  </>);
}

export default function OptionsPage() {
  const [ignoreDisplay, setIgnoreDisplay] = useState([]);
  

  function handleIgnoreButton() {
    if (isBlocking()) {
      alert('You cannot add websites to ignore while blocking is enabled!');
      return;
    }

    const ignoreInput = document.getElementById('ignoreInput');
    const websiteToIgnore = ignoreInput.value;

    if (!websiteToIgnore || websiteToIgnore.length <= 0 || ignoreDisplay.includes(websiteToIgnore)) {
      return;
    }

    //TODO: ACTUALLY SAVE THE WEBSITES THAT ARE ADDED
    
    setIgnoreDisplay(ignoreDisplay.concat(websiteToIgnore));

    ignoreInput.value = '';
  }

  /**********
  MAIN EXPORT
  **********/

  return (<><main className={styles.main}>
    <div>
      <h1><span className={styles.yellow}>RocketBlock</span> Settings</h1>
    </div>

    <div className={styles.content}>
      <h1>Ignore list</h1>

      <br />
      
      <div className={styles.inputWrapper}>
        <input id="ignoreInput" className={styles.inputBox} style={openSans.style} type="text" placeholder="Add a website to ignore" onKeyUp={(e) => {if(e.key == 'Enter'){handleIgnoreButton(e)}}}/>

        <PrimaryButton onClick={handleIgnoreButton}>Ignore</PrimaryButton>
      </div>

      <p>Notes:</p>
      <ul className={styles.ul}>
          <li>Leave on the http:// or https:// to block only that page</li>
          <li>Remove the http part to block the entire domain/website</li>
          <li>Use * as a placeholder/wildcard</li>
      </ul>

      <WebsiteList ignoreDisplay={ignoreDisplay} setIgnoreDisplay={setIgnoreDisplay} />
    </div>

    <div>
      <h1>Start blocking</h1>

      <h2>Block for <input type="number" style={openSans.style} className={styles.number} placeholder="hrs" /> : <input type="number" style={openSans.style} className={styles.number} placeholder="min" /> : <input type="number" style={openSans.style} className={styles.number} placeholder="sec" /></h2>
      
      <PrimaryButton className={styles.blockButton}>Start Blocking</PrimaryButton>

    </div>

  </main></>)
}