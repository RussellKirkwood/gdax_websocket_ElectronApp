const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const https = require("https");
const fetch = require("node-fetch");
const apiURL1 = "https://aaa.com";
const Gdax = require('gdax');


//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// publicClient.getProductTrades((error, response, data) => {
//     if (error) {
//       // handle the error
//       console.log(error);
//     } else {
//       // work with data
//       //console.log(data);
//       //data = JSON.parse(data); // 
//        for(var item of data) {
//          //console.log(item.time + ' ' + item.price + ' ' + item.size + ' ' + item.side);
//       }       
        
//     }
//   });
  
  
  


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 800})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

var apiStatus = "Start";

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

const ipcMain = require('electron').ipcMain;
ipcMain.on('asynchronous-message', function(event, arg) {
  // console.log(apiStatus)  ;
  
  event.sender.send('asynchronous-reply', apiStatus );
});

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

console.log("test");

// This function does API Call
// function callToAPI() {
//         apiStatus = new Date() + ' Calling API';   

//         // Do first call to API
//         fetch(apiURL1, {method: "POST"})        
//         .then(response => {
//           response.json().then(json => {
//             apiStatus = Date() + ' Result: ' + JSON.stringify(json)  ;
//             console.log(apiStatus);
//           });
//         })
//         .catch(error => {
//           apiStatus = error;
//           // console.log(error);
//         });        
// }

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const publicClient = new Gdax.PublicClient("LTC-USD");
const websocket = new Gdax.WebsocketClient(['LTC-USD']);

websocket.on('message', data => { 
  
    win.webContents.send('message', data.price);

  //win.webContents.send('store-data', data.price);
  //console.log(data.price + ' ' + data.side);
  /* work with data */ });
websocket.on('error', err => { 
  console.log(err);
  /* handle error */ });
websocket.on('close', () => { /* ... */ });

// This function calls calltoapi and when done calls it again after 10 seconds
function executeCallToAPI(){
    setInterval(function(){
        //callToAPI()
    }, 10000);   
}

// this starts the execute which will always loop
//executeCallToAPI();

  // This tells function to repeat every 1 second
  // var myVar = setInterval(myTimedCalltoAPI, 1000);

// ipcMain.on('synchronous-message', function(event, arg) {
//   console.log(arg);  // prints "ping"
//   event.returnValue = 'Calling API';
// });


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})