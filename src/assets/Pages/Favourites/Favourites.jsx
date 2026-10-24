import { useContext } from "react";
import { NavLink } from "react-router";
import { Badge, Button, Card, Row, Spinner } from "react-bootstrap";
import { FiHeart } from "react-icons/fi";
import ProfileLayout from "../../Layouts/ProfileLayout";
import ProductsCardItem from "../AllCategoriesPage/ProductsCardItem";
import { AuthContext } from "../../Contexts/AuthContext";
import { useFavourite } from "../../Contexts/FavouriteContext";

const Favourites = () => {
  const { token } = useContext(AuthContext);
  const { favourites, favouritesCount, loading } = useFavourite();

  if (!token) {
    return (
      <ProfileLayout>
        <div className="p-4 text-center">
          You are not authorized to view this content
          <div className="mt-3">
            Please <NavLink to="/log-in">Log In</NavLink>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <Card className="border-0 shadow-sm rounded-3">
        <Card.Body className="p-4">
          <Card.Title
            as="h5"
            className="fw-bold d-flex align-items-center gap-2 mb-1"
          >
            Favourite Products
            {favouritesCount > 0 && (
              <Badge pill bg="danger" className="fs-6 fw-semibold">
                {favouritesCount}
              </Badge>
            )}
          </Card.Title>
          <Card.Text className="text-muted small mb-4">
            Products you saved to come back to later.
          </Card.Text>

          {loading && favouritesCount === 0 ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : favouritesCount === 0 ? (
            <div className="text-center text-muted py-5">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger mb-4"
                style={{ width: "96px", height: "96px" }}
              >
                <FiHeart size={40} />
              </span>
              <h5 className="fw-bold text-body mb-2">No favourites yet</h5>
              <p className="small mb-4">
                Tap the heart on any product to save it here.
              </p>
              <Button
                as={NavLink}
                to="/product-categories"
                variant="danger"
                className="px-4 py-2 rounded-pill border-0"
                style={{
                  backgroundImage: "linear-gradient(to right, #F0345D, #DDA3B0)",
                }}
              >
                Start shopping
              </Button>
            </div>
          ) : (
            <Row>
              {favourites.map((fav) => {
                const product = fav.product ?? fav;
                return <ProductsCardItem key={fav.id} item={product} />;
              })}
            </Row>
          )}
        </Card.Body>
      </Card>
    </ProfileLayout>
  );
};

export default Favourites;