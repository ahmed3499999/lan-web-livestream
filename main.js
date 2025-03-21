import express from 'npm:express';
import { Monitor } from 'npm:node-screenshots';
import sharp from 'npm:sharp';
import { WebSocketServer } from 'npm:ws'
import fs from 'node:fs';

const app = express()
const wss = new WebSocketServer({ port: 7070 });
const port = 3000
const monitor = Monitor.fromPoint(0, 0);
const aspect = {x: 16, y: 9};
const resolution = 75;
const local_ip = "10.90.0.241"

const f = () => {
    let image = monitor.captureImageSync();
    sharp(image.toPngSync()).resize(aspect.x * resolution, aspect.y * resolution).toFile('img.png', (err, info) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN){
                client.send(fs.readFileSync('img.png', 'base64'));
            }
        });
        
        setTimeout(f, 1000/15);
    });
}

app.get('/', (req, res) => {
    let html = fs.readFileSync(import.meta.dirname +  './index.html', 'utf-8');
    html = html.replaceAll('ip_place', local_ip);
    res.send(html);
});

wss.on('connection', (ws) => {
    console.log("something connected");
    ws.on('error', console.error);
    ws.on('message', (data) => { console.log(data); } );
});

app.listen(port, () => { console.log("server started on http://localhost:3000/?fps=30");});
f();