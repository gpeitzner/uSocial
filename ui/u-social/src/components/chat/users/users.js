import React from 'react'

import ScrollToBottom from 'react-scroll-to-bottom'
import User from './user/user';
import {
    Container,
    ListGroup
} from 'react-bootstrap'
import './users.css'

const Users = ({ users }) => (
    <ListGroup>
        <ScrollToBottom className="users">
            <Container className="usersOnLine">
                <h3>Users on line</h3>
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8" />
                </svg>
            </Container>
            {users.map((user, i) => <div key={i}><User user={user} /></div>)}
        </ScrollToBottom>
    </ListGroup>
)

export default Users;