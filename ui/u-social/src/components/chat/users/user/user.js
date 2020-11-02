import React from 'react'
import './user.css'
import {
    ListGroupItem,
    Image
} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useCookies } from "react-cookie";


const User = ({ user }) => {
    let history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies(["account"]);

    function refreshPage() {
        //usernameLogin-usernameChat
        const ro = [cookies.account.user, user.user]
        ro.sort();  //ordenamos en alfabetico para que cuando el otro usaurio se una este en el mismo nombre de sala
        const room = ro[0] + '-' + ro[1]
        history.push(`/chat?name=${cookies.account.user}&room=${room}&select=${user.user}`)
        window.location.reload();
    }

    return (
        <Link onClick={refreshPage} >
            <ListGroupItem>
                <Image src={user.image} className="imageUser" roundedCircle />
                {user.user}
            </ListGroupItem>
        </Link>
    )
}

export default User;