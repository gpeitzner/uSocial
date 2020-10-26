const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const socketio = require('socket.io')
const http = require('http')
const app = express()

//const { mongoose } = require('./config/database')
const server = http.createServer(app)   //required for socket.io
const io = socketio(server)
const { addUser, removeUser, getUser, getUserInRoom } = require('./controllers/users')
//settings
app.set('port', process.env.PORT || 3000);

//midleware
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); // direccion del servidor de angular 

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error)
        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` })
        socket.join(user.room)

        io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)})

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', { user: user.name, text: message })
        io.to(user.room).emit('roomData', { room: user.room, users: getUserInRoom(user.room) })
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left!!`})
        }
    })
})


//routes
app.use(require('./routes/user.routes'));

//cambie app por server para que funcionara el socket 
server.listen(app.get('port'), () => {
    console.log('app listen in port ' + app.get('port'));
});
