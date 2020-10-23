import React, {useState, Fragment, useEffect} from 'react';
import {useParams} from 'react-router'
import './profile.css'
import {
    Container,
    Row,
    Col,
    Image,
    Toast
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

const ProfileUser = () => {
    const urlUser = 'http://localhost:3000/user/'
    const urlEdit = 'http://localhost:3000/user/update/'
    const {_id} = useParams();
    const [show, setShow] = useState(false);
    const [image, setImage] = useState("");
    const [datos, setDatos] = useState({
        name: '',
        user: '',
        password: '',
        image: ''
    })
    //no use axios para esta peticion porque se quedaba haciendo peticiones, es mejor usar un unico effect y cargue la data axios funciona mejor para post, put y delete
    async function getUser() {
        let res = ''
        res = await fetch(`http://localhost:3000/user/${_id}`);
        res
            .json()
            .then((res) => {
                setDatos(res)
                setImage(res.image)
            })
            .catch(err => alert('Ocurio un error.'));
    }

    useEffect(() => {
        getUser();
    }, []);

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value,
            [event.target.user]: event.target.value,
            [event.target.password]: event.target.value
        })
    }
    const handleChangeLoad = e => {
        if (e.target.files.length) {
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setImage(reader.result)
            }
            reader.onerror = error => {
            };
        }
    };

    const enviarDatos = (event) => {
        console.log(datos)
        event.preventDefault()     //evita que se recargue la pagina
        const url = urlEdit + _id;
        const user = {
            name: datos.name,
            user: datos.user,
            password: datos.password,
            image: image
        }
        axios.put(urlEdit + _id, user).then((res) => {
            console.log("usuario editado.")
        }).catch((e) => {
            console.log(e)
        })
        setShow(true)
        document.getElementById("formulario").reset();
        window.location.reload(false);
    }

    if (datos) {
        return (
            <Container fluid="lg" id="container">
                <Row>
                    <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Body>Updated user.</Toast.Body>
                    </Toast>
                </Row>
                <br></br>
                <br></br>
                <Image src={datos.image} roundedCircle id="logo"/>
                <Row>
                    <Col>
                        <Fragment>
                            <form onSubmit={enviarDatos} id="formulario">
                                <div className="row">
                                    <input type="text" placeholder={datos.name} className="form-control"
                                           onChange={handleInputChange} name="name"></input>
                                </div>
                                <br></br>
                                <div className="row">
                                    <input type="text" placeholder={datos.user} className="form-control"
                                           onChange={handleInputChange} name="user"></input>
                                </div>
                                <br></br>
                                <div className="row">
                                    <input type="text" placeholder={datos.password} className="form-control"
                                           onChange={handleInputChange} name="password"></input>
                                </div>
                                <br></br>
                                <div className="row">
                                    <label className="custom-file-upload">
                                        <input
                                            type="file"
                                            id="upload-button"
                                            onChange={handleChangeLoad}
                                        />
                                    </label>
                                </div>
                                <br></br>
                                <button id="boton" type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </Fragment>
                    </Col>
                </Row>
            </Container>
        )
    } else {
        return (<h1>perate we</h1>)
    }
}

export default ProfileUser;