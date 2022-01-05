import React from 'react'
import ReactDOM from 'react-dom'
import App from './views/Popup/App'



chrome.runtime.sendMessage({greeting: "hello"}, function(response: any) {
  console.log(response.farewell);
});  


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); 
