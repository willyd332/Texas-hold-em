import React, { useState, useEffect } from 'react';

// Bootstrap
import { Container, Row, Jumbotron, Button } from 'reactstrap';

// Components
import LoginForm from '../LoginForm/LoginForm.jsx'
import RegisterForm from '../RegisterForm/RegisterForm.jsx'

function HelloWorld(props){

  const [logged,setLogged] = useState(false);
  const [sessionUser,setSessionUser] = useState(false);

  useEffect(()=>{

    checkForSession();

  },[])

  const checkForSession = async () => {
    if (!logged){
    let areYouLogged = await fetch('http://localhost:9000/auth/session', {
      credentials: 'include'
    });
        areYouLogged = await areYouLogged.json();

    console.log(areYouLogged)

    setSessionUser(areYouLogged.name)
    if (!logged){
    setLogged(areYouLogged.data);
  }
  }
  }

  return(
    <Container>
      <Jumbotron id="main-title">
        <Container className="title-info" >
          <h1 className="display-3 title-header">Hold'em.io</h1>
          <p className="lead">Texas hold'em online</p>
          <span>Powered by deckofcardsapi.com</span>
        </Container>
      </Jumbotron>
      {!logged ? (
        <div className="auth-forms">
          <h1>LOGIN</h1>
          <Row>
            <LoginForm createUser={props.createUser} />
          </Row>
          <h1>REGISTER</h1>
          <Row>
            <RegisterForm createUser={props.createUser} />
          </Row>
        </div>
      ) : (
        <div>
          <Button onClick={()=>{props.createUser(sessionUser)}} >JOIN GAME AS {sessionUser}</Button>
          <Button onClick={()=>{setLogged(false)}} >LOGIN AS DIFFERENT USER</Button>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <span>Powered by deckofcardsapi.com</span>
    </Container>
  );
}




export default HelloWorld;
