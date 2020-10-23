import React, { useState, useEffect } from 'react';
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
    return (
        <Container fluid="md" id="container">
            <Row>
                <Col>
                    <Form>
                        <Image src="logo.png" roundedCircle id="logo"/>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" placeholder="Enter your name." />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control type="user" placeholder="Enter your userName." />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.File id="formcheck-api-regular">
                            <Form.File.Label>Cargar Imagen</Form.File.Label>
                            <Form.File.Input />
                        </Form.File>
                        <br></br>
                        <Button variant="primary" type="submit" id="boton">
                            Registrer
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default AddUser;