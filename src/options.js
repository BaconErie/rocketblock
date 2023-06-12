const useState = React.useState;
const useEffect = React.useEffect;

let debounce = false;

function getTimeFromSeconds(totalSeconds) {
  const hours = ( totalSeconds - (totalSeconds % 3600) ) / 3600;
  const minutes = ( ( totalSeconds - 3600 * hours ) - ( totalSeconds % 60 ) ) / 60;
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return [ hours, minutes, seconds ]
}

function PrimaryButton({ onClick, children, disabled }) {
  let overlay = disabled ? null : (<span className="overlay"></span>)

  return (<>
    <button onClick={onClick} className="button" disabled={disabled}>
      {overlay}
      {children}
    </button>
  </>)
}

function SurfaceButton({ onClick, children, className }) {
  const stylesToUse = className ? `surfaceButton ${className}` : "surfaceButton";

  return (<>

    <button onClick={onClick} className={stylesToUse}>
      <span className="surfaceOverlay"></span>
      {children}
    </button>
  </>)
}

function WebsiteDisplay({ website, handleRemove }) {

  return (<>
    <div className="mainDisplay">
      <SurfaceButton onClick={() => handleRemove(website)}>x</SurfaceButton>
      <span className="span">{website}</span>
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
      <div className="websiteList blankList">
        No websites to ignore added
      </div>
    </>)
  }

  const listItems = ignoreDisplay.map(website =>
    (<WebsiteDisplay key={website} website={website} handleRemove={handleRemove} />)
  );

  return (<>
    <div className="websiteList">
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

      //TODO: UH TELL THE BACKGROUND SCRIPT TO LIKE START THE TIMER

      alert('Blocking has started!')
    }
  }

  if (!isBlocking) {
    return (<>
      <div>
        <h1>Start blocking</h1>

        <h2>Block for <input id="hrs" type="number" className="number" placeholder="hrs" /> : <input id="min" type="number" className="number" placeholder="min" /> : <input id="sec" type="number" className="number" placeholder="sec" /></h2>
        
        <PrimaryButton className="number" onClick={handleStartBlocking}>Start Blocking</PrimaryButton>

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


function OptionsPage() {
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

  return (<><main className="main">
    <div>
      <h1><span className="yellow">RocketBlock</span> Settings</h1>
    </div>

    <div className="content">
      <h1>Ignore list</h1>

      <br />
      
      <div className="inputWrapper">
        <input id="ignoreInput" className="inputBox" type="text" placeholder={placeholder} onKeyUp={(e) => {if(e.key == 'Enter'){handleIgnoreButton(e)}}} disabled={disabled}/>

        <PrimaryButton onClick={handleIgnoreButton} disabled={disabled}>Ignore</PrimaryButton>
      </div>

      <p>Notes:</p>
      <ul className="ul">
          <li>Leave on the http:// or https:// to ignore only that page</li>
          <li>Remove the http part to ignore the entire domain/website</li>
          <li>Use * as a placeholder/wildcard</li>
      </ul>

      <WebsiteList ignoreDisplay={ignoreDisplay} setIgnoreDisplay={setIgnoreDisplay} isBlocking={isBlocking} />
    </div>

    <BlockingDiv isBlocking={isBlocking} setIsBlocking={setIsBlocking} setBlockTimeLeft={setBlockTimeLeft} blockTimeLeft={blockTimeLeft}  />

  </main></>)
}

const app = document.getElementById('app');
ReactDOM.render(<OptionsPage />, app);