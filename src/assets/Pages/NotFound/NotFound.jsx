import { Container } from "react-bootstrap";
import { Link } from "react-router";

const NotFound = () => (
  <Container className="text-center py-5 my-5">
    <h1 className="fw-bold">Page not found</h1>
    <p className="text-muted mb-4">The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-danger">
      Back to home
    </Link>
  </Container>
);

export default NotFound;
