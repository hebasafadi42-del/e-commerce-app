import React from "react";
import logo from "../../imgs/logo.svg";
import { FaYoutube, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import NewsLetter from "./NewsLetter";
import { Container } from "react-bootstrap";
import { Link } from "react-router";
import { FaXTwitter } from "react-icons/fa6";
import FooterLinks from "./FooterLinks";
import AppStore from '../../imgs/AppStore.png';
import GooglePlay from '../../imgs/GooglePlay.png';

const WepFooter = () => {
  const icons = [
    { icon: <FaFacebook />, url: "https://www.facebook.com" },
    { icon: <FaXTwitter />, url: "https://www.twitter.com" },
    { icon: <FaLinkedin />, url: "https://www.linkedin.com" },
    { icon: <FaInstagram />, url: "https://www.instagram.com" },
    { icon: <FaYoutube />, url: "https://www.youtube.com" },
  ];

  return (
    <>
      <div className="bgcolor">
        <NewsLetter />
      </div>
      <div className="backGroung-white">
        <Container>
         
          <div className="row py-5 gy-4 justify-content-between">
            
         
            <div className="col-12 col-md-4 col-lg-3">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <Link to="/">
                    <img src={logo} alt="logo" className="img-fluid" style={{ maxWidth: "140px" }} />
                  </Link>
                </li>
                <li className="mb-3">
                  <p className="text-muted small">
                    Best information about the company goes here but now lorem ipsum is
                  </p>
                </li>
                <li>
                  <div className="d-flex align-items-center gap-3 ">
                    {icons.map((item, index) => (
                      <a
                        key={index}
                        href={item.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted fs-5 text-decoration-none nav-link"
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </li>
              </ul>
            </div>

           
            <div className="col-12 col-md-8 col-lg-7">
              <FooterLinks />
            </div>

            <div className="col-12 col-lg-2">
              <h5 className="fw-semibold mb-3 fs-6">Get app</h5>
              <div className="d-flex flex-row flex-lg-column gap-2">
                <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                  <img src={AppStore} alt="AppStore" className="img-fluid" style={{ maxWidth: "125px" }} />
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                  <img src={GooglePlay} alt="GooglePlay" className="img-fluid" style={{ maxWidth: "125px" }} />
                </a>
              </div>
            </div>

          </div>
        </Container>
      </div>
    </>
  );
};

export default WepFooter;