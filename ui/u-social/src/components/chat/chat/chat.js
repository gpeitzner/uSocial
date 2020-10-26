import React, { useState, useEffect } from 'react';
import queryString from 'query-string'
import io from 'socket.io-client'
import {
    Container
} from 'react-bootstrap'
import './chat.css'
import InfoBar from '../infoBar/infoBar';
import Input from '../input/input'
import Messages from '../messages/messages'

let socket;
const endPoint = 'http://localhost:3000'

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(endPoint);
        setName(name);
        setRoom(room);
        console.log(name, room)
        socket.emit('join', { name, room }, (error) => {
            if(error){
                alert(error)
            }
        });

        return () => {
            //disconnect even 
            socket.emit('disconnect')
            socket.off()
        }


    }, [endPoint, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages])

    //function for sending messages 
    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages)

    return (
        <Container id="chatOuterContainer">
            <Container id="chatInnerContainer">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </Container>
        </Container>
    )
}

export default Chat;