import { useContext, useState } from "react";
import LogInUpLayout from "../Layouts/LogInUpLayout";
import { AuthContext } from "../../assets/Contexts/AuthContext";
import { useNavigate } from "react-router";
import { OTPInput } from "input-otp";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import OtpCountDown from "../components/OtpCountDown";
import { API_Config } from "../Config/API-Config";

const Verify = () => {
  const { user, saveUser, saveToken } = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmet = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (otp.length < 5) {
      setErrorMsg("Please enter the complete 5-digit code.");
      return;
    }
    setLoading(true);

    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.VERIFY}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        phone: user?.phone,
        otp: "11111",
      }),
    })
      .then((res) => {
        // console.log(res);
        if (!res.ok) {
          return res.json().then((serverError) => {
            console.log("Server Error Response:", serverError);
            throw new Error(serverError.message || "some thing went wrong");
          });
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        const { token, ...userData } = data.data;
        saveToken(token);
        saveUser(userData);
        navigate("/");
      })
      .catch((err) => {
        // console.log(err);
        setErrorMsg(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <LogInUpLayout>
        <div className="login-card mt-5 py-lg-0 py-5 d-flex flex-column align-items-lg-start align-items-center">
          <h2 >Verification</h2>
          <p className="text-muted font-sizeverify my-4 px-lg-0 px-3">
            Enter the code we sent to:{" "}
            <span className="fw-semibold">
              {" "}
              {user?.phone || "your phone number"}
            </span>
          </p>
          <Form className="px-lg-0 px-md-2 px-3" onSubmit={handleFormSubmet}>
            <Form.Group>
              {errorMsg ? (
                <Alert
                  variant="warning"
                  className="py-2 text-center small mb-4"
                >
                  {errorMsg}
                </Alert>
              ) : (
                <></>
              )}
              <OTPInput
                maxLength={5}
                value={otp}
                onChange={(e) => setOtp(e)}
                render={({ slots }) => (
                  <div className="d-flex gap-lg-4  gap-md-3 gap-2  px-lg-0 px-3   flex-wrap dir-ltr">
                    {slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className={`otp-digit form-control p-0 d-flex  align-items-center justify-content-center fs-4 fw-bold text-center border-2 rounded-3 ${
                          slot.isActive ? " shadow-sm" : ""
                        }`}
                        style={{
                          borderColor: slot.isActive ? "#F15C6F" : "#C0C0C0",
                        }}
                      >
                        {slot.char}
                        {slot.hasFakeCaret && (
                          <span className="text-danger">-</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              />
              <OtpCountDown initialSecds={60} onResend={() => setOtp("")} />
              <Button
                className="verify-btn w-100 py-2 fs-5 border-0"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="md" /> : "Verify"}
              </Button>
              <div>
                <p className="or w-100 d-flex align-items-center justify-content-center gap-3 my-5 ">
                  OR
                </p>
              </div>
              <Button
                style={{ borderColor: "#F15C6F" }}
                className="backGroung-white text-muted w-100 py-3  fs-5"
                type="button"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </Form.Group>
          </Form>
        </div>
      </LogInUpLayout>
    </>
  );
};

export default Verify;
