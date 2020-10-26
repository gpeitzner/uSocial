import React from 'react'
import './user.css'
import {
    ListGroupItem,
    Image
} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'

const User = ({ user }) => {
    let history = useHistory();

    function refreshPage() {
        history.push(`/chat?name=${user.name}&room=hola`)
        window.location.reload();
    }

    return (
        <Link onClick={refreshPage} >
            <ListGroupItem>
                <Image src={user.image} className="imageUser" roundedCircle />
                {user.name}
            </ListGroupItem>
        </Link>
    )
}

export default User;