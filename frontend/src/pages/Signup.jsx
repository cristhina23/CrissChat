import React from 'react'
import { Col, Container, Row, Button, Form, Image } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import SignupImg from "../assets/signup-img.png";
import "../styles/Login.css";

function Signup() {
  return (
    <div className="signup__page" aria-labelledby="signup-title">
      <Container>
        <Row className="login__wrapper align-items-center">
      
          <Col
            xs={12}
            md={7}
            className="d-flex align-items-center justify-content-center"
          >
            <Form
              className="signup__form"
              style={{ width: "100%", maxWidth: 480 }}
              aria-label="login form"
            >
              <h2 className="text-center gradient__text mb-4">Sign up</h2>

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
              <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                <Form.Label className="w500"> Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="******"
                  aria-required="true"
                  aria-label="password"
                />
                
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

               
              </div>


              <Button
                className="btn-primary-gradient w-100 mb-2"
                type="submit"
                aria-label="log in"
              >
                Log in
              </Button>

              <div className="text-center mt-3">
                <p className="mb-1">Already have an account?</p>
                <LinkContainer to="/login">
                  <a className='w500'>
                    Log in
                  </a>
                </LinkContainer>
              </div>

            </Form>
          </Col>

          <Col
            md={5}
            className="login__content d-none d-md-flex flex-column justify-content-center pe-4"
            aria-hidden="false"
          >
            <h1 id="login-title" className="gradient__text mb-3">
              Welcome to CrissChat
            </h1>
            <p className="text-muted login__subtitle">
              Connect with friends and share your best moments in real time.
            </p>

            <div className="login__visual mt-4">
              <Image
                src={SignupImg}
                alt="Illustration of chat bubbles"
                loading="lazy"
                className="signup-image"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Signup