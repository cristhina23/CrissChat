import React from 'react'
import { ListGroup } from 'react-bootstrap';

function Sidebar() {
  const rooms = ['general', 'tech', 'finance', 'crypto'];
  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup>
        {rooms.map((room, index) => (
          <ListGroup.Item key={index}>{room}</ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}

export default Sidebar