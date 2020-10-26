import React from 'react'
import './user.css'
import {
    ListGroupItem,
    Image
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

const User = ({ user }) => (
    <Link onClick={event => (!user ) ? event.preventDefault(): null} to={`/chat?name=${user.name}&room=hola`}>
        <ListGroupItem>
            <Image src={user.image} className="imageUser" roundedCircle />
            {user.name}
        </ListGroupItem>
    </Link>
)

export default User;