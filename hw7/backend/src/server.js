import http from 'http'
import express from 'express';
import mongoose from 'mongoose';
import WebSocket from 'ws';
import mongo from './mongo'
import wsConnect from './wsConnect'

mongo.connect();

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const db = mongoose.connection


db.once('open', () => {
  console.log("MongoDB connected!");
  wss.on('connection', (ws) => {
    console.log("ws connected")
    ws.box = '';
    ws.onmessage = wsConnect.onMessage(wss, ws) });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {console.log(`Server is up on port ${PORT}!`)});