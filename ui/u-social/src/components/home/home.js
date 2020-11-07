import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Cookies, useCookies } from "react-cookie";
import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";

function Home() {
  const logoPath = require("../../assets/red.png");
  const [cookies, setCookie, removeCookie] = useCookies(["account"]);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [publications, setPublications] = useState([]);
  const [tags, setTags] = useState([]);
  const [newContacts, setNewContacts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [publicationsData, setPublicationsData] = useState([]);
  const [toLogin, setToLogin] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("Propias");
  let pathProfile = ''
  try {
    pathProfile = '/user/' + cookies.account._id
  }catch(e){
    console.log('pinches hooks')
  }
  let history = useHistory();
  const RedonSubmit = () => {
    console.log("redirect")
    history.push('/chat');
  }

  function handlePublish(event) {
    toBase64(image)
      .then((image64) => {
        axios
          .post("http://3.139.70.184:3000/publish", {
            username: cookies.account.user,
            avatar: cookies.account.image,
            image64: image64.substring(22, image64.length),
            text: text,
          })
          .then((results) => getInitData())
          .catch((error) => { });
      })
      .catch((error) => { });
    event.preventDefault();
  }

  function toBase64(image) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = function () {
        resolve(reader.result.toString());
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }

  function follow(friend) {
    axios
      .post("http://3.139.70.184:3000/friend", {
        username: cookies.account.user,
        friend: friend,
      })
      .then(() => {
        getInitData();
      })
      .catch(() => { });
  }

  useEffect(() => {
    if (
      publications.length === 0 &&
      newContacts.length === 0 &&
      friends.length === 0
    ) {
      if (!cookies.account) {
        setToLogin(true);
      } else {
        getInitData();
      }
    }
  }, [publications, publicationsData, newContacts, friends]);

  function getInitData() {
    axios
      .get("http://3.139.70.184:3000/friend/knows/" + cookies.account.user)
      .then((knows) => {
        const finalFriends = knows.data.map((friend) => friend.user);
        setFriends(finalFriends);
        getInitPublications(finalFriends)
          .then(() => { })
          .catch(() => { });
        return axios.get(
          "http://3.139.70.184:3000/friend/unknows/" + cookies.account.user
        );
      })
      .then((unknows) => {
        const contacts = unknows.data.map((contact) => {
          return (
            <ListGroup.Item key={contact.user}>
              <div className="d-flex justify-content-between">
                <div>
                  <Image
                    alt=""
                    src={contact.image}
                    width="30"
                    height="30"
                    roundedCircle
                  />{" "}
                  {contact.user}
                </div>
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => follow(contact.user)}
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    className="bi bi-person-plus"
                    style={{ fill: "currentcolor" }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      style={{ fillRule: "evenodd" }}
                      d="M8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 5c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10zM13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                    />
                  </svg>{" "}
                  Seguir
                </Button>
              </div>
            </ListGroup.Item>
          );
        });
        setNewContacts(contacts);
      })
      .catch((error) => { });
  }

  async function translate(id) {
    for (let i = 0; i < publicationsData.length; i++) {
      const publication = publicationsData[i];
      try {
        if (publication._id === id) {
          const translated = await axios.post(
            "http://3.139.70.184:3000/publish/translate",
            {
              message: publication.text,
            }
          );
          publicationsData[i].text = translated.data.TranslatedText;
        }
      } catch (error) {
        console.log(error);
      }
    }
    const newPublications = publicationsData.map((publication) => {
      if (currentFilter === "Propias") {
        if (publication.username === cookies.account.user) {
          return (
            <Card
              className="mt-2"
              style={{ width: "100%" }}
              key={publication._id}
            >
              <Card.Img variant="top" src={publication.image} />
              <Card.Body>
                <Card.Subtitle className="font-weight-light">
                  {publication.date}
                </Card.Subtitle>
                <Card.Title className="mt-1">
                  <Image
                    alt=""
                    src={publication.avatar}
                    width="30"
                    height="30"
                    roundedCircle
                  />{" "}
                  {publication.username}
                </Card.Title>

                <Card.Text>{publication.text}</Card.Text>
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => translate(publication._id)}
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    className="bi bi-globe"
                    style={{ fill: "currentcolor" }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      style={{ fillRule: "evenodd" }}
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"
                    />
                  </svg>{" "}
                  Traducir
                </Button>
              </Card.Body>
            </Card>
          );
        }
      } else if (currentFilter === "Amigos") {
        if (friends.includes(publication.username)) {
          return (
            <Card
              className="mt-2"
              style={{ width: "100%" }}
              key={publication._id}
            >
              <Card.Img variant="top" src={publication.image} />
              <Card.Body>
                <Card.Subtitle className="font-weight-light">
                  {publication.date}
                </Card.Subtitle>
                <Card.Title className="mt-1">
                  <Image
                    alt=""
                    src={publication.avatar}
                    width="30"
                    height="30"
                    roundedCircle
                  />{" "}
                  {publication.username}
                </Card.Title>

                <Card.Text>{publication.text}</Card.Text>
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => translate(publication._id)}
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    className="bi bi-globe"
                    style={{ fill: "currentcolor" }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      style={{ fillRule: "evenodd" }}
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"
                    />
                  </svg>{" "}
                  Translate
                </Button>
              </Card.Body>
            </Card>
          );
        }
      } else if (publication.tags.includes(currentFilter)) {
        return (
          <Card
            className="mt-2"
            style={{ width: "100%" }}
            key={publication._id}
          >
            <Card.Img variant="top" src={publication.image} />
            <Card.Body>
              <Card.Subtitle className="font-weight-light">
                {publication.date}
              </Card.Subtitle>
              <Card.Title className="mt-1">
                <Image
                  alt=""
                  src={publication.avatar}
                  width="30"
                  height="30"
                  roundedCircle
                />{" "}
                {publication.username}
              </Card.Title>

              <Card.Text>{publication.text}</Card.Text>
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => translate(publication._id)}
              >
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-globe"
                  style={{ fill: "currentcolor" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    style={{ fillRule: "evenodd" }}
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"
                  />
                </svg>{" "}
                Translate
              </Button>
            </Card.Body>
          </Card>
        );
      }
      return null;
    });
    setPublications(newPublications);
  }

  function handleFilter(event) {
    setCurrentFilter(event.target.value);
    const newPublications = publicationsData.map((publication) => {
      if (event.target.value === "Propias") {
        if (publication.username === cookies.account.user) {
          return (
            <Card
              className="mt-2"
              style={{ width: "100%" }}
              key={publication._id}
            >
              <Card.Img variant="top" src={publication.image} />
              <Card.Body>
                <Card.Subtitle className="font-weight-light">
                  {publication.date}
                </Card.Subtitle>
                <Card.Title className="mt-1">
                  <Image
                    alt=""
                    src={publication.avatar}
                    width="30"
                    height="30"
                    roundedCircle
                  />{" "}
                  {publication.username}
                </Card.Title>

                <Card.Text>{publication.text}</Card.Text>
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => translate(publication._id)}
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    className="bi bi-globe"
                    style={{ fill: "currentcolor" }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      style={{ fillRule: "evenodd" }}
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"
                    />
                  </svg>{" "}
                  Traducir
                </Button>
              </Card.Body>
            </Card>
          );
        }
      } else if (event.target.value === "Amigos") {
        if (friends.includes(publication.username)) {
          return (
            <Card
              className="mt-2"
              style={{ width: "100%" }}
              key={publication._id}
            >
              <Card.Img variant="top" src={publication.image} />
              <Card.Body>
                <Card.Subtitle className="font-weight-light">
                  {publication.date}
                </Card.Subtitle>
                <Card.Title className="mt-1">
                  <Image
                    alt=""
                    src={publication.avatar}
                    width="30"
                    height="30"
                    roundedCircle
                  />{" "}
                  {publication.username}
                </Card.Title>

                <Card.Text>{publication.text}</Card.Text>
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => translate(publication._id)}
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    className="bi bi-globe"
                    style={{ fill: "currentcolor" }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      style={{ fillRule: "evenodd" }}
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"
                    />
                  </svg>{" "}
                  Translate
                </Button>
              </Card.Body>
            </Card>
          );
        }
      } else if (publication.tags.includes(event.target.value)) {
        return (
          <Card
            className="mt-2"
            style={{ width: "100%" }}
            key={publication._id}
          >
            <Card.Img variant="top" src={publication.image} />
            <Card.Body>
              <Card.Subtitle className="font-weight-light">
                {publication.date}
              </Card.Subtitle>
              <Card.Title className="mt-1">
                <Image
                  alt=""
                  src={publication.avatar}
                  width="30"
                  height="30"
                  roundedCircle
                />{" "}
                {publication.username}
              </Card.Title>

              <Card.Text>{publication.text}</Card.Text>
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => translate(publication._id)}
              >
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-globe"
                  style={{ fill: "currentcolor" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    style={{ fillRule: "evenodd" }}
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"
                  />
                </svg>{" "}
                Translate
              </Button>
            </Card.Body>
          </Card>
        );
      }
      return null;
    });
    setPublications(newPublications);
  }

  function getInitPublications(contacts) {
    return new Promise((resolve, reject) => {
      axios
        .get("http://3.139.70.184:3000/publish")
        .then((initPublications) => {
          initPublications.data = initPublications.data.filter((publication) =>
            [cookies.account.user, ...contacts].includes(publication.username)
          );
          initPublications.data.reverse();
          let newTags = [];
          setPublicationsData(initPublications.data);
          const newPublications = initPublications.data.map((publication) => {
            for (let i = 0; i < publication.tags.length; i++) {
              const tag = publication.tags[i];
              newTags.push(tag);
            }
            if (publication.username === cookies.account.user) {
              return (
                <Card
                  className="mt-2"
                  style={{ width: "100%" }}
                  key={publication._id}
                >
                  <Card.Img variant="top" src={publication.image} />
                  <Card.Body>
                    <Card.Subtitle className="font-weight-light">
                      {publication.date}
                    </Card.Subtitle>
                    <Card.Title className="mt-1">
                      <Image
                        alt=""
                        src={publication.avatar}
                        width="30"
                        height="30"
                        roundedCircle
                      />{" "}
                      {publication.username}
                    </Card.Title>

                    <Card.Text>{publication.text}</Card.Text>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => translate(publication._id)}
                    >
                      <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        className="bi bi-globe"
                        style={{ fill: "currentcolor" }}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          style={{ fillRule: "evenodd" }}
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"
                        />
                      </svg>{" "}
                      Translate
                    </Button>
                  </Card.Body>
                </Card>
              );
            }
            return null;
          });
          setPublications(newPublications);
          newTags = [...new Set(newTags)];
          const finalTags = newTags.map((temporal) => {
            return (
              <option value={temporal} key={temporal}>
                {temporal}
              </option>
            );
          });
          finalTags.push(
            <option value="Amigos" key="Amigos">
              Amigos
            </option>
          );
          finalTags.push(
            <option value="Propias" key="Propias">
              Propias
            </option>
          );
          finalTags.reverse();
          setTags(finalTags);
          resolve();
        })
        .catch((error) => reject(error));
    });
  }

  return (
    <div>
      {toLogin ? <Redirect to="/" /> : null}
      {cookies.account ? (
        <div>
          <Navbar
            className="justify-content-between"
            bg="light"
            variant="light"
            sticky="top"
          >
            <Navbar.Brand href="#home">
              <img
                alt=""
                src={logoPath}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              {"  "}
              uSocial
              <Button className="ml-4" variant="dark" size="sm" onClick={RedonSubmit}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-chat-dots-fill"
                  style={{ fill: "currentColor" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    style={{ fillRule: "evenodd" }}
                    d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  />
                </svg>{" "}
                Chat
              </Button>
            </Navbar.Brand>
            <div className="d-flex">
              <div className="bg-dark text-white rounded p-1">
                <a href={pathProfile}>
                  <Image
                    alt=""
                    src={cookies.account.image}
                    width="30"
                    height="30"
                    roundedCircle
                  />{" "}
                  {cookies.account.name}
                </a>
              </div>
              <Button
                className="ml-2"
                variant="danger"
                size="sm"
                onClick={() => {
                  removeCookie("account");
                  setToLogin(true);
                }}
              >
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-x-circle-fill"
                  style={{ fill: "currentColor" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    style={{ fillRule: "evenodd" }}
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
                  />
                </svg>{" "}
                Salir
              </Button>
            </div>
          </Navbar>
          <Container className="my-4">
            <Row>
              <Col className="col-sm-12 col-md-12 col-lg-8">
                <form className="border p-4" onSubmit={handlePublish}>
                  <input
                    type="text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    style={{ width: "100%" }}
                  ></input>
                  <input
                    className="mt-2"
                    type="file"
                    onChange={(event) => setImage(event.target.files[0])}
                    style={{ width: "100%" }}
                  ></input>
                  <Button
                    type="submit"
                    className="mt-3"
                    variant="dark"
                    style={{ width: "100%" }}
                  >
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      className="bi bi-plus-circle-fill"
                      style={{ fill: "currentColor" }}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        style={{ fillRule: "evenodd" }}
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
                      />
                    </svg>{" "}
                    Publicar
                  </Button>
                </form>
                <div className="d-flex justify-content-center my-4">
                  <h6>Filtrar por</h6>
                  <select className="ml-2" onChange={handleFilter}>
                    {tags}
                  </select>
                </div>
                {publications}
              </Col>
              <Col className="col-sm-12 col-md-12 col-lg-4">
                <h3>
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    className="bi bi-person-plus-fill"
                    style={{ fill: "currentcolor" }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      style={{ fillRule: "evenodd" }}
                      d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                    />
                  </svg>{" "}
                  Conecta
                </h3>
                <ListGroup>{newContacts}</ListGroup>
              </Col>
            </Row>
          </Container>
        </div>
      ) : null
      }
    </div >
  );
}

export default Home;
