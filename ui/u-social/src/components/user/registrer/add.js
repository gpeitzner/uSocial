import React, { useState, useEffect, Fragment } from 'react';
import './add.css'
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Image,
    Toast
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

const AddUser = () => {
    const [show, setShow] = useState(false);
    const [image, setImage] = useState("");
    const [datos, setDatos] = useState({
        name: '',
        user: '',
        password: '',
        image: ''
    })

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
            reader.onerror = error => {};
        }
    };

    const enviarDatos = (event) => {
        event.preventDefault()     //evita que se recargue la pagina
        const url = 'http://localhost:3000/user/registrer';
        const user = {
            name: datos.name,
            user: datos.user,
            password: datos.password,
            image: image
        }
        axios.post(url, user).then((res) => {
            console.log("usuario insertado.")
        }).catch((e) => {
            console.log(e)
        })
        setShow(true)
        document.getElementById("formulario").reset();
    }
    return (
        <Container fluid="md" id="container">
            <Row>
                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Body>Added user.</Toast.Body>
                </Toast>
            </Row>
            <br></br>
            <br></br>
            <Row>
                <Col>
                    <Fragment>
                        <Image src="logo.png" roundedCircle id="logo" />
                        <form onSubmit={enviarDatos} id="formulario">
                            <div className="row">
                                <input required="true" type="text" placeholder='Name' className="form-control" onChange={handleInputChange} name="name"></input>
                            </div>
                            <br></br>
                            <div className="row">
                                <input required="true" type="text" placeholder='User Name' className="form-control" onChange={handleInputChange} name="user"></input>
                            </div>
                            <br></br>
                            <div className="row">
                                <input required="true" type="text"  placeholder='Password' className="form-control" onChange={handleInputChange} name="password"></input>
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
                            <button id="boton" type="submit" className="btn btn-primary">Registrer</button>
                        </form>
                    </Fragment>
                </Col>
            </Row>
        </Container>
    )
}

export default AddUser;
