import React from 'react';

// Components
import PlayerBox from '../PlayerBox/PlayerBox.jsx'
import CardsBox from '../CardsBox/CardsBox.jsx'
import UserInfo from '../UserInfo/UserInfo.jsx'
import ChatBox from '../ChatBox/ChatBox.jsx'

// Bootstrap
import { Container, Row, Col } from 'reactstrap';

function HelloWorld(props){
  return(
    <Container fluid={true}>
      <Row>
        <Col xs="1"></Col>
        <Col xs="3"><PlayerBox player="Top Left"/></Col>
        <Col xs="4"><PlayerBox player="Top Middle"/></Col>
        <Col xs="3"><PlayerBox player="Top Right"/></Col>
        <Col xs="1"></Col>
      </Row>
      <Row>
        <Col xs="2"><PlayerBox player="Middle Left" middle="true"/></Col>
        <Col xs="8">Game Table</Col>
        <Col xs="2"><PlayerBox player="Middle Right" middle="true"/></Col>
      </Row>
      <Row>
        <Col xs="1"></Col>
        <Col xs="3"><PlayerBox player="Bottom Left"/></Col>
        <Col xs="4"><PlayerBox player="Bottom Middle"/></Col>
        <Col xs="3"><PlayerBox player="Bottom Right"/></Col>
        <Col xs="1"></Col>
      </Row>
      <Row>
        <Col xs="2"><CardsBox/></Col>
        <Col xs="5"><UserInfo/></Col>
        <Col xs="5"><ChatBox/></Col>
      </Row>
    </Container>
  );
}




export default HelloWorld;
