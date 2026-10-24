import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router";
import { IoMdSend, IoMdSearch } from "react-icons/io";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { MdOutlineShield } from "react-icons/md";

import service1 from "../../../imgs/services1.png";
import service2 from "../../../imgs/services2.png";
import service3 from "../../../imgs/services3.png";
import service4 from "../../../imgs/services4.png";

const Services = () => {
  const extraServices = [
    {
      id: 1,
      title: "Source from Industry Hubs",
      image: service1,
      icon: <IoMdSearch />,
    },
    {
      id: 2,
      title: "Customize Your Products",
      image: service2,
      icon: <HiOutlineArchiveBox />,
    },
    {
      id: 3,
      title: "Fast, reliable shipping by ocean or air",
      image: service3,
      icon: <IoMdSend />,
    },
    {
      id: 4,
      title: "Product monitoring and inspection",
      image: service4,
      icon: <MdOutlineShield />,
    },
  ];

  return (
    <Container className="my-5">
      <h3 className="mb-4">Our extra services</h3>
      <Row className="g-4">
        {extraServices.map((service) => (
          <Col
            key={service.id}
            
            sm={6}
            md={6}
            lg={3}
            className="d-flex align-items-stretch"
          >
            <div className="bg-white border-style rounded-1 w-100">
              <Card className="cardHover h-100 position-relative border-0 shadow-sm">
                <Link to="/" className=" h-100 d-flex flex-column">
                  <Card.Img
                    style={{ backgroundColor: "#000000" }}
                    variant="top"
                    src={service.image}
                    alt={service.title}
                  />
                  <Card.Body className="d-flex flex-column justify-content-between position-relative">
                    <div
                      className="icon text-black position-absolute d-flex align-items-center justify-content-center fs-5 rounded-circle border border-2 border-white"
                      style={{
                        top: "-24px",
                        right: "15px",
                        width: "48px",
                        height: "48px",
                        backgroundColor: "#D1E7FF",
                      }}
                    >
                      {service.icon}
                    </div>
                    <Card.Text className="text-dark-light fw-semibold fs-5  mt-3 mb-0 pe-5">
                      {service.title}
                    </Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Services;
