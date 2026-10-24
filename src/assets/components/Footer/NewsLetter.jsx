import React, { useState } from "react";
import { InputGroup, Form, Container, Row, Col } from "react-bootstrap";
import { CiMail } from "react-icons/ci";

const NewsLetter = () => {
  const [email, setemail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      alert("Please enter your email address");
    } else {
      // console.log("Email", email);
      alert("Thank you for subscribing");
      setemail("");
    }
  };
  return (
    <>
      <Container>
        <Row>
          <Col lg={{ span: 4, offset: 4 }}>
            <div className="text-center py-5">
              <h4 >Subscribe on our newsletter</h4>
              <p className="text-muted">
                Get daily news on upcoming offers from many suppliers all over
                the world
              </p>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <InputGroup.Text className=" border-end-0 p-2 text-muted">
                    <CiMail className="me-2 " size={20} />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    className="border-start-0 ps-2"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                  <button
                    className="btn text-white bg-gradientButton border-start-0"
                    type="submit"
                  >
                    Subscribe
                  </button>
                </InputGroup>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NewsLetter;
