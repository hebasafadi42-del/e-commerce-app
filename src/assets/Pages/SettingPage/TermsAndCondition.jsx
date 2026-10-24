import { useEffect, useState } from 'react';
import ProfileLayout from '../../Layouts/ProfileLayout';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { IoMdArrowDropleft } from 'react-icons/io';
import { useNavigate } from 'react-router';

import settingsData from '../../Json/terms.json';

const TermsAndCondition = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (settingsData && settingsData.terms && settingsData.terms.length > 0) {
        setTerms(settingsData.terms);
      } else {
        setErrorMsg('No terms and conditions found.');
      }
    } catch (err) {
      console.error('Error loading terms:', err);
      setErrorMsg('Failed to load terms and conditions.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProfileLayout>
      <Row >
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
            <h4 className="m-0 fw-semibold">Terms and Conditions</h4>
          </div>
        </Col>

        <Col lg={12} className="p-5">
          {loading && (
            <div className="text-center my-5">
              <Spinner animation="border" style={{ color: '#F0345D' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2 text-muted">Loading terms and conditions...</p>
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

          {!loading && !errorMsg && terms.length === 0 && (
            <Alert variant="warning" className="text-center">
              No terms and conditions available at the moment.
            </Alert>
          )}

          {!loading && !errorMsg && terms.length > 0 && (
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
                {terms.map((item) => (
                  <Col lg={12} key={item.id} className="px-0">
                    <div>
                      <h5 style={{ color: '#F0345D' }} className="mb-2 fw-bold">
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

export default TermsAndCondition;