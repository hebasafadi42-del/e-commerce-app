import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router';

import smartWatch from "../../imgs/smartWatch.png"
import recommended7 from "../../imgs/recommended7.png"
import HomeAppliance from "../../imgs/Home-appliance.png"
import recommended5 from "../../imgs/recommended5.png"
import recommended6 from "../../imgs/recommended6.png"
import recommended8 from "../../imgs/recommended8.png"

const RelatedPrcts = () => {
    const relatedPrdcts =[
        {title:"Xiaomi Redmi 8 Original " , image :recommended8 , price:"$32.00-$40.00"},
        {title:"Xiaomi Redmi 8 Original " , image :smartWatch , price:"$32.00-$40.00"},
        {title:"Xiaomi Redmi 8 Original " , image :recommended6 , price:"$32.00-$40.00"},
        {title:"Xiaomi Redmi 8 Original " , image :recommended5 , price:"$32.00-$40.00"},
        {title:"Xiaomi Redmi 8 Original " , image :recommended7 , price:"$32.00-$40.00"},

    ]
  return (
    <>
      <div className="my-5 container cards-contai">
         <h3 className='mb-4'>Related products</h3>
            <div className=" d-flex  flex-wrap justify-content-between ">
                    {
            relatedPrdcts.map((item)=>(
                    <Card key={item.id} className="cardss backGroung-white border-style mb-3  rounded-1"
           >
              <Link to='/'>
              <div className="d-flex justify-content-center align-items-center w-100 my-4 "
                >
                               <Card.Img  style={{width:'50%'}} variant="top" src={item.image} />

              </div>
      <Card.Body>
        <Card.Title className=' fs-6 text-dark-light '> {item.title}</Card.Title>
        <Card.Text className='text-muted fs-6'>
       {item.price}
        </Card.Text>
       
      </Card.Body>
              </Link>
    </Card>
            ))
          }
            </div>
    </div>
    </>
  )
}

export default RelatedPrcts
