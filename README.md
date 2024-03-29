[![NPM](https://nodei.co/npm/artnet-weblight.png?compact=true)](https://npmjs.org/package/artnet-weblight)

# Artnet Weblight

Use your Browser as an Artnet lighting device!

It supports dimmer, red, green and blue channels as well as border, blur and images.

Installation: `npm install -g artnet-weblight` Start: `weblight`

Start from source with `node weblight.js`. 
Webinterface will be available at `localhost:3000`. It uses standard Artnet port `6454`.


## Devices

Each virtual device has 10 channels. First device 0 starts at channel 1, second device 1 at channel 11 and so on...

50 devices are possible on one universe (one instance of this application).

Access devices via `address:port/device#`, e.g. `localhost:3000/0`.

### Images
The images can be placed in `/images`. Every image has 10 dmx-values where it is visible.
The images can/should be numbered XX.filetype (e.g. 1.png) for preserving correct order.

Image 0 is empty. So you can use 25 images. Images are channel 6.


### Channels
1. Dimmer
2. Red
3. Green
4. Blue
5. Border size
6. Blur (for Border)
7. Image overlay


## More

### Debugging Artnet
Use `http://localhost:3000/0?debug` for debugging values.

### Frame View
Use `http://localhost:3000/frames` to see the first four devices on one page with debug info enabled.

Configure Frame view with params `count` (default 4) and `debug` (default true). Starting device can be varied by using another frame-id, e.g. `/frames/10`.

Example: `http://localhost:3000/frames/10?count=5&debug=false`


### Testing
For Testing you can use https://github.com/mtraeger/dmx-webcontrol and configure a (separate) universe like this:
```
"monitor": {
    "output": {
        "driver": "artnet",
        "device": "localhost"
    },
    "devices": [
        {
            "label": "Monitor 1",
            "type": "artnet-weblight",
            "address": 1
        },
        {
            "label": "Monitor 2",
            "type": "artnet-weblight",
            "address": 11
        },
        {
            "label": "Monitor 3",
            "type": "artnet-weblight",
            "address": 21
        }
    ]
}
```

### Notes

Some sort of color correction can be done by using the dimmer channel to reduce the overall brightness of the rgb channels. Dimming down to e.g. 80% can bring the monitor colors more towards your physical devices.


### Todo
* Config-File
* circle radius
* color correction - adopt to physical devices (e.g. by predefined dimmer factor to reduce collor brilliance)
* show identifier (and debug info) via dmx - maybe on image channel
* web interface for selecting images / videos + maybe upload

