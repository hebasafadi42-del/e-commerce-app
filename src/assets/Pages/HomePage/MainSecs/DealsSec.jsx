import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CountdownTimer from "./CountdownTimer";
import { products } from "../../../Data/ProductsData";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const DealsSec = () => {
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <Container className="backGroung-white border-style my-4 rounded-1">
      <Row className="align-items-center">
        <Col lg={3} md={4} className="border-end p-4">
          <CountdownTimer />
        </Col>

        <Col lg={9} md={8} className="p-0">
          <Swiper
            key={dir}
            dir={dir}
            modules={[Autoplay]}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            spaceBetween={0}
            breakpoints={{
              0: { slidesPerView: 2 },
              576: { slidesPerView: 3 },
              768: { slidesPerView: 3 },
              1200: { slidesPerView: 5 },
            }}
          >
            {products.map((item) => (
              <SwiperSlide key={item.id} className="border-end p-3">
                <div className="d-flex flex-column align-items-center justify-content-center text-center">
                  <ProductCard product={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
      </Row>
    </Container>
  );
};

export default DealsSec;