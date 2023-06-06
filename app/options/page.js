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

function getTimeFromSeconds(totalSeconds) {
  const hours = ( totalSeconds - (totalSeconds % 3600) ) / 3600;
  const minutes = ( ( totalSeconds - 3600 * hours ) - ( totalSeconds % 60 ) ) / 60;
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return [ hours, minutes, seconds ]
}

function WebsiteList({ ignoreDisplay, setIgnoreDisplay, isBlocking }) {

  function handleRemove(website) {
    

    if (isBlocking) {
      const reallyDelete = confirm(`Are you sure you want to remove ${website} from you ignore list? You won't be able to add it back until your block has ended!`); 

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

function BlockingDiv({ isBlocking, setIsBlocking,  }) {
  function handleStartBlocking() {
    if (isBlocking) {
      alert('Already blocking!');
      return;
    }

    const hourInput = isNaN(document.getElementById('hrs').value) || document.getElementById('hrs').value == '' ? 0 : parseInt(document.getElementById('hrs').value);
    const minuteInput = isNaN(document.getElementById('min').value) || document.getElementById('min').value == '' ? 0 : parseInt(document.getElementById('min').value);
    const secondInput = isNaN(document.getElementById('sec').value) || document.getElementById('sec').value == '' ? 0 : parseInt(document.getElementById('sec').value);

    const totalSeconds = hourInput * 3600 + minuteInput * 60 + secondInput;
    const hours = ( totalSeconds - (totalSeconds % 3600) ) / 3600;
    const minutes = ( ( totalSeconds - 3600 * hours ) - ( totalSeconds % 60 ) ) / 60;
    const seconds = totalSeconds - hours * 3600 - minutes * 60;

    if (totalSeconds > 86400) {
      alert(`You cannot block for more than 24 hours!\n(Currently setting to block for ${hours} hours, ${minutes} minutes, and ${seconds} seconds.)`);
      return;
    }

    if (totalSeconds <= 0) {
      return;
    }

    const reallyBlock = confirm(`Begin blocking for ${hours} hours, ${minutes} minutes, and ${seconds} seconds?\nYou won't be able to access any page EXCEPT for those on the ignore list, and you won't be able to add anything to the ignore list!`);

    if (reallyBlock) {
      //TODO: ACTUALLY START BLOCKING
      setIsBlocking(true);
      alert('Blocking has started!')
    }
  }


  if (!isBlocking) {
    return (<>
      <div>
        <h1>Start blocking</h1>

        <h2>Block for <input id="hrs" type="number" style={openSans.style} className={styles.number} placeholder="hrs" /> : <input id="min" type="number" style={openSans.style} className={styles.number} placeholder="min" /> : <input id="sec" type="number" style={openSans.style} className={styles.number} placeholder="sec" /></h2>
        
        <PrimaryButton className={styles.blockButton} onClick={handleStartBlocking}>Start Blocking</PrimaryButton>

      </div>
    </>)
  } else {
    let [ hours, minutes, seconds ] = getTimeFromSeconds(69420)

    return (<>
      <div>
        <h1>Start blocking</h1>

        <h2>Blocking is in progress</h2>

        <p>Blocking ends in {hours} hours, {minutes} minutes, and {seconds} seconds. </p>

      </div>
    </>)
  }
}

export default function OptionsPage() {
  const [ignoreDisplay, setIgnoreDisplay] = useState([]);
  const [ isBlocking, setIsBlocking ] = useState(false); //TODO: SET THE ACTUAL STATE BEFORE LOOAD

  function handleIgnoreButton() {
    if (isBlocking) {
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

  let placeholder;
  let disabled;

  if (isBlocking) {
    placeholder = 'You cannot add websites to ignore while blocking is enabled!';
    disabled = true;
  } else {
    disabled = false; 
    placeholder = 'Add a website to ignore';
  }

  return (<><main className={styles.main}>
    <div>
      <h1><span className={styles.yellow}>RocketBlock</span> Settings</h1>
    </div>

    <div className={styles.content}>
      <h1>Ignore list</h1>

      <br />
      
      <div className={styles.inputWrapper}>
        <input id="ignoreInput" className={styles.inputBox} style={openSans.style} type="text" placeholder={placeholder} onKeyUp={(e) => {if(e.key == 'Enter'){handleIgnoreButton(e)}}} disabled={disabled}/>

        <PrimaryButton onClick={handleIgnoreButton} disabled={disabled}>Ignore</PrimaryButton>
      </div>

      <p>Notes:</p>
      <ul className={styles.ul}>
          <li>Leave on the http:// or https:// to block only that page</li>
          <li>Remove the http part to block the entire domain/website</li>
          <li>Use * as a placeholder/wildcard</li>
      </ul>

      <WebsiteList ignoreDisplay={ignoreDisplay} setIgnoreDisplay={setIgnoreDisplay} isBlocking={isBlocking} />
    </div>

    <BlockingDiv isBlocking={isBlocking} setIsBlocking={setIsBlocking} />

  </main></>)
}