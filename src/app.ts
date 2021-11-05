import express, {Application, Request, Response} from 'express'
import {Server} from "socket.io";
import path from "path";
import http from "http";

const app: Application = express()
const server = http.createServer(app);
const io = new Server(server);

const port: number = 3000
const abghaenktiUsersMap: any = {};
let amountButtonPresses = 0;

app.use(express.static(path.join(__dirname, 'frontend')));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('hets-abghaenkt', (message) => {
        let user = message['user'];
        console.log(`Am user "${user}" hets abghänkt`);
        if (abghaenktiUsersMap[user]) {
            clearTimeout(abghaenktiUsersMap[user])
        }
        amountButtonPresses++;
        setTimeout(() => {
            amountButtonPresses--;
            sendUpdateToClient();
        }, 40000)
        abghaenktiUsersMap[user] = setTimeout(() => {
            delete abghaenktiUsersMap[user];
            sendUpdateToClient();
        }, 40000);
        sendUpdateToClient();
    });
});

server.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

function sendUpdateToClient() {
    io.emit('liste-mit-allne-wos-abghaenkt-het', {
        users: Object.keys(abghaenktiUsersMap),
        amountButtonPresses: amountButtonPresses
    })
}