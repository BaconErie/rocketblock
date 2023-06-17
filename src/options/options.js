import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import websiteDisplayStyles from './WebsiteDisplay.module.css';
import styles from './options.module.css';
import './global.css';

import PrimaryButton from './components/PrimaryButton/PrimaryButton';
import SurfaceButton from './components/SurfaceButton/SurfaceButton';

let debounce = false;

function getTimeFromSeconds(totalSeconds) {
  const hours = ( totalSeconds - (totalSeconds % 3600) ) / 3600;
  const minutes = ( ( totalSeconds - 3600 * hours ) - ( totalSeconds % 60 ) ) / 60;
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return [ hours, minutes, seconds ]
}

function WebsiteDisplay({ website, handleRemove }) {

  return (<>
    <div className={websiteDisplayStyles.WebsiteDisplay_mainDisplay}>
      <SurfaceButton onClick={() => handleRemove(website)}>x</SurfaceButton>
      <span className={websiteDisplayStyles.WebsiteDisplay_span}>{website}</span>
    </div>
  </>)
}

function WebsiteList({ ignoreDisplay, setIgnoreDisplay, isBlocking }) {

  function handleRemove(website) {
    

    if (isBlocking) {
      const reallyDelete = confirm(`Are you sure you want to remove ${website} from you ignore list? You won't be able to add it back until your block has ended!`); 

      if (!reallyDelete) {
        return;
      }
    }

    let newIgnoreDisplay = [...ignoreDisplay];
    const index = newIgnoreDisplay.indexOf(website);
    if (index > -1) { 
      newIgnoreDisplay.splice(index, 1); 
    }

    setIgnoreDisplay(newIgnoreDisplay);

    chrome.storage.local.set({'ignoreList': newIgnoreDisplay});
  }

  if (ignoreDisplay.length == 0) {
    return (<>
      <div className={`${styles.Options_websiteList} ${styles.Options_blankList}`}>
        No websites to ignore added
      </div>
    </>)
  }

  const listItems = ignoreDisplay.map(website =>
    (<WebsiteDisplay key={website} website={website} handleRemove={handleRemove} />)
  );

  return (<>
    <div className={styles.Options_websiteList}>
      {listItems}
    </div>
  </>);
}

function BlockingDiv({ isBlocking, setIsBlocking, blockTimeLeft, setBlockTimeLeft }) {

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
      setBlockTimeLeft(totalSeconds);
      setIsBlocking(true);

      chrome.storage.local.set({'endBlockTime': Date.now() + totalSeconds * 1000});
      chrome.storage.local.set({'isBlocking': true});

      alert('Blocking has started!')
    }
  }

  if (!isBlocking) {
    return (<>
      <div>
        <h1>Start blocking</h1>

        <h2>Block for <input id="hrs" type="number" className={styles.Options_number} placeholder="hrs" /> : <input id="min" type="number" className={styles.Options_number} placeholder="min" /> : <input id="sec" type="number" className={styles.Options_number} placeholder="sec" /></h2>
        
        <PrimaryButton className={styles.Options_number} onClick={handleStartBlocking}>Start Blocking</PrimaryButton>

      </div>
    </>)
  } else {
    let [ hours, minutes, seconds ] = getTimeFromSeconds(blockTimeLeft);

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
  const [ isBlocking, setIsBlocking ] = useState(false);
  const [ blockTimeLeft, setBlockTimeLeft ] = useState(0);
  const [ debounce, setDebounce ] = useState(false);

  useEffect(() => {
    if (!debounce) {
      // Set whether or not it is blocking
      chrome.storage.local.get(['isBlocking']).then((result) => {
        setIsBlocking(result.isBlocking);
      });

      // Set block time left
      chrome.storage.local.get(['endBlockTime']).then((result) => {
        setBlockTimeLeft( parseInt((result.endBlockTime - Date.now())/1000) )
      });

      // Set ignoreDisplay
      chrome.storage.local.get(['ignoreList']).then((result) => {
        setIgnoreDisplay(result.ignoreList ? result.ignoreList : []);
      });

      // Listen for changes to isBlocking and update accordingly
      chrome.storage.onChanged.addListener((changes, _) => {
        if ('isBlocking' in changes ) {
          setIsBlocking(changes.isBlocking.newValue);
        }
      });

      setInterval(() => {
        setBlockTimeLeft(blockTimeLeft => blockTimeLeft > 0 ? blockTimeLeft - 1 : 0);
      }, 1000);

      setDebounce(true);
    }
  });


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
    
    const newIgnoreDisplay = ignoreDisplay.concat(websiteToIgnore)

    setIgnoreDisplay(newIgnoreDisplay);

    chrome.storage.local.set({'ignoreList': newIgnoreDisplay});

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

  return (<><main className={styles.Options_main}>
    <div>
      <h1><span className={styles.Options_yellow}>RocketBlock</span> Settings</h1>
    </div>

    <div className={styles.Options_content}>
      <h1>Ignore list</h1>

      <br />
      
      <div className={styles.Options_inputWrapper}>
        <input id="ignoreInput" className={styles.Options_inputBox} type="text" placeholder={placeholder} onKeyUp={(e) => {if(e.key == 'Enter'){handleIgnoreButton(e)}}} disabled={disabled}/>

        <PrimaryButton onClick={handleIgnoreButton} disabled={disabled}>Ignore</PrimaryButton>
      </div>

      <p>Notes:</p>
      <ul className={styles.Options_ul}>
          <li>Leave on the http:// or https:// to ignore only that page</li>
          <li>Remove the http part to ignore the entire domain/website</li>
          <li>Use * as a placeholder/wildcard</li>
      </ul>

      <WebsiteList ignoreDisplay={ignoreDisplay} setIgnoreDisplay={setIgnoreDisplay} isBlocking={isBlocking} />
    </div>

    <BlockingDiv isBlocking={isBlocking} setIsBlocking={setIsBlocking} setBlockTimeLeft={setBlockTimeLeft} blockTimeLeft={blockTimeLeft}  />

  </main></>)
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<OptionsPage />)