import React from "react";
import QuotebgImage from "../../../imgs/QuotebgImage.png";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { useState } from "react";

const QuoteSend = () => {

 
  const initialFormState = {
    item: "",
    details: "",
    quantity: "",
    unit: "Pcs",
  };
  const [ItemReqData, setItemReqData] = useState(initialFormState);
  const handleFormSubmit = (e) => {

    e.preventDefault();
    console.log("Form Data Submitted:", ItemReqData);
    setItemReqData(initialFormState);
  };
  return (
    <>
      <Container className="QuotebgImage rounded-2">
        <Row>
          <Col lg={5}>
            <div className="p-lg-5 p-md-4 p-3">
              <h2 className="text-white fs-1">
                An easy way to send requests to all suppliers
              </h2>
              <p className=" text-white ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt.
              </p>
            </div>
          </Col>
           <Col lg={2}>
            
          </Col>
          <Col lg={5}>
            <div className="p-lg-5 p-md-4 p-3">
              <form
                onSubmit={handleFormSubmit}
                className="p-3 backGroung-white  rounded-2"
              >
                <h5>Send quote to suppliers</h5>

                <Form.Group className="my-4" controlId="quoteItem">
                  <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="What item yoy need?"
                    value={ItemReqData.item}
                    onChange={(e) =>
                      setItemReqData({ ...ItemReqData, item: e.target.value })
                    }
                    required
                  />
                  <Form.Group className="mb-3" controlId="quoteDetails">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Type more details"
                      style={{ resize: "none" }}
                      value={ItemReqData.details}
                      onChange={(e) =>
                        setItemReqData({
                          ...ItemReqData,
                          details: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Row className="gap-2 my-4">
                    <Col sm={6} md={6} lg={6} >
                      <Form.Control
                        type="number"
                        placeholder="Quantity"
                        value={ItemReqData.quantity}
                        onChange={(e) =>
                          setItemReqData({
                            ...ItemReqData,
                            quantity: e.target.value,
                          })
                        }
                        required
                      />
                    </Col>
                    <Col sm={5} md={6}  lg={5}>
                      <Form.Select
                        value={ItemReqData.unit}
                        onChange={(e) =>
                          setItemReqData({
                            ...ItemReqData,
                            unit: e.target.value,
                          })
                        }
                        
                      >
                        <option value="Pcs">Pcs</option>
                        <option value="Kgs">Kgs</option>
                        <option value="Liters">Liters</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Button type="submit" className="bg-gradientButton w-auto border-0 px-4 py-2 fw-semibold" >
                     Send inquiry
                  </Button>
                </Form.Group>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default QuoteSend;
