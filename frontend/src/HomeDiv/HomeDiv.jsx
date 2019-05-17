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
        </Container>
      </Jumbotron>
      {!logged ? (
        <div className="auth-forms">
          <h1>LOGIN</h1>
          <Row>
            <LoginForm  setCurrUser={props.setCurrUser} createUser={props.createUser} />
          </Row>
          <h1>REGISTER</h1>
          <Row>
            <RegisterForm setCurrUser={props.setCurrUser} createUser={props.createUser} />
          </Row>
        </div>
      ) : (
        <div>
          <Button className="session-btn" onClick={()=>{
            props.createUser(sessionUser)
            props.setCurrUser(setSessionUser)
          }} >JOIN GAME AS {sessionUser}</Button>
          <Button className="session-btn" onClick={()=>{setLogged(false)}} >LOGIN AS DIFFERENT USER</Button>
        </div>
      )}
      <span className="powered-by" >Powered by deckofcardsapi.com</span>
    </Container>
  );
}




export default HelloWorld;
