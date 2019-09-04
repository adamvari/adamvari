const RELAY3 = D0;
const RELAY2 = D4;
const RELAY1 = D5;

// The last data that was POSTed to us
var postData = {};
var demoSteps = [
  [1, 0, 0, 1950],
  [0, 0, 0, 50],
  [0, 0, 1, 1950],
  [0, 0, 0, 50]
], currentStep = 0;

function demoMode() {
  if (postData.demo) {
    var step = demoSteps[currentStep];

    digitalWrite(RELAY1, !step[0]);
    digitalWrite(RELAY2, !step[1]);
    digitalWrite(RELAY3, !step[2]);

    currentStep ++;

    if (currentStep >= demoSteps.length) {
      currentStep = 0;
    }

    setTimeout(demoMode, step[3]);
  }
}

// This serves up the webpage itself
function sendPage(res) {
  // We're using ES6 Template Literals here to make the HTML easy to read.
  var d = `
<!DOCTYPE HTML>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>The Walking LED</title>
    <!-- Font -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap&subset=latin-ext" rel="stylesheet">
    <!-- CSS -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap&subset=latin-ext" rel="stylesheet">
    <!-- Favicon -->
    <link rel="shortcut icon" sizes="16x16 32x32" type="image/png" href="https://i.pinimg.com/originals/14/1d/a7/141da787999461d5937517d19710b9c6.jpg"/>

    <style type="text/css">
      html{height:100%}*{-webkit-box-sizing:border-box;box-sizing:border-box;font-family:Roboto,sans-serif}.container{height:100%;margin:0;background:#363636;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;padding:16px;margin:0}h3{text-align:center;font-size:26px;margin-bottom:12px;margin-top:0;color:#fff}.card{width:100%;max-width:300px;height:250px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;padding:16px 24px 16px 16px;border-radius:2px;background:#484848;-webkit-box-shadow:0 3px 6px rgba(0,0,0,.16),0 3px 6px rgba(0,0,0,.23);box-shadow:0 3px 6px rgba(0,0,0,.16),0 3px 6px rgba(0,0,0,.23)}.inner-wrapper{width:300px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-ms-flex-wrap:wrap;flex-wrap:wrap}.input-wrapper{width:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding-left:16px;margin:12px 0}.btn-wrapper{width:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-top:20px}label{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:#fff;font-size:16px;margin-left:8px}form{width:100%;height:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-ms-flex-wrap:wrap;flex-wrap:wrap;padding:0;margin:0}.btn{display:-webkit-box;display:-ms-flexbox;display:flex;cursor:pointer;padding:15px 32px;font-size:18px;font-weight:500;color:#fff;background-color:#673ab7;text-align:center;text-decoration:none;text-transform:uppercase;outline:0;border:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-radius:2px;-webkit-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out;-webkit-box-shadow:0 2px 5px 0 rgba(0,0,0,.225);box-shadow:0 2px 5px 0 rgba(0,0,0,.225)}.btn:hover{background-color:#7c52c8}
    </style>
  </head>
  <body class="container">
    <div class="inner-wrapper">
      <h3 class="title">The Walking LED</h3>
      <div class="card">
        <form action="#" method="post">
          <div class="boxes">
            <div class="input-wrapper">
              <input type="checkbox" id="led1" class="green" name="led1" value="1" ${postData.led1?"checked":""}>
              <label for="led1">The GREEN Lantern</label>
            </div>
            <div class="input-wrapper">
              <input type="checkbox" id="led2" class="red" name="led2" value="1" ${postData.led2?"checked":""}>
              <label for="led2">The RED Light District</label>
            </div>
            <div class="input-wrapper">
              <input type="checkbox" id="led3" class="walk" name="led3" value="1" ${postData.led3?"checked":""}>
              <label for="led3">WALK The Line</label>
            </div>
            <div class="input-wrapper">
              <input type="checkbox" id="demo" class="purple" name="demo" value="1" ${postData.demo?"checked":""}>
              <label for="demo">COMBO</label>
            </div>
            <div class="btn-wrapper">
              <button class="btn">Let it be!</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </body>
</html>`;
  res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length':d.length});
  res.end(d);
}

// This handles the HTTP request itself and serves up the webpage or a
// 404 not found page
function onPageRequest(req, res) {
  var a = url.parse(req.url, true);
  if (a.pathname=="/") {
    // handle the '/' (root) page...
    // If we had a POST, handle the data we're being given
    if (req.method=="POST" &&
        req.headers["Content-Type"]=="application/x-www-form-urlencoded")
      handlePOST(req, function() { sendPage(res); });
    else
      sendPage(res);
  } else {
    // Page not found - return 404
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("404: Page "+a.pathname+" not found");
  }
}

// This handles any received data from the POST request
function handlePOST(req, callback) {
  var data = "";
  req.on('data', function(d) { data += d; });
  req.on('end', function() {
    // All data received from the client, so handle the url encoded data we got
    // If we used 'close' then the HTTP request would have been closed and we
    // would be unable to send the result page.
    postData = {};
    data.split("&").forEach(function(el) {
      var els = el.split("=");
      postData[els[0]] = decodeURIComponent(els[1]);
    });
    // finally our data is in postData
    // console.log(postData);
    // do stuff with it!

    if (!postData.demo) {
      digitalWrite(RELAY1, !postData.led1);
      digitalWrite(RELAY2, !postData.led2);
      digitalWrite(RELAY3, !postData.led3);
    } else {
      currentStep = 0;
      demoMode();
    }
    // call our callback (to send the HTML result)
    callback();
  });
}

var wifi = require("Wifi"), connectTries = 0;

// This is called when we have an internet connection
function onConnected() {
  console.log("Connected!");
  wifi.getIP(function(err, ip) {
    console.log("Connect to http://"+ip.ip);
    require("http").createServer(onPageRequest).listen(80);
  });
}

wifi.on('connected', onConnected);

// Feltöltés után manuálisan futtatni
// save(); require('ESP8266').reboot()
