import React, {useState, useContext, useEffect} from 'react';

// Components
import PlayerBox from '../PlayerBox/PlayerBox.jsx'
import CardsBox from '../CardsBox/CardsBox.jsx'
import UserInfo from '../UserInfo/UserInfo.jsx'
import ChatBox from '../ChatBox/ChatBox.jsx'

// Bootstrap
import { Container, Row, Col } from 'reactstrap';


// Context
import { SocketContext } from '../App.jsx'

function MainDiv(props){

  const [game,setGame] = useState(false);
  const [turn,setTurn] = useState(0);

  const io = useContext(SocketContext);

  useEffect(() => {
    renderGame();
  }, [])

const renderGame = () => {

  io.socket.on('renderGame', (data) => {

    setGame(data.game);

    if (data.game.users.length === 2 && !data.game.round) {
      startGame();
    }

    if (data.action === 'ante') {
      const nextTurn = turn + 1;
      setTurn(nextTurn);
    }

  });

  if (!game) {
    io.socket.emit('joinGame', io.room);
  };
}


  const startGame = async () => {
    io.socket.emit('startGame', io.room);
  }


  if (game){
  return(
    <Container fluid={true}>
      <Row>
        <Col xs="1"></Col>
        <Col xs="3"><PlayerBox turn={turn} setTurn={setTurn} game={game} setGame={setGame} playerNum={0}/></Col>
        <Col xs="4"><PlayerBox turn={turn} setTurn={setTurn} game={game} setGame={setGame} playerNum={1}/></Col>
        <Col xs="3"><PlayerBox turn={turn} setTurn={setTurn} game={game} setGame={setGame} playerNum={2}/></Col>
        <Col xs="1"></Col>
      </Row>
      <Row>
        <Col xs="2"><PlayerBox turn={turn} setTurn={setTurn} game={game} setGame={setGame} playerNum={3} middle="true"/></Col>
        <Col xs="8">Game Table</Col>
        <Col xs="2"><PlayerBox turn={turn} setTurn={setTurn} game={game} setGame={setGame} playerNum={4} middle="true"/></Col>
      </Row>
      <Row>
        <Col xs="1"></Col>
        <Col xs="3"><PlayerBox turn={turn} setTurn={setTurn} game={game} setGame={setGame} playerNum={5}/></Col>
        <Col xs="4"><PlayerBox turn={turn} setTurn={setTurn} game={game} setGame={setGame} playerNum={6}/></Col>
        <Col xs="3"><PlayerBox turn={turn} setTurn={setTurn} game={game} setGame={setGame} playerNum={7}/></Col>
        <Col xs="1"></Col>
      </Row>
      <Row>
        <Col xs="2"><CardsBox/></Col>
        <Col xs="5"><UserInfo /></Col>
        <Col xs="5"><ChatBox/></Col>
      </Row>
    </Container>
  );
} else {
  return <h1>Please Wait While We Find A Game....</h1>
};
}




export default MainDiv;
