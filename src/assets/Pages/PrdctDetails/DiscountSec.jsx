import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router'

const DiscountSec = () => {
  return (
    <>
      <div  className='discountSecBg rounded-2 d-lg-flex d-md-flex align-items-center justify-content-between p-4 mb-5'>
        <div>
            <h4 className='text-white'>Super discount on more than 100 USD</h4>
            <p className='text-white-50'>Have you ever finally just write dummy info</p>
        </div>
        <Button 
        style={{backgroundColor:"#FF9017"}}
        className='d-flex align-items-center justify-content-center border-0 '
        as={Link}
        to="#"
        >
          Shop now
        </Button>

      </div>
    </>
  )
}

export default DiscountSec
