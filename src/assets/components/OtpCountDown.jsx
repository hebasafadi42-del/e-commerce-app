import { useContext, useState, useEffect } from "react";
import { API_Config } from "../Config/API-Config";
import { AuthContext } from "../../assets/Contexts/AuthContext";
import { Alert, Button, Form ,Toast, ToastContainer} from "react-bootstrap";


const OtpCountDown = ({ initialSecds = 60, onResend }) => {
  const { user } = useContext(AuthContext);

  const [seconds, setSeconds] = useState(initialSecds);
  const [isActive, setIsActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleResend = () => {
    setErrorMsg(null);
    setLoading(true);
    setSuccessMsg(null);

    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.RESEND}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        phone: user?.phone,
      }),
    })
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          return res.json().then((serverError) => {
            console.log("Server Error Response:", serverError);
            throw new Error(serverError.message || "some thing went wrong");
          });
        }
        return res.json();
      })
      .then((data) => {
            setSuccessMsg("OTP Resended Successfully");

        console.log(data);
        setSeconds(initialSecds);
        setIsActive(true);
        if (onResend) {
          onResend();
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <>
      <Form.Text className="d-flex justify-content-center">
        {isActive ? (
          <p className="text-muted py-4  font-sizeverify">
            Didn’t receive code ?{" "}
            <span className="fw-bold" style={{ color: "#F0345D" }}>
              {formatTime(seconds)}
            </span>
          </p>
        ) : (
          <Button
           disabled={loading}
            onClick={handleResend}
            style={{ color: "#F0345D" }}
            className=" font-sizeverify  my-4 text-decoration-none    bg-transparent border-0"
          >
             {loading ? "Resending...": "Resend Code"}
          </Button>
        )}
                  <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
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
              onClick={() => setSuccessMsg(null)}
            ></button>
          </Toast.Body>
        </Toast>
      </ToastContainer>
         {errorMsg && (
        <Alert variant="warning" className="py-2 text-center small mb-3 w-100">
          {errorMsg}
        </Alert>
      )}
      </Form.Text>
      
    </>
  );
};

export default OtpCountDown;
