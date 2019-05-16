import React, { useState } from 'react';

// Bootstrap
import { Container, Row, Jumbotron } from 'reactstrap';

function HelloWorld(props){

  const [username,setUsername] = useState('')
  const [currPassword,setPassword] = useState('')
  const [wrongInfo,setWrongInfo] = useState(false)

  const handleUsername = (e) => {
    setUsername(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (username.length > 0 && currPassword.length > 0){
    try {

      let loggedUser = await fetch('http://localhost:9000/auth/login', {
        credentials: "include",
        method: "post",
        body: {
          username: username,
          password: currPassword,
        },
        header: {
          'Content-Type': "application/json"
        }
      });

      loggedUser = await loggedUser.json();
      console.log(loggedUser)

      if(loggedUser.data === "Login Successful"){
        props.createUser(username)
      } else {
        setWrongInfo(true);
      }

    } catch(err){
      console.log(err)
    }
  }

  }

  return(
    <Container>
      <Jumbotron fluid>
        <Container fluid>
          <h1 className="display-3">Hold'em.io</h1>
          <p className="lead">Texas hold'em online</p>
        </Container>
      </Jumbotron>
      <Row>
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          {wrongInfo &&
            <span className="wrong-info" >wrong username or password</span>
          }
          <input onChange={handleUsername} value={username} placeholder="username"/>
          <input type="password" onChange={handlePassword} value={currPassword} placeholder="password"/>
          <input type="submit" />
        </form>
      </Row>
      <Row>
      </Row>
    </Container>
  );
}




export default HelloWorld;
