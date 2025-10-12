import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import MessageForm from '../components/MessageForm'

function Chat() {
  return (
    <div>
      <Container>
        <Row>
          <Col md={3}>
            <Sidebar />
          </Col>
          <Col md={9}>
            <MessageForm />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Chat