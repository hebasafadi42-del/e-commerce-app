import React from 'react';
import { footerSections } from '../../Data/ProductsData';
import { Link } from 'react-router';

const FooterLinks = () => {
  return (
   
    <div className="row flex-grow-1 gy-4">
      {footerSections.map((section, sectionIndx) => (
       
        <div key={sectionIndx} className="col-6 col-sm-4 col-md-3 col-lg">
          <h5 className="fw-semibold mb-3 fs-6">{section.title}</h5>
          <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
            {section.links.map((link, linkIndx) => (
              <li key={linkIndx}>
                <Link 
                  to="/" 
                  className="text-decoration-none text-muted small nav-link"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterLinks;