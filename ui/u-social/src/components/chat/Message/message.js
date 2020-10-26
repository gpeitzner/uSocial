import React from 'react'
import './message.css'

const Message = ({ message: { user, text }, name }) => {
    let isSentuser = false;
    const trimmedName = name.trim().toLowerCase()
    if (user === trimmedName) {
        isSentuser = true
    }

    return (
        isSentuser
            ? (
                <div className="MessagaContainer justifyEnd">
                    <p className="sentText pr-10"> {trimmedName} </p>
                    <div className="MessageBox backgroundBlue">
                        <p className="messageText colorWhite">{text}</p>
                    </div>
                </div>
            ) :
            (
                <div className="MessagaContainer justifyStart">
                    <div className="MessageBox backgroundLight">
                        <p className="messageText colorDark">{text}</p>
                    </div>                    
                    <p className="sentText pl-10"> {user} </p>
                </div>
            )
    )
}

export default Message;