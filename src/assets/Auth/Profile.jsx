import { useContext, useEffect, useRef, useState } from "react";
import ProfileLayout from "../Layouts/ProfileLayout";
import { AuthContext } from "../Contexts/AuthContext";
import { NavLink } from "react-router";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  Row,
  Spinner,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { API_Config } from "../Config/API-Config";
import {
  FiCamera,
  FiChevronRight,
  FiHeart,
  FiPlusCircle,
  FiMail,
  FiShoppingBag,
  FiFileText,
  FiShield,
} from "react-icons/fi";

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#E9E9E9"/>
      <circle cx="50" cy="38" r="18" fill="#BDBDBD"/>
      <path d="M14 92c4-22 20-32 36-32s32 10 36 32z" fill="#BDBDBD"/>
    </svg>`,
  );

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; 

const settingsPages = [
  { id: 1, title: "Favourite Products", path: "/favourites", icon: FiHeart },
  { id: 2, title: "Add Product", path: "/add-product", icon: FiPlusCircle },
  { id: 3, title: "Contact us page", path: "/contact-us", icon: FiMail },
  { id: 4, title: "My Orders", path: "/orders", icon: FiShoppingBag },
  {
    id: 5,
    title: "Terms and condition",
    path: "/terms-and-conditions",
    icon: FiFileText,
  },
  {
    id: 6,
    title: "Privacy Policy page",
    path: "/privacy-policy",
    icon: FiShield,
  },
];

const Profile = () => {
  const { user, token, logout, saveUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.PROFILE}`;

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setErrorMsg(null);

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          throw new Error("Session expired. Please log in again.");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch profile data");
        }
        return res.json();
      })
      .then((data) => {
        const profile = data?.data || data;
        setProfileData(profile);
        setName(profile?.name || user?.name || "");
        setEmail(profile?.email || user?.email || "");
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [token, url]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentName = profileData?.name ?? user?.name ?? "";
  const currentEmail = profileData?.email ?? user?.email ?? "";
  const nameChanged = name.trim() !== currentName;
  const emailChanged = email.trim() !== currentEmail;
  const hasChanges = nameChanged || emailChanged || !!imageFile;

  const resetImageInput = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMsg("Image must be less than 2MB");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDiscard = () => {
    setName(currentName);
    setEmail(currentEmail);
    resetImageInput();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setSaving(true);

    const newName = name.trim();
    const newEmail = email.trim();

    const formData = new FormData();
    if (nameChanged) formData.append("name", newName);
    if (emailChanged) formData.append("email", newEmail);
    if (imageFile) formData.append("image", imageFile);

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          throw new Error("Session expired. Please log in again.");
        }
        if (!res.ok) {
          return res
            .json()
            .catch(() => ({}))
            .then((serverError) => {
              throw new Error(serverError.message || "Something went wrong");
            });
        }
        return res.json();
      })
      .then((data) => {
        const updatedProfile = data?.data ?? {};
        const changes = {
          ...(nameChanged && { name: newName }),
          ...(emailChanged && { email: newEmail }),
        };

        setProfileData((prev) => ({ ...prev, ...changes, ...updatedProfile }));
        saveUser({
          ...user,
          ...changes,
          ...(updatedProfile.image && { image: updatedProfile.image }),
        });

        resetImageInput();
        setSuccessMsg("Profile updated successfully");
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setSaving(false));
  };

  if (!token) {
    return (
      <ProfileLayout>
        <Container>
          <Row>
            <Col>
              <div className="p-4 text-center">
                You are not authorized to view this content
                <br />
                <div className="d-flex justify-content-center gap-3 mt-3">
                  Please <NavLink to="/log-in">Log In</NavLink>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </ProfileLayout>
    );
  }

  if (loading) {
    return (
      <ProfileLayout>
        <div className="d-flex justify-content-center align-items-center p-5">
          <Spinner animation="border" variant="danger" />
        </div>
      </ProfileLayout>
    );
  }

  const displayName = profileData?.name || user?.name || "User Name";
  const displayEmail = profileData?.email || user?.email || "email@example.com";
  const avatarSrc =
    previewUrl || profileData?.image || user?.image || DEFAULT_AVATAR;

  return (
    <ProfileLayout>
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 ">
        <div
          style={{
            height: "110px",
            backgroundImage: "linear-gradient(to right, #F0345D, #DDA3B0)",
          }}
        />
        <Card.Body className="pt-0 px-4 pb-4">
          <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-end gap-3 text-center text-sm-start">
            <div
              className="position-relative flex-shrink-0"
              style={{ marginTop: "-54px" }}
            >
              <Image
                src={avatarSrc}
                alt={displayName}
                roundedCircle
                width={108}
                height={108}
                className="object-fit-cover bg-white border border-4 border-white shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <Button
                variant="danger"
                className="position-absolute bottom-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center border border-2 border-white"
                style={{ width: "34px", height: "34px" }}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                title="Change photo"
              >
                <FiCamera />
              </Button>
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </div>

            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <h5 className="fw-bold mb-1 text-break">{displayName}</h5>
              <p className="text-muted mb-0 text-break">{displayEmail}</p>
              {imageFile && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 mt-1 text-danger"
                  onClick={resetImageInput}
                >
                  Remove new photo
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4">
          
          

          <Form onSubmit={handleFormSubmit}>
            <Row className="g-4">
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label className="fw-semibold small">Name</Form.Label>
                  <Form.Control
                    className="input-bgcolor border-0 py-3 rounded-3"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label className="fw-semibold small">Email</Form.Label>
                  <Form.Control
                    className="input-bgcolor border-0 py-3 rounded-3"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Stack
              direction="horizontal"
              gap={3}
              className="mt-4 flex-column flex-sm-row align-items-stretch align-items-sm-center"
            >
              <Button
                variant="danger"
                type="submit"
                className="px-4 py-2 rounded-3"
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>

              {hasChanges && !saving && (
                <Button variant="link" className="text-muted" onClick={handleDiscard}>
                  Discard
                </Button>
              )}
            </Stack>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header as="h6" className=" fw-bold border-0 px-4 pt-4 pb-2">
          Settings
        </Card.Header>
        <ListGroup variant="flush">
          {settingsPages.map(({ id, title, path, icon: Icon }) => (
            <ListGroup.Item
              key={id}
              action
              as={NavLink}
              to={path}
              className="d-flex align-items-center gap-3 px-4 py-3"
            >
              <span
                className="d-flex align-items-center justify-content-center rounded-3 bg-danger-subtle text-danger flex-shrink-0"
                style={{ width: "40px", height: "40px" }}
              >
                <Icon size={19} />
              </span>
              <span className="flex-grow-1 fw-medium">{title}</span>
              <FiChevronRight className="text-muted" />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <ToastContainer
        position="top-center"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          show={!!errorMsg}
          onClose={() => setErrorMsg(null)}
          delay={4000}
          autohide
          bg="warning"
          className="border-0 shadow"
        >
          <Toast.Body className="d-flex justify-content-between align-items-center small py-2 px-3">
            <span>{errorMsg}</span>
            <button
              type="button"
              className="btn-close ms-2"
              aria-label="Close"
              onClick={() => setErrorMsg(null)}
            ></button>
          </Toast.Body>
        </Toast>

        <Toast
          show={!!successMsg}
          onClose={() => setSuccessMsg(null)}
          delay={3000}
          autohide
          bg="success"
          className="text-white border-0 shadow"
        >
          <Toast.Body className="d-flex justify-content-between align-items-center small py-2 px-3">
            <span>{successMsg}</span>
            <button
              type="button"
              className="btn-close btn-close-white ms-2"
              aria-label="Close"
              onClick={() => setSuccessMsg(null)}
            ></button>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ProfileLayout>
  );
};

export default Profile;