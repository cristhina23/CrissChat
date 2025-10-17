import React, { useState, useContext } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { BsFillSendFill } from "react-icons/bs";
import '../styles/MessajeForm.css'
import  { AppContext } from '../context/appContext'



function MessageForm() {
  const user = useSelector((state) => state.user);
  const [message, setMessage] = useState('')
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext)

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = ( date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return `${day}/${month}/${year}`

  }

  const todayDate = getFormattedDate();

  socket.off('room_messages').on('room_messages', (roomMessages) => {
    console.log('Room messages:', roomMessages);
    setMessages(roomMessages);
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() ) return;
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ':' + minutes;
    const roomId = currentRoom;

    socket.emit('message_room', roomId, message, user, todayDate, time);
    setMessage('');
  }

  return (
    <div className='container__chat'>
      <div className='message__output'>{!user && <div className='alert alert-danger'> Please login to start a conversation</div>} </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
           <Form.Group>
             <Form.Control type="text" placeholder="Type your message" disabled={!user} value={message} onChange={(e)  => setMessage(e.target.value)} />
           </Form.Group>
          </Col>
          <Col md={1}>
            <Button variant='priamary'  type="submit" style={{ width: '100%', background: 'var(--btn-primary-bg)', border: 'none'}}> <BsFillSendFill style={{ color: 'white' }} /></Button>

          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default MessageForm