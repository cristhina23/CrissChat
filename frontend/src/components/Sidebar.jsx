import React, { useContext, useEffect, useMemo } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import '../styles/Sidebar.css'

function Sidebar() {
  const user = useSelector((state) => state.user);
  const {
    socket,
    setMembers,
    members = [],
    setRooms,
    setCurrentRoom,
    setPrivateMemberMsg,
    rooms = [],
    currentRoom,
    privateMemberMessage,
  } = useContext(AppContext);

  function joinRoom(room, isPublic = true) {
    if (!user) return alert("Please login");

    socket.emit("join_room", room);
    setCurrentRoom(room);

    if (isPublic) setPrivateMemberMsg(null);
  }

  const getRooms = () => {
    fetch("http://localhost:5000/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));
  };

  useEffect(() => {
    if (!user) return;

    // Join default room
    setCurrentRoom("general");
    getRooms();
    socket.emit("join_room", "general");
    socket.emit("new_user"); // notify backend

    // listen for new users list
    socket.on("new_user", (payload) => {
      console.log("Members from server:", payload);
      setMembers(payload);
    });

    return () => socket.off("new_user");
  }, [user, socket, setMembers, setCurrentRoom, setRooms]);

  // Ordenar miembros (el usuario actual primero)
  const sortedMembers = useMemo(() => {
    if (!Array.isArray(members) || !user) return members;

    const me = members.find((m) => String(m._id) === String(user.id));
    if (!me) return [...members];

    return [me, ...members.filter((m) => String(m._id) !== String(user.id))];
  }, [members, user]);

  function orderIds(id1, id2) {
    return id1 > id2 ? id1 + "-" + id2 : id2 + "-" + id1;
  }

  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user.id, member._id);
    joinRoom(roomId, false);
  }

  if (!user) return null;

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup className="mb-3">
        {rooms.map((room, index) => (
          <ListGroup.Item
            key={index}
            onClick={() => joinRoom(room)}
            active={room === currentRoom}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <span>{room}</span>
            <i className="fa-solid fa-square-plus plus-icon"></i>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h2>Members</h2>
      <ListGroup>
        {sortedMembers.map((member) => (
          <ListGroup.Item
            key={member._id}
            style={{ cursor: "pointer" }}
            active={
              privateMemberMessage &&
              String(privateMemberMessage._id) === String(member._id)
            }
            onClick={() => handlePrivateMemberMsg(member)}
            disable={String(member._id) === String(user.id)}
          >
            {member.name || member.email}
            {String(member._id) === String(user.id) && " (You)"}
          </ListGroup.Item>
        ))}
      </ListGroup>

    </>
  );
}

export default Sidebar;
