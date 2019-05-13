import React, {useState, useContext, useEffect} from 'react';

// Components
import PlayerBox from '../PlayerBox/PlayerBox.jsx'
import CardsBox from '../CardsBox/CardsBox.jsx'
import UserInfo from '../UserInfo/UserInfo.jsx'
import ChatBox from '../ChatBox/ChatBox.jsx'

// Bootstrap
import { Container, Row, Col } from 'reactstrap';

// Context
import {GameContext} from '../GameContext/GameContext.jsx'
import {SocketContext} from '../SocketContext/SocketContext.jsx'

function HelloWorld(props){

  const [currGame,setCurrGame] = useState(GameContext._currentValue)
  const [currUser,setUser] = useState()
  const socketContext  = useContext(SocketContext)

  const thisUser = currGame.users.filter((user) => {
    return user.socketId === socketContext.socket.id
  })

  console.log(thisUser)

  useEffect(() => {
    createListeners();
    setUser(thisUser[0])
  }, [currGame])

  const createListeners = () => {

    socketContext.socket.on('renderGame', (game)=>{
      setCurrGame(game);
      socketContext.socket.off('joinedGame')
    })


    socketContext.socket.on('gameStart', () => {
      if (currGame.users.length > 1){
        console.log('game will start')
      }
    })

  }

  console.log(currUser)

  return(
    <Container fluid={true}>
      <GameContext.Provider value={{game: currGame, user: currUser}}>
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
          <Col xs="5"><UserInfo/></Col>
          <Col xs="5"><ChatBox/></Col>
        </Row>
      </GameContext.Provider>
    </Container>
  );
}




export default HelloWorld;
