# Artnet Weblight

Use your Browser as an Artnet lighting device!

It supports dimmer, red, green and blue channels as well as border, blur and images.

Start with `node weblight.js`.

Each virtual device has 10 channels. First device 0 starts at channel 1, second device 1 at channel 11...
50 devices possible on one universe (one instance of this application).

Images have 10 values starting at channel 6 for each and have to be numbered XX.filetype (e.g. 1.png). Image 0 is empty.
So you can use 25 images.



## More
Use `http://localhost:3000/0?debug` for debugging values.


### Todo
* Config-File
* circle radius
* color correction - adopt to physical devices
* show identifier (and debug info) via dmx - maybe on image channel
* web interface for selecting images / videos + maybe upload

