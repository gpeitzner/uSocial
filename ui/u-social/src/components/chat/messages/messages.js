import React, { useState } from 'react'
import {
    Button
} from 'react-bootstrap'
import ScrollToBottom from 'react-scroll-to-bottom'
import Message from '../Message/message'
import './messages.css'

const Mesagges = ({ messages, name }) => (
    <ScrollToBottom className="messages">
        {messages.map((message, i) => <div key={i}><Message message={message} name={name} /></div>)}
    </ScrollToBottom>
)

export default Mesagges;