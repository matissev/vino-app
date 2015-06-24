/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        deviceListScreen.hidden = true;                      
        unlockScreen.hidden = true;              
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.forms[0].addEventListener('submit', this.unlock, false);    
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        deviceList.ontouchstart = app.connect; // assume not scrolling        
        refreshButton.ontouchstart = app.list;
        disconnectButton.onclick = app.disconnect;

        app.list();
    },
    list: function(e) { 
        deviceList.innerHTML = ""; // clear the list 
        app.showProgressIndicator("Scanning for Bluetooth Devices...");        
        bluetoothSerial.list(app.onDeviceList, function() { alert("Listing Bluetooth Devices Failed"); });        
    },
    connect: function (e) {        
        var device = e.target.dataset.deviceId;
        app.showProgressIndicator("Requesting connection to " + device);
        bluetoothSerial.connect(device, app.onConnect, app.onDisconnect);                                    
    },
    disconnect: function (e) {
        if (e) {
            e.preventDefault();
        }

        app.setStatus("Disconnecting...");
        bluetoothSerial.disconnect(function() {
            app.setStatus("Disconnected");
            setTimeout(app.list, 800);
        });        
    },
    onConnect: function() {        
        app.showUnlockScreen();                
        app.setStatus("Connected");
        bluetoothSerial.subscribe("\n", app.onData);        
    },
    onDisconnect: function(reason) {
        if (!reason) { 
            reason = "Connection Lost"; 
        } 
        app.setStatus(reason);
        
        app.hideProgressIndicator();        
    },
    onData: function(data) {
        app.setStatus(data);
        app.hideProgressIndicator();        
    },
    unlock: function(e) {
        var code = e.target.code.value,
            command = "u" + code + "\n";

        e.preventDefault();

        if (code === "") { return; } // don't submit an empty form
        app.showProgressIndicator();      
                    
        function success() {
            e.target.code.value = ""; //  clear the input
        }
        
        function failure (reason) {
            alert("Error sending code " + reason);
            app.hideProgressIndicator();                          
        }
                
        bluetoothSerial.write(1, success, failure); 
    },    
    onDeviceList: function(devices) {
        var listItem, rssi;

        app.showDeviceListPage();
        
        devices.forEach(function(device) {
            console.log(JSON.stringify(device));
            listItem = document.createElement('li');
            listItem.dataset.deviceId = device.id;
            if (device.rssi) {
                rssi = "RSSI: " + device.rssi + "<br/>";
            } else {
                rssi = "";
            }
            listItem.innerHTML = device.name + "<br/>" + rssi + device.id;
            deviceList.appendChild(listItem);
        });

        if (devices.length === 0) {
            
            if (cordova.platformId === "ios") { // BLE
                app.setStatus("No Bluetooth Peripherals Discovered.");
            } else { // Android
                app.setStatus("Please Pair a Bluetooth Device.");
            }

        } else {
            app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
        }
    },
    showProgressIndicator: function(message) {
        if (!message) { message = "Processing"; }
        scrim.firstElementChild.innerHTML = message;        
        scrim.hidden = false;
        statusDiv.innerHTML = "";        
    },
    hideProgressIndicator: function() {
        scrim.hidden = true;        
    },    
    showUnlockScreen: function() {
        unlockScreen.hidden = false;
        deviceListScreen.hidden = true;
        app.hideProgressIndicator();
        statusDiv.innerHTML = "";
    },
    showDeviceListPage: function() {
        unlockScreen.hidden = true;
        deviceListScreen.hidden = false;
        app.hideProgressIndicator();
        statusDiv.innerHTML = "";
    },
    setStatus: function(message){
        console.log(message);
        statusDiv.innerHTML = message;
    }
    
};

app.initialize();