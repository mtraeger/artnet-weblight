#!/usr/bin/env node
"use strict";

// const artnet = require('artnet-node').Server;
const artnet = require('./lib/artnet_server'); // NPM-Version of artnet-lib is buggy...
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const glob = require("glob");


const config = {};
config.artnet = {};
config.artnet.port = 6454;
config.artnet.universe = 0;


const buffer = new Array(512).fill(0); //TODO maybe node buffer?


http.listen(3000, function () {
    console.log('Web listening on *:3000');
});


console.log("Starting Artnet server on port " + config.artnet.port)
const srv = artnet.listen(config.artnet.port, function (msg, peer) {
    // console.log("-----------------");
    // console.log("From: " + peer.address);
    // console.log("Sequence: " + msg.sequence);
    // console.log("Physical: " + msg.physical);
    // console.log("Universe: " + msg.universe);
    // console.log("Length: " + msg.length);
    // console.log("Data: " + msg.data);
    // console.log("-----------------");

    if (msg.universe !== config.artnet.universe) {
        console.log("Wrong Universe, aborting msg processing.");
        return;
    }

    new Array(msg.data.length)
        .fill(0)
        .map(function (val, index) {
            const value = msg.data[index]; //TODO msg.data.readUInt8(i); | buf.readUInt8(index);

            if (buffer[index] === value) {
                return;
            }

            buffer[index] = value;

            let deviceId = ((index - 5) / 10).toFixed(0);
            if (deviceId < 1) deviceId = 0;
            updateClient(deviceId);
        });
});


app.get('/js/jquery.js', function (req, res) {
    res.sendFile(__dirname + '/js/jquery.js')
});

app.get('/css/style.css', function (req, res) {
    res.sendFile(__dirname + '/css/style.css')
});

app.use('/images', express.static("images"));

app.get('/frames', function (req, res) {
    res.sendFile(__dirname + '/frames.html')
});

app.get('/frames/:id', function (req, res) {
    res.sendFile(__dirname + '/frames.html')
});

app.get('/', function (req, res) {
    // Overview Page
    const channels = buffer
        .map((value, index) => {
            const tmp = {};
            tmp[index] = value;
            return tmp
        })
        .filter((channel, index) => channel[index] > 0)
        .map(channels => Object.keys(channels)[0])
        .map(channel => ((channel - 5) / 10).toFixed(0))
        .map(channel => {
            if (channel < 1) {
                return 0
            }
            return channel
        });

    const channelSet = new Set(channels);

    let text = "<h1>Artnet Weblight</h1>";
    text += "Devices with channel values > 0:";
    text += "<ul>";
    channelSet.forEach(device => {
        text += "<li><a href='/" + device + "'>Device " + device + "</a> (<a href='/" + device + "?debug'>Debug</a>)"
    });
    text += "</ul><br>";
    text += "<a href='/frames'>Frames Debug</a>";
    res.send(text);
});

app.get('/:id', function (req, res) {
    const channelId = req.params.id * 10;
    const channel = channelId + 1;

    if (channel + 10 > 512) {
        res.sendStatus(416);
        return;
    }

    res.sendFile(__dirname + '/index.html');

    updateClient(req.params.id);
});


io.on('connection', function (socket) {
    updateAllClients();
});


let imageFiles = [];
glob("images/*", {}, function (er, files) {
    imageFiles = files;
});


function updateClient(deviceId) {
    const deviceNr = deviceId * 10;

    const imageNumber = (buffer[deviceNr + 6] / 10).toFixed(0);
    let imagePath = imageFiles[parseInt(imageNumber) - 1]; //TODO improve via name matching
    if (!imagePath) imagePath = "none";

    io.sockets.emit('dev' + deviceId, {
        r: buffer[deviceNr + 1],
        g: buffer[deviceNr + 2],
        b: buffer[deviceNr + 3],
        a: (buffer[deviceNr + 0] / 255).toFixed(3),
        border: buffer[deviceNr + 4],
        blur: buffer[deviceNr + 5],
        image: imagePath
    });
}


function updateAllClients() {
    for (let i = 0; i <= 50; i++) {
        updateClient(i);
    }
}
