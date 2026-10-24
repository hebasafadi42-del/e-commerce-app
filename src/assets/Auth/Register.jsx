import {useContext, useRef, useState } from "react";
import LogInUpLayout from "../Layouts/LogInUpLayout";
import { Alert, Button, Form, InputGroup, Spinner,Toast, ToastContainer } from "react-bootstrap";
import { API_Config } from "../Config/API-Config";
import AddphotoIcon from "../imgs/addphoto-icon.svg";
import { AiOutlinePhone , AiOutlineMail } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AuthContext } from "../../assets/Contexts/AuthContext";




const Register = () => {
  const [name , setName]= useState('');
    const [phone , setPhone]= useState('');
    const [email, setEmail]= useState('');
const { saveUser } = useContext(AuthContext);   
   const [showToast, setShowToast] = useState(false);
const [toastMsg, setToastMsg] = useState("");

const navigate = useNavigate()
  const [UploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setpreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false)




  const handleFormSubmit = (e) => {
     e.preventDefault();
    setErrorMsg(null);
        setLoading(true)


    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.REGISTER}`;

     const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    if (UploadedImage) {
      formData.append("image", UploadedImage);
    } 
    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      },
      body: formData,
        
      
    })
      .then((res) => {
        // console.log(res)
        if (!res.ok) {
          return res.json().then((serverError) => {
            // console.log("Server Error Response:", serverError);
            throw new Error(serverError.message || "some thing went wrong");
          });
        }
        return res.json();
      })
      .then((data) => {
  // console.log(data);
  saveUser(data.data);
  setToastMsg("Account created successfully! Redirecting...");
  setShowToast(true);

  setTimeout(() => {
    navigate("/log-in");
  }, 3000);
})
      .catch((err) => {
        // console.log(err);
        setErrorMsg(err.message);
      })
      .finally(() => {
              setLoading(false)

      });
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };
  const handlaImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (previewUrl) URL.revokeObjectURL(previewUrl); 
    setUploadedImage(file);
    setpreviewUrl(URL.createObjectURL(file));
  }
};
    const handlePhoneChange = (e) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, "").slice(0, 10);
    setPhone(onlyNums);
  };

  return (
    <>
      <LogInUpLayout>
        <div
          style={{ cursor: "pointer" }}
          className="login-card mt-3 p-3 d-flex flex-column  "
        >
          <h2 >Fill your information</h2>
          <p className="text-muted font-sizeverify my-2 px-lg-0 px-3">
            Enter your details
          </p>
         
          <Form onSubmit={handleFormSubmit}>
            <div className="d-flex  flex-column   align-items-center ">
              <div
                
                className="image-box  border my-2"
                onClick={handleBoxClick}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                ) : (
                  <>
                    <div className="d-flex  flex-column  align-items-center  gap-3 p-3">
                      <img style={{width:"60%"}}  src={AddphotoIcon} alt="addphoto" />
                    <p>Add photo</p>
                    </div>
                  </>
                )}
              </div>
              {isUploading && (
              <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-white opacity-75">
                <Spinner animation="border" variant="danger" />
              </div>
            )}
              <Form.Control
               type="file" 
               ref={fileInputRef} 
               onChange={handlaImageChange}
               accept="image/*"
               style={{ display: 'none' }}
               />
                <InputGroup
                className={`border mt-3 mb-2 w-75 rounded-3 overflow-hidden ${errorMsg ? "border-danger" : ""}`}
              >
                <Form.Control
                  className="py-3 border-0 form-input"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  required
                />
                <InputGroup.Text className="bg-white border-0">
                  <FaRegUserCircle
                    style={{ color: "#F0345D" }}
                    className="fs-3"
                  />
                </InputGroup.Text>
              </InputGroup>

              <InputGroup
                className={`border mt-3 mb-4 w-75 rounded-3 overflow-hidden ${errorMsg ? "border-danger" : ""}`}
              >
                <Form.Control
                  className="py-3 border-0 form-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />
                <InputGroup.Text className="bg-white border-0">
                  <AiOutlineMail
                    style={{ color: "#F0345D" }}
                    className="fs-3"
                  />
                </InputGroup.Text>
              </InputGroup>

                <InputGroup
                className={`border rounded-3 w-75 overflow-hidden ${errorMsg ? "border-danger" : ""}`}
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
                <div className="text-warning-emphasis mt-2 fs-6 ">
                  Phone number must be 10 digits{" "}
                </div>
              )}
                {errorMsg && (
          <Alert variant="warning" className="w-75 mx-auto mt-3 text-center">
            {errorMsg}
          </Alert>)}
                 <Button 
          className="verify-btn w-75 py-2 mt-3 fs-5 border-0"
          type="submit"
            disabled={phone.length < 10 ||
                loading
              }
          >
           
          {loading ? <Spinner animation="border" size="md" />: "Save"}
          </Button>
               
            </div>
          </Form>
        </div>
        <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
  <Toast 
    onClose={() => setShowToast(false)} 
    show={showToast} 
    delay={3000} 
    autohide
    bg="success"
  >
    <Toast.Header closeButton={true}>
      <strong className="me-auto">Operation Successful </strong>
    </Toast.Header>
    <Toast.Body className="text-white font-weight-bold">
      {toastMsg}
    </Toast.Body>
  </Toast>
</ToastContainer>
      </LogInUpLayout>
    </>
  );
};

export default Register;
