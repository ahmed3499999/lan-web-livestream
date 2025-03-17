import express from 'npm:express';
import fs from 'node:fs';
import { Monitor } from 'npm:node-screenshots';
import sharp from 'npm:sharp';


const app = express()
const port = 3000
const monitor = Monitor.fromPoint(0, 0);
const aspect = {x: 16, y: 9};
const resolution = 50;

const f = () => {
    let image = monitor.captureImageSync();
    sharp(image.toPngSync()).resize(aspect.x * resolution, aspect.y * resolution).toFile('img.png', (err, info) => {
        setTimeout(f, 1000/30);
    });
}

f();

app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(import.meta.dirname +  './index.html');
});

app.get('/img.png', (req, res) => { res.sendFile(import.meta.dirname + './img.png')});

app.listen(port, () => { console.log("server started on http://localhost:3000/?fps=30");});
