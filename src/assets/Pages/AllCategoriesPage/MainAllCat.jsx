import { Col, Container, Row } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link, useSearchParams } from 'react-router';
import SideBar from './SidebarFilters';
import ProductList from '../../Pages/AllCategoriesPage/ProductList'
import { useMemo, useState } from 'react';


const MainAllCat = () => {
    const [filters, setFilters] = useState({}); 
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const categoryId = searchParams.get('category_id') ?? '';

    const handleCategoryChange = (id) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (id) next.set('category_id', id);
        else next.delete('category_id');
        return next;
      });
    };

    const productFilters = useMemo(
      () => ({ ...filters, categoryId: categoryId || null, search }),
      [filters, categoryId, search]
    );
  return (
    <>
    <Container>
      <Row className="my-4">
        <Col lg={12} >
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} 
            linkProps={{ to: '/', className: 'text-secondary text-decoration-none' }}  >
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/product-categories', className: 'text-secondary text-decoration-none' }}>
              Clothings
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/product-categories/mens-wear' , className: 'text-secondary text-decoration-none' }}>
              Men’s wear
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Summer clothing</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col md={6} lg={3} className='pe-5 ' >
            <SideBar
              setFilters={setFilters}
              activeCategory={categoryId}
              onCategoryChange={handleCategoryChange}
            />
        </Col>

        <Col  md={6} lg={9}>
            <ProductList filters={productFilters}/>
        </Col>
      </Row>
    </Container>
      
    </>
  )
}

export default MainAllCat
