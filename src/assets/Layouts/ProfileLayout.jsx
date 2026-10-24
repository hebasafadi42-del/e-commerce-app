import React from 'react'
import WepNavbar from '../components/Header/WepNavbar'
import { Col, Container, Row } from 'react-bootstrap'

const ProfileLayout = ({ children }) => {
  return (
    <>
      <WepNavbar/>
      <Container>
        <Row style={{marginTop:"8%"}} className=' backGroung-white rounded-2'>
          
          <Col lg={12} className='p-0'>
          {children}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default ProfileLayout
