import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import '../styles/Home.css'
import HomeBg from '../assets/home-bg.png'

function Home() {
  return (
    <Row>
      <Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center'>
        <div className='home__content'>
          <h1 className='home__title'>Welcome to 
            <span className='cool-gradient-text'> CrissChat</span>
            </h1>
          <p className='home__subtitle'>Chat with your friends and family anywhere in the world</p>
          <LinkContainer to="/chat">
            <Button className='btn btn-style-secondary'>Get Started <i className='fas fa-comments home-message-icon'></i></Button>
            
          </LinkContainer>
        </div>
      </Col>
      <Col md={6} className='home__bg'> 
        <img src={HomeBg} alt="" />
      </Col>
    </Row>
  )
}

export default Home