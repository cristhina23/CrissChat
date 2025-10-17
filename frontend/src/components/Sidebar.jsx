import React, { useContext, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import "../styles/Sidebar.css";
import { addNotifications, resetNotifications } from "../features/userSlice";

function Sidebar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    socket,
    setMembers,
    members,
    setRooms,
    rooms,
    setCurrentRoom,
    setPrivateMemberMsg,
    currentRoom = 'general',
    privateMemberMsg,
  } = useContext(AppContext);

  if (!user?.newMessages) user.newMessages = {};

  // 🔹 Entrar a un room
  function joinRoom(room, isPublic = true) {
    if (!user) return alert("Please login");

    socket.emit("join_room", room);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }

    // Resetear notificaciones al entrar a una room
    dispatch(resetNotifications(room));
  }

  // 🔹 Obtener rooms desde el backend
  function getRooms() {
    fetch(`${import.meta.env.VITE_API_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
      });
  }

  // 🔹 Ordenar IDs para chats privados
  function orderIds(id1, id2) {
    return id1 > id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
  }

  // 🔹 Iniciar chat privado
  function handlePrivateMessage(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

useEffect(() => {
  if (!socket || !user) return;

  // Unirse a la sala actual
  socket.emit("join_room", currentRoom);
  socket.emit("new_user", user);

  getRooms(); // cargar lista de rooms una vez

  socket.on("new_user", (members) => {
    setMembers(members);
  });

  socket.off("notifications").on("notifications", (room) => {
    if (room !== currentRoom) {
      dispatch(addNotifications(room));
    }
  });

  return () => {
    socket.off("notifications");
    socket.off("new_user");
  };
}, [socket, user, currentRoom]);



  if (!user) return null;

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup className="mb-3">
        {rooms.map((room, idx) => (
          <ListGroup.Item
            key={room} // ✅ usar room como key única
            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
            onClick={() => joinRoom(room)}
            active={room === currentRoom}
          >
            {room}
            {user.newMessages[room] && currentRoom !== room && (
              <span className="badge rounded-pill bg-primary">
                {user.newMessages[room]}
              </span>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h2>Members</h2>
      <ListGroup>
        {members.map((member) => (
          <ListGroup.Item
            key={member._id}
            style={{ cursor: "pointer" }}
            active={privateMemberMsg?._id === member._id}
            onClick={() => handlePrivateMessage(member)}
            disabled={member._id === user._id}
          >
            {member.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

export default Sidebar;
