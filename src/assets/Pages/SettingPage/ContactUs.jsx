import { useState } from 'react';
import ProfileLayout from '../../Layouts/ProfileLayout';
import { Row, Col, Spinner, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { IoMdArrowDropleft } from 'react-icons/io';
import { MdOutlineMessage } from 'react-icons/md';
import { IoMailOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import {API_Config} from '../../Config/API-Config';

const ContactUs = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.CONTACT}`;

    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type: 'EMAIL',
        email: email.trim(),
        message: message.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res
            .json()
            .catch(() => ({}))
            .then((serverError) => {
              throw new Error(serverError.message || 'Something went wrong');
            });
        }
        return res.json();
      })
      .then((data) => {
          console.log('Success response:', data);

        setSuccessMsg('Your message has been sent successfully.');
        setEmail('');
        setMessage('');
      })
      .catch((err) => {
        setErrorMsg(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ProfileLayout>
      <Row>
        <Col
          lg={12}
          style={{
            height: '80px',
            backgroundImage: 'linear-gradient(to right, #F0345D, #DDA3B0)',
          }}
          className="rounded-2 d-flex align-items-center px-4 text-white "
        >
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="link"
              className="p-0 text-white text-decoration-none border-0 d-flex align-items-center"
              onClick={() => navigate(-1)}
            >
              <IoMdArrowDropleft style={{ fontSize: '40px', color: '#FFFFFF' }} />
            </Button>
            <h4 className="m-0 fw-semibold">Contact Us</h4>
          </div>
        </Col>

        <Col lg={12} className="p-4">
          {errorMsg && (
            <Alert variant="warning" dismissible onClose={() => setErrorMsg(null)}>
              <strong>Error: </strong>
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>
              {successMsg}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="w-100 p-4">
            <Form.Group className="mb-3">
              <InputGroup className='border rounded-2'>
                <Form.Control
                  className="py-3 border-0 form-input"
                  type="email"
                  placeholder="Email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <InputGroup.Text className="border-0">
                  <IoMailOutline style={{ color: '#F0345D' }} className="fs-3" />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="my-4">
              <InputGroup className='border rounded-2 '>
                <Form.Control
                  as="textarea"
                  rows={10}
                   style={{ resize: 'none' }}
                  className="py-3 border-0 form-input "
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={65000}
                  disabled={loading}
                  required
                />
                <InputGroup.Text className=" border-0 align-items-start pt-3">
                  <MdOutlineMessage style={{ color: '#F0345D' }} className="fs-3" />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              className="border-0 px-5 py-3 w-100"
              style={{ backgroundColor: '#F0345D' }}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </ProfileLayout>
  );
};

export default ContactUs;