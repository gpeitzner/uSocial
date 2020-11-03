import React, { useState, useEffect } from 'react';
import queryString from 'query-string'
import io from 'socket.io-client'
import {
    Container,
    Row,
    Col,
    Image,
    Toast,
    Button
} from 'react-bootstrap'
import './chat.css'
import InfoBar from '../infoBar/infoBar';
import Input from '../input/input'
import Messages from '../messages/messages'
import Users from '../users/users';
import Graph from '../graphics/graph';
import axios from 'axios'
import { useCookies } from "react-cookie";

import { Line } from 'react-chartjs-2';

let socket;
const endPoint = 'http://18.223.239.112:3000'
const pathImage = require("../../../assets/chat.png");


const Chat = ({ location }) => {
    const [show, setShow] = useState(false);
    const [dataL, setDataL] = useState({})
    const [opcionesL, setOpcionesL] = useState({})
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
    
    const [cookies, setCookie, removeCookie] = useCookies(["account"]);
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
        res = await fetch(`${endPoint}/friend/knows/${cookies.account.user}`);
        //res = await fetch(endPoint);
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
            } else if (step === 5) {
                const msg2 = {
                    user: select.trim().toLowerCase(),
                    text: '¿ Pais ?'
                }
                setMessages([...messages, msg2])
                setMessage('')
            } else if (step === 6) {
                const msg2 = {
                    user: select.trim().toLowerCase(),
                    text: '¿ Rango de fechas ?'
                }
                setMessages([...messages, msg2])
                setMessage('')
            }

            if (step === 4) {
                const data = {
                    country: messBot[0],
                    start: messBot[1]
                }
                axios.post('https://ji6c7sasg0.execute-api.us-east-2.amazonaws.com/prod/country', data).then((res) => {
                    if (messBot[2] == 'confirmados') {
                        const msg2 = {
                            user: select.trim().toLowerCase(),
                            text: `${res.data.body[0].confirmed} confirmados en ${messBot[0]} el dia ${messBot[1]}.`
                        }
                        setMessages([...messages, msg2])
                        setMessage('')
                    } else if (messBot[2] == 'recuperados') {
                        const msg2 = {
                            user: select.trim().toLowerCase(),
                            text: `${res.data.body[0].recovered} confirmados en ${messBot[0]} el dia ${messBot[1]}.`
                        }
                        setMessages([...messages, msg2])
                        setMessage('')
                    } else if (messBot[2] == 'muertes') {
                        const msg2 = {
                            user: select.trim().toLowerCase(),
                            text: `${res.data.body[0].deaths} confirmados en ${messBot[0]} el dia ${messBot[1]}.`
                        }
                        setMessages([...messages, msg2])
                        setMessage('')
                    } else {
                        //todo
                        const msg2 = {
                            user: select.trim().toLowerCase(),
                            text: `${res.data.body[0].confirmed} confirmados, ${res.data.body[0].deaths} confirmados, 
                                    ${res.data.body[0].deaths} confirmados en ${messBot[0]} el dia ${messBot[1]}.`
                        }
                        setMessages([...messages, msg2])
                        setMessage('')
                    }
                    setMessBot([])
                    setBot(false)
                    setStep(0)
                }).catch((e) => {
                    console.log(e)
                })
            } else if (step == 7) {
                //grafica
                const dates = messBot[1].split('a')
                const data = {
                    country: messBot[0],
                    start: dates[0].trim(),
                    end: dates[1].trim()
                }
                axios.post('https://ji6c7sasg0.execute-api.us-east-2.amazonaws.com/prod/country', data).then((res) => {
                    let days = []
                    let deaths = []
                    let recovered = []
                    let confirmed = []
                    for (let index = 0; index < res.data.body.length; index++) {
                        days.push(res.data.body[index].date)
                        confirmed.push(res.data.body[index].confirmed)
                        deaths.push(res.data.body[index].deaths)
                        recovered.push(res.data.body[index].recovered)
                    }
                    setDataL({
                        labels: days,
                        datasets: [{
                            label: 'confirmed',
                            backgroundColor: 'rgba(0,255,0,0.2)',
                            borderColor: 'black',
                            borderWidth: 1,
                            hoverBorderColor: '#FF0000',
                            data: confirmed
                        }, {
                            label: 'deaths',
                            backgroundColor: 'rgba(0,255,255,255)',
                            borderColor: 'black',
                            borderWidth: 1,
                            hoverBorderColor: '#FF0000',
                            data: deaths
                        },
                        {
                            label: 'recovered',
                            backgroundColor: 'rgba(220,220,220,1)',
                            borderColor: 'black',
                            borderWidth: 1,
                            hoverBorderColor: '#FF0000',
                            data: recovered
                        }]
                    })
                    setOpcionesL({
                        maintainAspectRatio: false,
                        responsive: true
                    })

                    setShow(true)           ///activamos toast
                    setMessBot([])
                    setBot(false)
                    setStep(0)

                }).catch((e) => {
                    console.log(e)
                })
            }
        }
    }, [step])

    //function for sending messages  
    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim().toLowerCase() === "casos" || message.trim().toLowerCase() === "grafica de casos") {
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
                } else if (message.trim().toLowerCase() === "grafica de casos") {
                    const msg1 = {
                        user: name.trim().toLowerCase(),
                        text: message.trim().toLowerCase()
                    }
                    setMessages([...messages, msg1])
                    setMessage('')
                    setStep(5)          // de 5 en adelante sera para las graficas 
                } else {
                    const msg1 = {
                        user: name.trim().toLowerCase(),
                        text: message
                    }
                    setMessages([...messages, msg1])
                    setMessage('')
                    setMessBot([...messBot, message])
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
                    text: message
                }
                setMessages([...messages, msg1])
                setMessage('')
                setMessBot([...messBot, message])
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
                                {show
                                    ?
                                    (
                                        <div>
                                            <Button className="closeButton"
                                                onClick={(event) => setShow(false)}
                                            >Close</Button>
                                            <Container id="chatOuterContainer">
                                                <Line data={dataL} options={opcionesL} onClose={() => setShow(false)} show={show} delay={10000} autohide ></Line>
                                            </Container>
                                        </div>
                                    ) :
                                    (
                                        <Container id="chatInnerContainer">
                                            <InfoBar name={select} />
                                            <Messages messages={messages} name={name} />
                                            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                                        </Container>
                                    )
                                }
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