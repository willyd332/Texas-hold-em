import React from 'react';

// Bootstrap
import { Container, Row, Jumbotron } from 'reactstrap';

function HelloWorld(props){

  const [username,setUsername] = React.useState('')

  const handleChange = (e) => {
    setUsername(e.target.value)
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
        <form onSubmit={(e)=>{
          e.preventDefault()
          if (username){
            props.createUser(username)
          }
          }}>
          <input onChange={handleChange} value={username} placeholder={username}/>
          <input type="submit" />
        </form>
      </Row>
      <Row>
      </Row>
    </Container>
  );
}




export default HelloWorld;
