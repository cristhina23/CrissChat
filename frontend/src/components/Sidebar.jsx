import React, { useContext } from 'react'
import { ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {AppContext } from '../context/appContext';

function Sidebar() {
  const user = useSelector((state) => state.user);
  const { socket, setMembers, members, setRooms, setCurrentRoom, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom  } = useContext(AppContext);
  socket.off('new_user').on('new_user', (payload) => {
    console.log(payload);
  });

  if(!user) return <></>;

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup>
        {rooms.map((room, index) => (
          <ListGroup.Item key={index}>{room}</ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
      {members.map((member) => (
        <ListGroup.Item key={member.id} style={{ cursor: 'pointer'}}>
          {member.name}
          {member.id === user.id && ' (You)'}
        </ListGroup.Item>
      ))}
    </>
  )
}

export default Sidebar