const useState = React.useState;
const useEffect = React.useEffect;
let debounce = false;
function getTimeFromSeconds(totalSeconds) {
  const hours = (totalSeconds - totalSeconds % 3600) / 3600;
  const minutes = (totalSeconds - 3600 * hours - totalSeconds % 60) / 60;
  const seconds = totalSeconds - hours * 3600 - minutes * 60;
  return [hours, minutes, seconds];
}
function PrimaryButton({
  onClick,
  children,
  disabled
}) {
  let overlay = disabled ? null : /*#__PURE__*/React.createElement("span", {
    className: "overlay"
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: "button",
    disabled: disabled
  }, overlay, children));
}
function SurfaceButton({
  onClick,
  children,
  className
}) {
  const stylesToUse = className ? `surfaceButton ${className}` : "surfaceButton";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: stylesToUse
  }, /*#__PURE__*/React.createElement("span", {
    className: "surfaceOverlay"
  }), children));
}
function WebsiteDisplay({
  website,
  handleRemove
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mainDisplay"
  }, /*#__PURE__*/React.createElement(SurfaceButton, {
    onClick: () => handleRemove(website)
  }, "x"), /*#__PURE__*/React.createElement("span", {
    className: "span"
  }, website)));
}
function WebsiteList({
  ignoreDisplay,
  setIgnoreDisplay,
  isBlocking
}) {
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
    chrome.storage.local.set({
      'ignoreList': newIgnoreDisplay
    });
  }
  if (ignoreDisplay.length == 0) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "websiteList blankList"
    }, "No websites to ignore added"));
  }
  const listItems = ignoreDisplay.map(website => /*#__PURE__*/React.createElement(WebsiteDisplay, {
    key: website,
    website: website,
    handleRemove: handleRemove
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "websiteList"
  }, listItems));
}
function BlockingDiv({
  isBlocking,
  setIsBlocking,
  blockTimeLeft,
  setBlockTimeLeft
}) {
  function handleStartBlocking() {
    if (isBlocking) {
      alert('Already blocking!');
      return;
    }
    const hourInput = isNaN(document.getElementById('hrs').value) || document.getElementById('hrs').value == '' ? 0 : parseInt(document.getElementById('hrs').value);
    const minuteInput = isNaN(document.getElementById('min').value) || document.getElementById('min').value == '' ? 0 : parseInt(document.getElementById('min').value);
    const secondInput = isNaN(document.getElementById('sec').value) || document.getElementById('sec').value == '' ? 0 : parseInt(document.getElementById('sec').value);
    const totalSeconds = hourInput * 3600 + minuteInput * 60 + secondInput;
    const hours = (totalSeconds - totalSeconds % 3600) / 3600;
    const minutes = (totalSeconds - 3600 * hours - totalSeconds % 60) / 60;
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
      chrome.storage.local.set({
        'endBlockTime': Date.now() + totalSeconds * 1000
      });
      chrome.storage.local.set({
        'isBlocking': true
      });

      //TODO: UH TELL THE BACKGROUND SCRIPT TO LIKE START THE TIMER

      alert('Blocking has started!');
    }
  }
  if (!isBlocking) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Start blocking"), /*#__PURE__*/React.createElement("h2", null, "Block for ", /*#__PURE__*/React.createElement("input", {
      id: "hrs",
      type: "number",
      className: "number",
      placeholder: "hrs"
    }), " : ", /*#__PURE__*/React.createElement("input", {
      id: "min",
      type: "number",
      className: "number",
      placeholder: "min"
    }), " : ", /*#__PURE__*/React.createElement("input", {
      id: "sec",
      type: "number",
      className: "number",
      placeholder: "sec"
    })), /*#__PURE__*/React.createElement(PrimaryButton, {
      className: "number",
      onClick: handleStartBlocking
    }, "Start Blocking")));
  } else {
    let [hours, minutes, seconds] = getTimeFromSeconds(blockTimeLeft);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Start blocking"), /*#__PURE__*/React.createElement("h2", null, "Blocking is in progress"), /*#__PURE__*/React.createElement("p", null, "Blocking ends in ", hours, " hours, ", minutes, " minutes, and ", seconds, " seconds. ")));
  }
}
function OptionsPage() {
  const [ignoreDisplay, setIgnoreDisplay] = useState([]);
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [debounce, setDebounce] = useState(false);
  useEffect(() => {
    if (!debounce) {
      // Set whether or not it is blocking
      chrome.storage.local.get(['isBlocking']).then(result => {
        setIsBlocking(result.isBlocking);
      });

      // Set block time left
      chrome.storage.local.get(['endBlockTime']).then(result => {
        setBlockTimeLeft(parseInt((result.endBlockTime - Date.now()) / 1000));
      });

      // Set ignoreDisplay
      chrome.storage.local.get(['ignoreList']).then(result => {
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
    const newIgnoreDisplay = ignoreDisplay.concat(websiteToIgnore);
    setIgnoreDisplay(newIgnoreDisplay);
    chrome.storage.local.set({
      'ignoreList': newIgnoreDisplay
    });
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("main", {
    className: "main"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement("span", {
    className: "yellow"
  }, "RocketBlock"), " Settings")), /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("h1", null, "Ignore list"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
    className: "inputWrapper"
  }, /*#__PURE__*/React.createElement("input", {
    id: "ignoreInput",
    className: "inputBox",
    type: "text",
    placeholder: placeholder,
    onKeyUp: e => {
      if (e.key == 'Enter') {
        handleIgnoreButton(e);
      }
    },
    disabled: disabled
  }), /*#__PURE__*/React.createElement(PrimaryButton, {
    onClick: handleIgnoreButton,
    disabled: disabled
  }, "Ignore")), /*#__PURE__*/React.createElement("p", null, "Notes:"), /*#__PURE__*/React.createElement("ul", {
    className: "ul"
  }, /*#__PURE__*/React.createElement("li", null, "Leave on the http:// or https:// to ignore only that page"), /*#__PURE__*/React.createElement("li", null, "Remove the http part to ignore the entire domain/website"), /*#__PURE__*/React.createElement("li", null, "Use * as a placeholder/wildcard")), /*#__PURE__*/React.createElement(WebsiteList, {
    ignoreDisplay: ignoreDisplay,
    setIgnoreDisplay: setIgnoreDisplay,
    isBlocking: isBlocking
  })), /*#__PURE__*/React.createElement(BlockingDiv, {
    isBlocking: isBlocking,
    setIsBlocking: setIsBlocking,
    setBlockTimeLeft: setBlockTimeLeft,
    blockTimeLeft: blockTimeLeft
  })));
}
const app = document.getElementById('app');
ReactDOM.render( /*#__PURE__*/React.createElement(OptionsPage, null), app);