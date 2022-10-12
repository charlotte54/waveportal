import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row style={{textAlign: "center"}}>
          <Col className='text-center py-3'>Copyright &copy; WavePortal</Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
