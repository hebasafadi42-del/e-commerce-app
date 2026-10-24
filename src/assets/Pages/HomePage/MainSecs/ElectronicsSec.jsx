import { Container, Row, Col } from "react-bootstrap";
import { techProducts } from "../../../Data/ProductsData";
import bgImage  from '../../../imgs/Bg-image2.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { Link } from 'react-router';

const ElectronicsSec = () => {
  return (
    <>
        <Container className="backGroung-white border-style my-5 rounded-1">
            <Row className="">
              <Col lg={3} md={12} className=" left-Elect-bg p-4 ">
                <div className="  leftpart">
                      <h5 className='w-50 mb-4 text-black'>Consumer electronics and gadgets</h5>
                      <Link className='t-scale w-50 p-2 inline-block mb-5 nav-link fw-semibold bgcolor d-lg-flex  d-none  align-items-center justify-content-center rounded-3' to='/'>
                      <div >Source now</div>
                      </Link>
                </div>
              </Col>
      
               <Col lg={9} md={12} className="p-0">
                     <div className='d-block d-md-none'>
                           <Swiper
                       modules={[Autoplay]}
                         
                       
                         autoplay={{
                           delay: 1500, 
                           disableOnInteraction: false,
                           pauseOnMouseEnter: true, 
                         }}
                         
                         loop={true}
                         spaceBetween={10}
                        slidesPerView={2.5}
                        
                       >
                        {techProducts.map((item) => (
                             <SwiperSlide key={item.id} className="border rounded-2 p-3 bg-white">
                               <div className="d-flex flex-lg-row flex-md-row flex-column justify-content-lg-between align-items-lg-start align-items-md-start  align-items-center ">
                                 <div className='order-lg-0 order-md-0 order-1'>
                                   <h6 className="fw-semibold  mb-1 fs-6 me-3">{item.title}</h6>
                                   <p className="text-muted d-block small">From</p>
                                   <p className="text-muted small">{item.currency} {item.price}</p>
                                 </div>
                                 <img className='order-lg-1 order-md-1 order-0 mb-lg-0 mb-md-0 mb-3'
                                   src={item.image} 
                                   alt={item.title} 
                                   style={{ width: '70px', height: '70px', objectFit: 'contain' }} 
                                 />
                               </div>
                             </SwiperSlide>
                           ))}
                       </Swiper>
                     </div>
                     <Row className="g-0 d-none d-md-flex d-lg-flex">
                         {techProducts.map((item) => (
                           <Col 
                                          key={item.id} 
                                          md={3} lg={3} 
                                          className="border-bottom border-end p-3 d-flex flex-column justify-content-lg-between align-items-md-center align-items-sm-center"
                                        >
                                          <div className="d-flex flex-lg-row flex-md-column flex-column justify-content-lg-between align-items-lg-start align-items-md-start  align-items-center ">
                                              <div className='order-lg-0 order-md-1 order-1'>
                                                <h6 className="fw-semibold  mb-1 fs-6">{item.title}</h6>
                                                <p className="text-muted d-block small">From</p>
                                                <p className="text-muted small">{item.currency} {item.price}</p>
                                              </div>
                                              <img className='order-lg-1 order-md-0 order-0 mb-lg-0 mb-md-0 mb-3'
                                                src={item.image} 
                                                alt={item.title} 
                                                style={{ width: '70px', height: '70px', objectFit: 'contain' }} 
                                              />
                                            </div>
                                        </Col>
                         ))}
                       </Row>
                     </Col>
            </Row>
          </Container>
    </>
  )
}

export default ElectronicsSec
