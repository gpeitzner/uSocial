import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [toHome, setToHome] = useState(false);
  const logoPath = require("../../../assets/red.png");
  const [cookies, setCookie] = useCookies(["account"]);
  function handleSubmit(event) {
    fetch("server/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((results) => results.json())
      .then((results) => {
        if (results["error"]) {
          setShow(true);
        } else {
          setCookie("account", results);
          setToHome(true);
        }
      })
      .catch((error) => console.log(error));

    event.preventDefault();
  }

  return (
    <div>
      {toHome ? <Redirect to="/home" /> : null}
      <Container style={{ marginTop: "10vh" }}>
        <Row className="justify-content-center">
          <Col className="col-sm-4 col-md-6 col-lg-4">
            <div className="text-center">
              <Image src={logoPath}></Image>
            </div>
            <div
              className="text-center font-weight-light mt-4"
              style={{ fontSize: "1.5em" }}
            >
              Iniciar sesión en uSocial
            </div>
            {show && (
              <Alert
                className="mt-4 align-middle"
                variant="danger"
                onClose={() => setShow(false)}
                dismissible
                style={{ fontSize: "0.9em", color: "black" }}
              >
                <p>Usuario o contraseña incorrectos.</p>
              </Alert>
            )}
            <form className="border mt-4 p-4" onSubmit={handleSubmit}>
              <p className="font-weight-bold" style={{ fontSize: "0.9em" }}>
                Nombre de usuario
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  style={{ width: "100%" }}
                ></input>
              </p>
              <p className="font-weight-bold" style={{ fontSize: "0.9em" }}>
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  style={{ width: "100%" }}
                ></input>
              </p>
              <Button
                type="submit"
                className="mt-3"
                variant="success"
                style={{ width: "100%" }}
              >
                Entrar
              </Button>
            </form>
            <div className="border my-4 pt-3">
              <p className="text-center" style={{ fontSize: "0.9em" }}>
                Nuevo en uSocial? <a href="/registrer">Crea una cuenta.</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
