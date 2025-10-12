import React, { useState } from 'react'
import { Col, Container, Row, Button, Form, Image } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import SignupImg from "../assets/signup-img.png";
import DefaultImg from "../assets/default-profile-img.png";
import { useSignupUserMutation } from '../services/appApi';
import "../styles/Login.css";


 

 
function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [signupUser, { isLoading, error }] = useSignupUserMutation();

  const validateImage = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "crisschat");
    try {
      setUploadingImage(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/db3u9fjoj/image/upload", {
          method: "post",
          body: data
        })
      const urlData = await res.json();
      setUploadingImage(false);
      return urlData.url;
    } catch (error) {
      setUploadingImage(false);
      console.log(error);
    }
  }
 
   const handleSignup = async (e) => {
    // saving the image
    e.preventDefault();
    if (!image) {
      return alert("Please select an image");
    }
    const url = await uploadImage(image);
    console.log(url);

    // signup the user
    signupUser({ email, password, confirmPassword, picture: url }).then(({ data }) => {
      if (data) {
        console.log(data);
      }
    })

  }


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
              onSubmit={handleSignup}
            >
              <h1 className="text-center gradient__text mb-4">Sign up</h1>
              <div className="signup__profile-picture">
                 <img src={ imagePreview || DefaultImg} alt="" className="profile-picture" />
                 <label htmlFor="image-upload" className='image-upload-label'>
                  <i className='fas fa-plus-circle add-picture-icon'></i>
                 </label>
                 <input type="file" id="image-upload" hidden accept='image/png, image/jpeg ' onChange={validateImage} />
              </div>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="w500">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email@example.com"
                  aria-required="true"
                  aria-label="email"
                  value={email}
                  required
                 onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
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
                  aria-label="confirm-password"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <div className="text-center mt-3">
                <p className="mb-1">Already have an account? <a href='/login' className='w500'>
                     Log in
                  </a></p>
                
                  
                
              </div>
               
              </div>


              <Button
                className="btn-primary-gradient w-100 mb-2"
                type="submit"
                aria-label="log in"
              >
                {uploadingImage ? "Uploading..." : "Sign up"}
              </Button>

              

            </Form>
          </Col>

          <Col
            md={5}
            className="login__content d-none d-md-flex flex-column justify-content-center pe-4"
            aria-hidden="false"
          >
            <h2 id="login-title" className="gradient__text mb-3">
              Welcome to CrissChat
            </h2>
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