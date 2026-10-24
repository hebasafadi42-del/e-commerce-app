import  { useState } from 'react';
import { Form, ButtonGroup, Button } from 'react-bootstrap';
import { BsGridFill } from 'react-icons/bs';
import { PiListBold } from "react-icons/pi";

const FilterBar = ({ viewMode, setViewMode, sortBy, setsortBy, isVerifiedOnly, setIsVerifiedOnly }) => {


  return (

    <>
      <div className=' d-flex  check-box-style align-items-center gap-2'>
           {/* <Form.Check
           type='checkbox'
           id='Verified-checkbox'
           label="Verified only"
           checked={isVerifiedOnly}
           onChange={(e) => setIsVerifiedOnly(e.target.checked)}
           className='w-50'
           >
           </Form.Check> */}
         <Form.Select
         value={sortBy}
         className='w-50'
         onChange={(e)=>{setsortBy(e.target.value)

         }  
         }
         >
           <option value="Featured">Featured</option>
        <option value="PriceLowHigh">Price: Low to High</option>
        <option value="PriceHighLow">Price: High to Low</option>
         </Form.Select>
          <ButtonGroup
          className='d-flex gap-0 '>
            <Button
            variant='light'
            className={` toggle-btn ${viewMode=== 'list'? 'active': ''}`}
            onClick={()=>setViewMode('list')}
            >
               <PiListBold className='fs-4 ' />
            </Button>
            <Button
            variant='light'
            className={` toggle-btn ${viewMode=== 'grid'? 'active': ''}`}
            onClick={()=>setViewMode('grid')}
            >
               <BsGridFill className='fs-5' />
            </Button>
          </ButtonGroup>
      </div>
    </>
  )
}

export default FilterBar
