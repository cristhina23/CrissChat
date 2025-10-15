// src/components/Sidebar.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import "../styles/Sidebar.css";
import { addNotifications, resetNotifications } from "../features/userSlice";

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
    privateMemberMsg,
    messages = [],
  } = useContext(AppContext);

  const dispatch = useDispatch();
  const [selectedMember, setSelectedMember] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  function handleViewProfile(member) {
    setSelectedMember(member);
    setShowProfile(true);
  }

  // Crear ID único para cada chat privado
  function orderIds(id1, id2) {
    return id1 > id2 ? id1 + "-" + id2 : id2 + "-" + id1;
  }

  // Unirse a sala (pública o privada)
  function joinRoom(room, isPublic = true) {
    if (!user) return alert("Please login");

    socket.emit("join_room", room, isPublic);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }

    // limpiar notificaciones de esa sala en redux
    dispatch(resetNotifications(room));
  }

  // Obtener lista de salas públicas
  const getRooms = () => {
    fetch("http://localhost:5000/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));
  };

  // Escuchar usuarios conectados y notificaciones
  useEffect(() => {
    if (!user || !socket) return;

    // Solo establecer "general" al inicio
    if (!currentRoom) {
      setCurrentRoom("general");
      socket.emit("join_room", "general", true);
    }

    getRooms();
    socket.emit("new_user");

    socket.on("new_user", (payload) => {
      setMembers(payload);
    });

    // 🔥 Escuchar evento de notificación desde el servidor
    socket.off("notifications").on("notifications", (room) => {
      console.log("🔔 Notification received for room:", room);
      // Solo sumar notificación si no estamos en esa sala actualmente
      if (room !== currentRoom) {
        dispatch(addNotifications(room));
      }
    });

    return () => {
      socket.off("new_user");
      socket.off("notifications");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, socket, currentRoom]);

  // Ordenar miembros (último mensaje arriba)
  const sortedMembers = useMemo(() => {
    if (!Array.isArray(members) || !user) return members;

    const me = members.find((m) => String(m._id) === String(user.id));
    const otherMembers = members.filter((m) => String(m._id) !== String(user.id));

    const membersWithLastMsg = otherMembers.map((member) => {
      const msgs = messages.filter(
        (msg) =>
          (msg.from === user.id && msg.to === member._id) ||
          (msg.from === member._id && msg.to === user.id)
      );
      const lastMsgTime =
        msgs.length > 0
          ? Math.max(
              ...msgs.map((m) =>
                m.createdAt ? new Date(m.createdAt).getTime() : 0
              )
            )
          : 0;
      return { ...member, lastMsgTime };
    });

    membersWithLastMsg.sort((a, b) => b.lastMsgTime - a.lastMsgTime);

    return me ? [me, ...membersWithLastMsg] : membersWithLastMsg;
  }, [members, user, messages]);

  // Abrir chat privado
  function handlePrivateMemberMsg(member) {
    if (!user) return;
    const roomId = orderIds(user.id, member._id);
    setPrivateMemberMsg(member);
    joinRoom(roomId, false);
    // limpiar notificaciones de esta conversación
    dispatch(resetNotifications(roomId));
  }

  if (!user) return null;

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup className="mb-3">
        {rooms.map((room, index) => (
          <ListGroup.Item
            key={index}
            onClick={() => joinRoom(room, true)}
            active={room === currentRoom}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <span>{room}</span>
            {/* 🔔 Mostrar badge solo si hay notificaciones pendientes */}
            {user?.newMessages?.[room] && currentRoom !== room && (
              <span className="badge rounded-pill bg-primary ms-2">
                {user.newMessages[room]}
              </span>
            )}
            
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h2>Members</h2>
      <ListGroup>
        {sortedMembers.map((member) => (
          <ListGroup.Item
            key={member._id}
            className="d-flex justify-content-between align-items-center"
            active={privateMemberMsg && String(privateMemberMsg._id) === String(member._id)}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={String(member._id) === String(user.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              {member.picture && (
                <img
                  src={member.picture}
                  alt={member.name}
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(member);
                  }}
                />
              )}
              <span>{member.name || member.email}</span>
              {String(member._id) === String(user.id) && " (You)"}
            </div>

            {/* 🔔 Notificaciones para chats privados */}
            {user?.newMessages?.[orderIds(user.id, member._id)] &&
              privateMemberMsg?._id !== member._id && (
                <span className="badge rounded-pill bg-danger">
                  {user.newMessages[orderIds(user.id, member._id)]}
                </span>
              )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal de perfil */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <div className="text-center">
              <img
                src={selectedMember.picture}
                alt={selectedMember.name}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "10px",
                }}
              />
              <h5>{selectedMember.name}</h5>
              <p>Status: {selectedMember.status || "Offline"}</p>
              <p>
                Member since:{" "}
                {selectedMember.createdAt
                  ? new Date(selectedMember.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Sidebar;
