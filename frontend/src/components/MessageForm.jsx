import React from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'

function MessageForm() {

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div>
      <div className="message__output"></div>
        <Form  onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control type="text" placeholder="Type a message..." />
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button variant='primary' type="submit" style={{width: "100%", backgroundColor: "var(--color-primary)"}}>
              <i className='fas fa-paper-plane'></i>
              Send
              </Button>
          </Col>
        </Row>
        </Form>
        
      
    </div>
  )
}

export default MessageForm