import React, { useState, useEffect, Fragment } from 'react';
import './add.css'
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Image
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddUser = () => {
    const [image, setImage] = useState({ preview: "", raw: "" });
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
        event.preventDefault()
        console.log('enviando datos...' + datos.name + ' ' + datos.user + ' ' + datos.password + ' ' + image)
    }
    return (
        <Container fluid="md" id="container">
            <Row>
                <Col>
                    <Fragment>
                        <Image src="logo.png" roundedCircle id="logo" />
                        <form onSubmit={enviarDatos}>
                            <div className="row">
                                <input type="text" placeholder="Name" className="form-control" onChange={handleInputChange} name="name"></input>
                            </div>
                            <br></br>
                            <div className="row">
                                <input type="text" placeholder="User Name" className="form-control" onChange={handleInputChange} name="user"></input>
                            </div>
                            <br></br>
                            <div className="row">
                                <input type="text" placeholder="Password" className="form-control" onChange={handleInputChange} name="password"></input>
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
