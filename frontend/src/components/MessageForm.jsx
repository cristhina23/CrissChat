import React from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import '../styles/MessajeForm.css'
import { useSelector } from 'react-redux';

function MessageForm() {
  const user = useSelector((state) => state.user);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className='container__chat'>
      <div className="message__output">
        { !user && <div className='alert alert-danger'>Login to start a conversation</div>}
      </div>
        <Form  onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control type="text" placeholder="Type a message..." disabled={!user} />
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button variant='primary' type="submit" style={{width: "100%", backgroundColor: "var(--color-primary)"}} disabled={!user}>
              <i className='fas fa-paper-plane'></i>
              
              </Button>
          </Col>
        </Row>
        </Form>
        
      
    </div>
  )
}

export default MessageForm