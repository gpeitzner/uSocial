import React, { useState } from 'react'
import {
    Button
} from 'react-bootstrap'
import './input.css'

const Input = ({ message, setMessage, sendMessage }) => (
    <form className="form">
        <input
            className="input"
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
        />
        <Button className="sendButton"
            onClick={(event) => sendMessage(event)}
        >SEND</Button>
    </form>
)

export default Input;