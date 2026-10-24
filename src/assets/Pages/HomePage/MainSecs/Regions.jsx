import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { regionsData } from '../../../Data/ProductsData';

const SuppliersByRegion = () => {
  return (
    <div className="container my-5">
      <h4 className="fw-semibold mb-4 ">Suppliers by region</h4>
      
      <div className=" d-flex gap-3 flex-wrap">
        {regionsData.map((item) => (
          
          <div key={item.id}  className='resSize'>
            <Link
              to='/'
              className="d-flex align-items-center    h-100"
            >
              <img
                src={item.flag}
                alt={item.country}
                className="me-3  "
                style={{height:'60%'}}
              />
              
              <div className="d-flex flex-column text-truncate ">
                <span className="text-dark-light fw-medium  " >
                  {item.country}
                </span>
                <span className="text-muted small  text-truncate" >
                  {item.site}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuppliersByRegion;