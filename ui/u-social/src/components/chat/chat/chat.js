import React, { useState, useEffect } from 'react';
import queryString from 'query-string'
import io from 'socket.io-client'
import {
    Container,
    Row,
    Col,
    Image
} from 'react-bootstrap'
import './chat.css'
import InfoBar from '../infoBar/infoBar';
import Input from '../input/input'
import Messages from '../messages/messages'
import Users from '../users/users';

let socket;
const endPoint = 'http://localhost:3000'
const pathImage = require("../../../assets/chat.png");

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [initChat, setInitChat] = useState(true);
    useEffect(() => {
        console.log(location)
        if (location.search != "") {
            setInitChat(true)
            const { name, room } = queryString.parse(location.search);

            socket = io(endPoint);
            setName(name);
            setRoom(room);
            console.log(name, room)
            socket.emit('join', { name, room }, (error) => {
                if (error) {
                    alert(error)
                }
            });

            return () => {
                //disconnect even 
                socket.emit('disconnect')
                socket.off()
            }
        } else {
            setInitChat(false)
        }

    }, [endPoint, location.search])

    useEffect(async () => {
        let res = ''
        res = await fetch(endPoint);
        res
            .json()
            .then((res) => {
                setUsers(res)
                console.log(res)
            })
            .catch(err => console.log('cargando usuarios....'));
    }, []);

    useEffect(() => {
        if (location.search != "") {
            setInitChat(true)
            socket.on('message', (message) => {
                setMessages([...messages, message])
            })
            //window.location.reload(false); 
        } else {
            setInitChat(false)
        }
    }, [messages])

    //function for sending messages  
    const sendMessage = (event) => {
        event.preventDefault();
        console.log("message is: " + message)
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages)

    if (initChat) {
        return (
            <Container id="chatCompleted">
                <Row>
                    <Col>
                        <Container id="chatUsersContainer">
                            <Users users={users} />
                        </Container>
                    </Col>
                    <Col>
                        <Container id="chatOuterContainer">
                            <Container id="chatInnerContainer">
                                <InfoBar name={name} />
                                <Messages messages={messages} name={name} />
                                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                            </Container>
                        </Container>
                    </Col>
                </Row>
            </Container>
        )
    } else {
        return (
            <Container id="chatCompleted">
                <Row>
                    <Col>
                        <Container id="chatUsersContainer">
                            <Users users={users} />
                        </Container>
                    </Col>
                    <Col>
                        <Container id="chatOuterContainer">
                            <Image src={pathImage} roundedCircle />
                        </Container>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Chat;