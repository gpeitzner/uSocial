import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import {
    Container,
    Button
} from 'react-bootstrap';
import './join.css'

/*esta clase me servira para crear la sala de cada chat */
const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <Container>
            <Container>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}></input></div>
                <div><input placeholder="Room" className="joinInput" type="text" onChange={(event) => setRoom(event.target.value)}></input></div>
                {/*este link debo accionar cuando le de chat a una persona*/}
                <Link onClick={event => (!name || !room) ? event.preventDefault(): null} to={`/chat?name=${name}&room=${room}`}>
                    <Button variant="success"> Sign In </Button>
                </Link>
            </Container>
        </Container>
    )
}

export default Join;