import { useContext, useState } from "react";
import LogInUpLayout from "../Layouts/LogInUpLayout";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AiOutlinePhone } from "react-icons/ai";
import { API_Config } from "../Config/API-Config";
import { useNavigate } from "react-router";
import { AuthContext } from "../../assets/Contexts/AuthContext";

const LogIn = () => {
  const [phone, setphone] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const { saveUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, "").slice(0, 10);
    setphone(onlyNums);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.LOGIN}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        phone: phone,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || "Something went wrong");
          });
        }
        return res.json();
      })
      .then(() => {
        saveUser({ phone });
        navigateTo("/verify");
      })
      .catch((err) => {
        setErrorMsg(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <LogInUpLayout>
        <div className="login-card  p-5 d-flex flex-column  align-items-lg-start align-items-center  justify-content-center mt-5">
          <h3 className="my-3">Welcome!</h3>
          <p className="text-muted ">Please Log in to continue</p>

          <Form onSubmit={handleSubmit} className="w-75 ">
            <Form.Group className="mt-4">
              <InputGroup
                className={`border rounded-3 overflow-hidden ${errorMsg ? "border-danger" : ""}`}
              >
                <Form.Control
                  className="py-3 border-0 form-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Add number"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
                <InputGroup.Text className="bg-white border-0">
                  <AiOutlinePhone
                    style={{ color: "#F0345D" }}
                    className="fs-3"
                  />
                </InputGroup.Text>
              </InputGroup>

              {phone.length > 0 && phone.length < 10 && (
                <div className="text-warning mt-1 fs-6 ps-1">
                  Phone number must be 10 digits{" "}
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-warning mt-3 p-2 fs-6">
                  {errorMsg}
                </div>
              )}

              <Button
                disabled={phone.length < 10 || loading}
                type="submit"
                className="w-100 mt-4 py-3 login-btn border-0"
              >
                {loading ? (
                  <>
                    <span className="loader"></span> Sending...
                  </>
                ) : (
                  <>Log in</>
                )}
              </Button>

              <div>
                <p className="or w-100 d-flex align-items-center justify-content-center gap-3 my-5 ">
                  OR
                </p>
              </div>

              <Button
                style={{ borderColor: "#F15C6F" }}
                className="bg-white text-dark w-100 py-2  fs-5"
                type="button"
                onClick={() => navigateTo("/log-up")}
              >
                Sign Up
              </Button>
            </Form.Group>
          </Form>
        </div>
      </LogInUpLayout>
    </>
  );
};

export default LogIn;
