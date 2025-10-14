import React, { useContext, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

function Sidebar() {
  const user = useSelector((state) => state.user);
  const {
    socket,
    setMembers,
    members,
    setRooms,
    setCurrentRoom,
    rooms,
  } = useContext(AppContext);

  // Función para obtener las salas
  const getRooms = () => {
    fetch('http://localhost:5000/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error('Error fetching rooms:', err));
  };

  useEffect(() => {
    if (!user) return;

    // Unirse automáticamente a 'general'
    setCurrentRoom('general');
    getRooms();
    socket.emit('join_room', 'general');
    socket.emit('new_user'); // Notificar backend de nuevo usuario

    // Escuchar miembros actualizados
    socket.on('new_user', (payload) => {
      console.log('Members from server:', payload); // Para debug
      setMembers(payload);
    });

    // Limpieza al desmontar
    return () => {
      socket.off('new_user');
    };
  }, [user, socket, setMembers, setCurrentRoom, setRooms]);

  if (!user) return null;

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup className="mb-3">
        {rooms.map((room, index) => (
          <ListGroup.Item key={index}>{room}</ListGroup.Item>
        ))}
      </ListGroup>

      <h2>Members</h2>
      <ListGroup>
        {members.map((member) => (
          <ListGroup.Item key={member._id} style={{ cursor: 'pointer' }}>
            {member.name || member.email} {/* Si name no existe, mostrar email */}
            {member._id === user.id && ' (You)'}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

export default Sidebar;
