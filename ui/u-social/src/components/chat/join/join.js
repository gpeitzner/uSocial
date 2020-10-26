import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import {
    Container,
    Button
} from 'react-bootstrap';
import './join.css'
const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <Container className="joinOuterContainer">
            <Container className="joinInnerContainer">
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}></input></div>
                <div><input placeholder="Room" className="joinInput" type="text" onChange={(event) => setRoom(event.target.value)}></input></div>
                <Link onClick={event => (!name || !room) ? event.preventDefault(): null} to={`/chat?name=${name}&room=${room}`}>
                    <Button variant="success"> Sign In </Button>
                </Link>
            </Container>
        </Container>
    )
}

export default Join;