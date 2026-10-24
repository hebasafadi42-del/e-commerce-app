import { Container, Row, Col } from "react-bootstrap";
import WepNavbar from "../components/Header/WepNavbar";



const CheckOutLayout = ({ left, children }) => {
  return (
    <div className="co-root">
      <WepNavbar />

      <Container fluid className="p-0">
        <Row className="g-0">
          <Col md={6} xs={12} className="login-bg co-layout-left">
            {left}
          </Col>

          <Col md={6} xs={12} className="co-layout-right">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckOutLayout;