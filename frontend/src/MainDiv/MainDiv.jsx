import React, {useState, useContext, useEffect} from 'react';

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
        <Col xs="3"><PlayerBox player={0}/></Col>
        <Col xs="4"><PlayerBox player={1}/></Col>
        <Col xs="3"><PlayerBox player={2}/></Col>
        <Col xs="1"></Col>
      </Row>
      <Row>
        <Col xs="2"><PlayerBox player={3} middle="true"/></Col>
        <Col xs="8">Game Table</Col>
        <Col xs="2"><PlayerBox player={4} middle="true"/></Col>
      </Row>
      <Row>
        <Col xs="1"></Col>
        <Col xs="3"><PlayerBox player={5}/></Col>
        <Col xs="4"><PlayerBox player={6}/></Col>
        <Col xs="3"><PlayerBox player={7}/></Col>
        <Col xs="1"></Col>
      </Row>
      <Row>
        <Col xs="2"><CardsBox/></Col>
        <Col xs="5"><UserInfo /></Col>
        <Col xs="5"><ChatBox/></Col>
      </Row>
    </Container>
  );
}




export default HelloWorld;
