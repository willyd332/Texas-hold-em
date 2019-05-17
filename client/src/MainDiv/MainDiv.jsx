import React, {useState, useContext, useEffect} from 'react';

// Components
import PlayerBox from '../PlayerBox/PlayerBox.jsx'
import CardsBox from '../CardsBox/CardsBox.jsx'
import UserInfo from '../UserInfo/UserInfo.jsx'
import ChatBox from '../ChatBox/ChatBox.jsx'
import GameTable from '../GameTable/GameTable.jsx'

// Bootstrap
import {Container, Row, Col} from 'reactstrap';

// Context
import {SocketContext} from '../App.jsx'

function MainDiv(props) {

  const [game, setGame] = useState(false);
  const io = useContext(SocketContext);

  useEffect(() => {
    renderGame();
  }, [])

  // RENDER GAME WHENEVER A CHANGE IS MADE
  const renderGame = () => {
    io.socket.on('renderGame', (data) => {

      setGame(data.game);

      if (data.game.users.length === 2 && !data.game.round) {
        startGame();
      }

    });

    // IF THE USER HAS NO GAME ALREADY, JOIN ONE
    if (!game) {
      io.socket.emit('joinGame', io.room);
    };
  }

  // START THE GAME (SETS ROUND TO ANTE)
  const startGame = async () => {
    io.socket.emit('startGame', io.room);
  }

  if (game) {
    return (<Container className="game-container" fluid={true}>
      <Row>
        <Col xs="4"><PlayerBox game={game} setGame={setGame} playerNum={game.setup[0]}/></Col>
        <Col xs="4"><PlayerBox game={game} setGame={setGame} playerNum={game.setup[1]}/></Col>
        <Col xs="4"><PlayerBox game={game} setGame={setGame} playerNum={game.setup[2]}/></Col>
      </Row>
      <Row>
        <Col xs="3"><PlayerBox game={game} setGame={setGame} playerNum={game.setup[3]} middle="true"/></Col>
        <Col id="game-table" xs="6"><GameTable game={game}/></Col>
        <Col xs="3"><PlayerBox game={game} setGame={setGame} playerNum={game.setup[4]} middle="true"/></Col>
      </Row>
      <Row>
        <Col xs="4"><PlayerBox game={game} setGame={setGame} playerNum={game.setup[5]}/></Col>
        <Col xs="4"><PlayerBox game={game} setGame={setGame} playerNum={game.setup[6]}/></Col>
        <Col xs="4"><PlayerBox game={game} setGame={setGame} playerNum={game.setup[7]}/></Col>
      </Row>
      <Row className="info-box">
        <Col className="this-user" id="card-box-col" xs="3"><CardsBox game={game}/></Col>
        <Col className="this-user" xs="3"><UserInfo game={game} setGame={setGame} playerNum={5}/></Col>
        <Col className="this-user" xs="5"><ChatBox/></Col>
      </Row>
    </Container>);
  } else {
    return <h1>Please Wait While We Find A Game....</h1>
  };
}

export default MainDiv;
