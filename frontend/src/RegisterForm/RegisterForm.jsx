import React, { useState } from 'react';

// Bootstrap
import { Container, Row, Jumbotron } from 'reactstrap';

function RegisterForm(props){

  const [username,setUsername] = useState('')
  const [currPassword,setPassword] = useState('')
  const [conPassword,setConPassword] = useState('')
  const [wrongInfo,setWrongInfo] = useState(false)

  const handleUsername = (e) => {
    setUsername(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleConPassword = (e) => {
    setConPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (currPassword !== conPassword){
      setWrongInfo('passwords do not match')
    } else {

    if (username.length > 0 && currPassword.length > 0){
    try {

      const input = {
        username: username,
        password: currPassword,
      };

      console.log(input);

      let createdUser = await fetch('http://localhost:9000/auth/register', {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          'Content-Type': "application/json"
        }
      });

      createdUser = await createdUser.json();
      console.log(createdUser)
      if(createdUser.data === "Register Successful"){
        props.createUser(username)
      } else {
        setWrongInfo("user already exists");
      }
    } catch(err){
      console.log(err)
    }
  }
  }
  }

  return(
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          {wrongInfo &&
            <span className="wrong-info" >{wrongInfo}</span>
          }
          <input onChange={handleUsername} value={username} placeholder="username"/>
          <input type="password" onChange={handlePassword} value={currPassword} placeholder="password"/>
          <input type="password" onChange={handleConPassword} value={conPassword} placeholder="confirm password"/>
          <button type="submit" > REGISTER </button>
        </form>
  );
}




export default RegisterForm;
