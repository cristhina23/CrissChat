import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import "../styles/MessajeForm.css";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";

function MessageForm() {
  const user = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const { socket, currentRoom, messages, setMessages } = useContext(AppContext);
  

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  }

  const todayDate = getFormattedDate();

  useEffect(() => {
    if (!socket) return;

    // ✅ Escuchar mensajes de sala
    socket.off("room_messages").on("room_messages", (roomMessages) => {
      // El servidor envía solo mensajes del room actual
      if (Array.isArray(roomMessages)) {
        setMessages(roomMessages);
      } else {
        console.warn("Formato inesperado en room_messages:", roomMessages);
      }
    });

    return () => socket.off("room_messages");
  }, [socket, currentRoom, setMessages]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    if (!user || !user.id) return alert("User not found or not logged in");

    const date = new Date();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const time = date.getHours() + ":" + minutes;

    socket.emit("message_room", currentRoom, message, user.id, time, todayDate);
    setMessage("");
  }

  return (
    <div className="container__chat">
      <div className="message__output">
        {!user && (
          <div className="alert alert-danger">
            Login to start a conversation
          </div>
        )}

        {user &&
          Array.isArray(messages) &&
          messages.map(({ _id: date, messagesByDate }, idx) => (
            <div key={idx}>
              <p className="alert alert-info text-center message_date_indicator">
                {date}
              </p>

              {Array.isArray(messagesByDate) &&
                messagesByDate.map(({ content, time, from: sender }, msgidx) => (
                  <div
                    key={msgidx}
                    className={
                      String(sender) === String(user.id)
                        ? "message message_sent"
                        : "message message_received"
                    }
                  >
                    <p>{content}</p>
                    <small className="message-time">{time}</small>
                  </div>
                ))}
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
              style={{
                width: "100%",
                backgroundColor: "var(--color-primary)",
              }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default MessageForm;
