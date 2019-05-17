import React, { useState } from 'react';

// Bootstrap
import { Container, Row, Jumbotron } from 'reactstrap';

function LoginForm(props){

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

      const input = {
        username: username,
        password: currPassword,
      }

      let loggedUser = await fetch('http://localhost:9000/auth/login', {
        credentials: "include",
        method: "post",
        body: JSON.stringify(input),
        headers: {
          'Content-Type': "application/json"
        }
      });

      loggedUser = await loggedUser.json();
      console.log(loggedUser)
      if(loggedUser.data === "Login Successful"){
        props.createUser(username);
        props.setCurrUser(username);
      } else {
        setWrongInfo(true);
      }
    } catch(err){
      console.log(err)
    }
  }
  }

  return(
        <form className="auth-form-box" onSubmit={(e)=>{handleSubmit(e)}}>
          {wrongInfo &&
            <span className="wrong-info" >wrong username or password</span>
          }
          <input className="auth-input" onChange={handleUsername} value={username} placeholder="username"/>
          <input className="auth-input" type="password" onChange={handlePassword} value={currPassword} placeholder="password"/>
          <button className="auth-input" type="submit" > LOGIN </button>
        </form>
  );
}




export default LoginForm;
