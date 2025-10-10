import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import MessageForm from '../components/MessageForm'

function Chat() {
  return (
    <div>
      <Container>
        <Row>
          <Col md={4}>
            <Sidebar />
          </Col>
          <Col md={8}>
            <MessageForm />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Chat