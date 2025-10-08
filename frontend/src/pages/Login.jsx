import React from "react";
import { Col, Container, Row, Button, Form, Image } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import "../styles/Login.css";
import LiginImg from "../assets/login-img.png";

function Login() {
  return (
    <div className="login__page" aria-labelledby="login-title">
      <Container>
        <Row className="login__wrapper align-items-center">
          <Col
            md={5}
            className="login__content d-none d-md-flex flex-column justify-content-center pe-4"
            aria-hidden="false"
          >
            <h1 id="login-title" className="gradient__text mb-3">
              Welcome to CrissChat
            </h1>
            <p className="text-muted login__subtitle">
              Connect, share, and stay close to the people who matter most.
            </p>

            <div className="login__visual mt-4">
              <Image
                src={LiginImg}
                alt="Illustration of chat bubbles"
                loading="lazy"
                className="login-image"
              />
            </div>
          </Col>

          
          <Col
            xs={12}
            md={7}
            className="d-flex align-items-center justify-content-center"
          >
            <Form
              className="login__form"
              style={{ width: "100%", maxWidth: 480 }}
              aria-label="login form"
            >
              <h2 className="text-center gradient__text mb-4">Log in</h2>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="w500">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email@example.com"
                  aria-required="true"
                  aria-label="email"
                />
                <Form.Text className="text-muted">
                  Please enter a valid email.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className="w500">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="******"
                  aria-required="true"
                  aria-label="password"
                />
                <Form.Text className="text-muted">
                  The password must be at least 8 characters.
                </Form.Text>
              </Form.Group>

              <div className="login__options d-flex justify-content-between align-items-center mb-3">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="form-check-input custom-checkbox"
                    aria-label="Remember me"
                  />
                  <label className="form-check-label mb-0" htmlFor="remember">Remember me</label>
                </div>

                <a href="/forgot" className="forgot-link" aria-label="forgot password">Forgot password?</a>
              </div>


              <Button
                className="btn-primary-gradient w-100 mb-2"
                type="submit"
                aria-label="log in"
              >
                Log in
              </Button>

              <LinkContainer to="/register">
                <a
                  className="btn btn-link w-100 text-decoration-none fw-semibold text-primary"
                  aria-label="create account"
                >
                  Create account
                </a>
              </LinkContainer>

            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
