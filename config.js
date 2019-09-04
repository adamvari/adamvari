// Ezt akkor kell lefuttatni, ha betelt a cucc
reset(true);


// Ezt akkor kell manuálisan lefuttatni, ha változna a wifi neve / jelszava.
// 1) Először:
reset(true);
// 2) lefuttatni a kódot:
function tryConnect() {
  WIFI_NAME = "Fannet";
  WIFI_KEY = "Autotransfusio1";

  wifi = require("Wifi");
  wifi.connect(WIFI_NAME, { password : WIFI_KEY });
}

// 3) utána:
wifi.save();


// On init
function onInit() {
  wifi.stopAP();
  wifi.setConfig({powersave: 'none'});
}


// Comment this line out if you're planning on saving your code
onInit();





// function tryConnect() {
//   WIFI_NAME = "Fannet";
//   WIFI_KEY = "Autotransfusio1";
//
//   wifi = require("Wifi");
//   wifi.connect(WIFI_NAME, { password : WIFI_KEY }, function(err) {
//     if (err) {
//       console.log("Connection error: "+err);
//       connectTries ++;
//
//       if (connectTries < 5) {
//         setTimeout(tryConnect, 5000);
//       } else {
//         console.log("BRÜHÜHÜÜÜÜ");
//       }
//
//       return;
//     }
//   });
// }

// require("Storage").write(".boot0", `
//   WIFI_NAME = "Fannet";
//   WIFI_KEY = "Autotransfusio1";
// `);
//

/*
var demoSteps = [
  [1, 0, 0, 5000],
  [0, 0, 0, 100],
  [1, 0, 0, 100],
  [0, 0, 0, 100],
  [0, 0, 1, 5000],
  [0, 0, 0, 100],
  [0, 0, 1, 100],
  [0, 0, 0, 100],
], currentStep = 0;
*/
