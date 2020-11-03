import React, { useState, Fragment, useEffect } from 'react';
import { useParams } from 'react-router'
import './profile.css'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import {
    Container,
    Row,
    Col,
    Image,
    Toast,
    Spinner
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

const ProfileUser = () => {
    const urlUser = 'http://localhost:3000/user/'
    const urlEdit = 'http://localhost:3000/user/update/'
    const [nameBefore, setnameBefore] = useState("");
    const { _id } = useParams();
    const [show, setShow] = useState(false);
    const [image, setImage] = useState("");
    const [bot, setBot] = useState(false);
    const [datos, setDatos] = useState({
        name: '',
        user: '',
        password: '',
        image: '',
        modeBot: false
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
                setnameBefore(res.user)
            })
            .catch(err => console.log('cargando....'));
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
        event.preventDefault()     //evita que se recargue la pagina
        const url = urlEdit + _id;
        const user = {
            name: datos.name,
            user: datos.user,
            password: datos.password,
            image: image,
            modeBot: bot,
            nameBef: nameBefore
        }
        axios.put(urlEdit + _id, user).then((res) => {
            console.log("usuario editado.")
        }).catch((e) => {
            console.log(e)
        })
        setShow(true)
        document.getElementById("formulario").reset();
        //window.location.reload(false);              //-> VALIDAR ESO PORQUE RECARGA MUY RAPIDO Y NO MUESTRA LOS CAMBIOS
    }

    if (datos.name != '') {
        return (
            <Container fluid="lg" id="containerP">
                <Row>
                    <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Body>Updated user.</Toast.Body>
                    </Toast>
                </Row>
                <br></br>
                <br></br>
                <Image src={datos.image} roundedCircle id="logo" />
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
                                    <BootstrapSwitchButton
                                        checked={datos.modeBot}
                                        size="lg"
                                        onlabel='BOT ON'
                                        offlabel='BOT OFF'
                                        onChange={(checked) => {
                                            setBot(checked)
                                        }}
                                    />
                                </div>
                                <br></br>
                                <div className="row">
                                    <label className="custom-file-upload">
                                        <input
                                            accept="image/png, .jpg, .jpeg"
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
        return (
            <Container id="containerS">
                <Row>
                    <Col>
                        <Spinner animation="grow" variant="primary" />
                        <Spinner animation="grow" variant="secondary" />
                        <Spinner animation="grow" variant="success" />
                        <Spinner animation="grow" variant="danger" />
                        <Spinner animation="grow" variant="warning" />
                        <Spinner animation="grow" variant="info" />
                        <Spinner animation="grow" variant="light" />
                        <Spinner animation="grow" variant="dark" />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ProfileUser;
