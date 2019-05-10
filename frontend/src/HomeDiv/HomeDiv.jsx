import React from 'react';

// Bootstrap
import { Container, Row, Jumbotron, Col, Button } from 'reactstrap';

function HelloWorld(props){
  return(
    <Container>
      <Jumbotron fluid>
        <Container fluid>
          <h1 className="display-3">holdem.io</h1>
          <p className="lead">Texas hold'em online</p>
        </Container>
      </Jumbotron>
      <Row>
        <h1>INPUT NAME HERE</h1>
      </Row>
      <Row>
        <Button href="/game">START GAME</Button>
      </Row>
    </Container>
  );
}




export default HelloWorld;
