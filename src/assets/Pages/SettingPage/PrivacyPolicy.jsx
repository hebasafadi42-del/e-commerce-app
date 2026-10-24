import { useEffect, useState } from 'react';
import ProfileLayout from '../../Layouts/ProfileLayout';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { IoMdArrowDropleft } from 'react-icons/io';
import { useNavigate } from 'react-router';

import settingsData from '../../Json/terms.json';

const PrivacyPolicy = () => {
  const [policy, setPolicy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
    
      if (settingsData && settingsData.privacy && settingsData.privacy.length > 0) {
        setPolicy(settingsData.privacy);
      } else {
        setErrorMsg('No Privacy Policy found.');
      }
    } catch (err) {
      console.error('Error loading Privacy Policy:', err);
      setErrorMsg('Failed to load Privacy Policy.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProfileLayout>
      <Row className="m-0">
        <Col
          lg={12}
          style={{
            height: '80px',
            backgroundImage: 'linear-gradient(to right, #F0345D, #DDA3B0)',
          }}
          className="rounded-2 d-flex align-items-center px-4 text-white"
        >
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="link"
              className="p-0 text-white text-decoration-none border-0 d-flex align-items-center"
              onClick={() => navigate(-1)}
            >
              <IoMdArrowDropleft style={{ fontSize: '40px', color: '#FFFFFF' }} />
            </Button>
            <h4 className="m-0 fw-semibold">Privacy Policy</h4>
          </div>
        </Col>

        <Col lg={12} className="p-5">
          {loading && (
            <div className="text-center my-5">
              <Spinner animation="border" style={{ color: '#F0345D' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2 text-muted">Loading Privacy Policy...</p>
            </div>
          )}

          {!loading && errorMsg && (
            <Alert variant="danger" className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Error: </strong>
                {errorMsg}
              </div>
            </Alert>
          )}

          {!loading && !errorMsg && policy.length === 0 && (
            <Alert variant="warning" className="text-center">
              No Privacy Policy available at the moment.
            </Alert>
          )}

          {!loading && !errorMsg && policy.length > 0 && (
            <div
              style={{
                maxHeight: '450px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '10px',
              }}
              className="custom-scrollbar"
            >
              <Row className="g-4 m-0">
                
                {policy.map((item) => (
                  <Col lg={12} key={item.id} className="px-0">
                    <div>
                      <h5 style={{ color: '#F0345D' }} className="mb-2 ">
                        {item.title}
                      </h5>
                      <p className="text-muted lh-base">{item.content}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </ProfileLayout>
  );
};

export default PrivacyPolicy;