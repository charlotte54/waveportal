import React from "react";
import '../App.css';
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Card } from 'react-bootstrap';

const HomeScreen = () => {

  return (

    <div className="mainContainer">

      <div className="dataContainer">

<Card >
  <Card.Body>
    <Card.Header> <div className="header">
       Welcome
        </div> </Card.Header>
    <Card.Text className="waveButton">
      Please click below button to wave at me!
    </Card.Text>
  </Card.Body>

</Card>

  <LinkContainer to="/wave">
        <Button className="waveButton">
          Cick Here!   
        </Button>
    </LinkContainer>
     </div>
    </div>

  

 )
}

export default HomeScreen