import { Container, Row , Col } from 'react-bootstrap'
import logo from '../imgs/logoimg.png'

const LogInUpLayout = ({ children }) => {
  return (
    <>
      <div >
        <div className="position-relative">
            <Container fluid >
       <Row>
        <Col lg={6} md sm xs className=' fixed login-bg '>
        <div className='h-100 d-lg-flex d-none  flex-column align-items-center justify-content-center'>
         <img src={logo} alt="" />
         <h1 style={{fontSize:'50px'}} className='my-4 text-white'>Let’s get started</h1>
         <p className='text-white text-center fs-4 w-75'>Where opportunities meet simplicity!
Whether you’re here to fill out your
 cart
or to check irresistible offers.</p>
        </div>
        </Col>
        <Col lg={6} className=''>
          <div className='h-100 d-flex flex-column ms-5'>{children}</div>
        </Col>
       </Row>
      </Container>
        </div>
      </div>
    </>
  )
}

export default LogInUpLayout
