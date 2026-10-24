import React from 'react'
import recommended3 from "../../imgs/recommended3.png"
import recommended1 from "../../imgs/recommended1.png"
import recommended2 from "../../imgs/recommended2.png"
import recommended4 from "../../imgs/recommended4.png"
import recommended5 from "../../imgs/recommended5.png"





const PrdctMayLike = () => {
    const prdcts =[
        {title:"Men Blazers Sets Elegant Formal" , image : recommended3 , price: "$7.00 - $99.50" },
        {title:"Men Shirt Sleeve Polo Contrast" , image : recommended1 , price: "$7.00 - $99.50" },
        {title:"Apple Watch Series Space Gray" , image : recommended2 , price: "$7.00 - $99.50" },
        {title:"Basketball Crew Socks Long Stuff" , image : recommended4 , price: "$7.00 - $99.50" },
        {title:"New Summer Men's  castrol T-Shirts" , image : recommended5 , price: "$7.00 - $99.50" },
    ]
  return (
    <>
      <div className=" bgcolor border rounded-2  p-4 mt-lg-0 mt-md-0 mt-4">
          <h4>You May Like</h4>
          {
            prdcts.map((pdct , index)=>(
              <div className='my-4 d-flex align-items-start' key={index}>
                 <div >
                    <img className='border p-2 rounded-2' style={{width:"70%"}} src={pdct.image} alt={pdct.title} />
                 </div>
                 <div >
                    <h6>{pdct.title}</h6>
                    <p className='text-muted'>{pdct.price}</p>
                 </div>
              </div>
            ))
          }
      </div>
    </>
  )
}

export default PrdctMayLike
