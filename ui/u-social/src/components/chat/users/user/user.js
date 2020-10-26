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
        //usernameLogin-usernameChat
        const ro = ['testLogin', user.user]
        ro.sort();  //ordenamos en alfabetico para que cuando el otro usaurio se una este en el mismo nombre de sala
        const room = ro[0] + '-' + ro[1]
        history.push(`/chat?name=${user.user}&room=${room}`)
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