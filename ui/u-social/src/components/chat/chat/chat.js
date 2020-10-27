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
    const [select, setSelect] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [messBot, setMessBot] = useState([]);
    const [bot, setBot] = useState(false)
    const [step, setStep] = useState(0)
    const [users, setUsers] = useState([]);
    const [initChat, setInitChat] = useState(true);
    useEffect(() => {
        //console.log(location)
        if (location.search != "") {
            setInitChat(true)
            const { name, room, select } = queryString.parse(location.search);

            socket = io(endPoint);
            setName(name);
            setRoom(room);
            setSelect(select)
            //console.log(name, room)
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


    useEffect(() => {
        console.log(JSON.stringify(messages))
        if (messages.length > 0 && bot) {
            if (step === 1) {
                const msg2 = {
                    user: select.trim().toLowerCase(),
                    text: '¿ Pais ?'
                }
                setMessages([...messages, msg2])
                setMessage('')
            } else if (step === 2 && messages[messages.length - 1].text !== "¿ Pais ?") {
                const msg2 = {
                    user: select.trim().toLowerCase(),
                    text: '¿ Fecha ?'
                }
                setMessages([...messages, msg2])
                setMessage('')
            } else if (step === 3 && messages[messages.length - 1].text !== "¿ Fecha ?") {
                const msg2 = {
                    user: select.trim().toLowerCase(),
                    text: 'Tipo de casos (confirmados, recuperados, muertes o todos)'
                }
                setMessages([...messages, msg2])
                setMessage('')
            }

            if (step === 4) {
                setStep(0)
                setBot(false)
                console.log("peticion covid")
            }
        }
    }, [step])

    //function for sending messages  
    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim().toLowerCase() === "casos") {
            //verifico si esta en modo bot o no 
            var found = users.find(function (element) {
                return element.user == select;
            });

            if (JSON.stringify(found.modeBot) == 'true') {          //escribio casos pero el usuario debe estar en modo bot si no lo tomara como un comentario mas 
                setBot(true)
                if (message.trim().toLowerCase() === "casos") {
                    const msg1 = {
                        user: name.trim().toLowerCase(),
                        text: message.trim().toLowerCase()
                    }
                    setMessages([...messages, msg1])
                    setMessage('')
                    setStep(1)
                } else {
                    const msg1 = {
                        user: name.trim().toLowerCase(),
                        text: message.trim().toLowerCase()
                    }
                    setMessages([...messages, msg1])
                    setMessage('')
                    setStep(step + 1)
                }
            } else {
                socket.emit('sendMessage', message, select, () => setMessage(''))
            }
        }
        else {
            if (bot) {  //esta en modo bot osea que se encuentra respondiendo las preguntas 
                const msg1 = {
                    user: name.trim().toLowerCase(),
                    text: message.trim().toLowerCase()
                }
                setMessages([...messages, msg1])
                setMessage('')
                setStep(step + 1)

            } else {
                socket.emit('sendMessage', message, select, () => setMessage(''))
            }
        }
    }

    //console.log(message, messages)
    return (
        <Container id="chatCompleted">
            <Row>
                <Col>
                    <Container id="chatUsersContainer">
                        <Users users={users} />
                    </Container>
                </Col>

                {initChat
                    ?
                    (
                        <Col>
                            <Container id="chatOuterContainer">
                                <Container id="chatInnerContainer">
                                    <InfoBar name={select} />
                                    <Messages messages={messages} name={name} />
                                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                                </Container>
                            </Container>
                        </Col>
                    )
                    :
                    (
                        <Col>
                            <Container id="chatOuterContainer">
                                <Image src={pathImage} roundedCircle />
                            </Container>
                        </Col>
                    )}
            </Row>
        </Container>
    )
}

export default Chat;