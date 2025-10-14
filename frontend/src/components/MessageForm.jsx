import React, { useState, useContext, useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import '../styles/MessajeForm.css'
import { useSelector } from 'react-redux'
import { AppContext } from '../context/appContext'


function MessageForm() {
  const user = useSelector((state) => state.user)
  const [message, setMessage] = useState('')
  const { socket, currentRoom, messages, setMessages } = useContext(AppContext)

  function getFormattedDate() {
    const date = new Date()
    const year = date.getFullYear()
    let month = (date.getMonth() + 1).toString()
    month = month.length > 1 ? month : '0' + month
    let day = date.getDate().toString()
    day = day.length > 1 ? day : '0' + day
    return `${day}/${month}/${year}`
  }

  const todayDate = getFormattedDate()
 

  useEffect(() => {
    if (!socket) return
    socket.off('room_messages').on('room_messages', (roomMessages) => {
      console.log('Mensajes recibidos:', roomMessages)
      setMessages(roomMessages)
    })
  }, [socket])

  function handleSubmit(e) {
    e.preventDefault()
    if (!message) return
    const today = new Date()
    const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
    const time = today.getHours() + ':' + minutes
    const roomId = currentRoom
    socket.emit('message_room', roomId, message, user, time, todayDate)
    setMessage('')
  }

  return (
    <div className="container__chat">
      <div className="message__output">
        {!user && <div className="alert alert-danger">Login to start a conversation</div>}
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.from}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Type a message..."
                disabled={!user}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: '100%', backgroundColor: 'var(--color-primary)' }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default MessageForm
