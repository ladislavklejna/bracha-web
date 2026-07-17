import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "./Header.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
  Button,
} from "reactstrap";
import { FaAngleDoubleUp } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
      setIsRotated(!isRotated);
    }
  };

  const onLinkClick = (linkId) => {
    // setActiveLink(linkId);
    toggle(); // Po kliknutí na odkaz zavře menu
  };

  const imageClasses = `toggler-image ${isRotated ? "rotate" : ""}`;

  return (
    <div className={`navi ${isScrolled ? "navi-scrolled" : ""}`}>
      <Container>
        <Navbar expand={"md"}>
          <NavbarBrand className="logo" href="/">
            <picture>
              <source srcSet="./images/logo11.webp" type="image/webp" />
              <img
                src="./images/logo11.png"
                alt="ARAPRO – projektování pozemních staveb"
                width="210"
                height="53"
              />
            </picture>
          </NavbarBrand>
          <NavbarToggler
            className={imageClasses}
            id="custom-toggler"
            onClick={toggle}
            aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </NavbarToggler>
          <Collapse isOpen={isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <Link
                  className="nav-link items"
                  href="#uvod"
                  to="uvod"
                  smooth={true}
                  duration={500}
                  offset={isMobile ? -249 : -100}
                  onClick={() => onLinkClick("uvod")}
                >
                  Úvod
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  className="nav-link items"
                  href="#sluzby"
                  to="sluzby"
                  smooth={true}
                  duration={500}
                  offset={isMobile ? -249 : -126}
                  onClick={() => onLinkClick("sluzby")}
                >
                  Služby
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  className="nav-link items"
                  href="#reference"
                  to="reference"
                  smooth={true}
                  duration={500}
                  offset={isMobile ? -249 : -128}
                  onClick={() => onLinkClick("reference")}
                >
                  Reference
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  className="nav-link items"
                  href="#kontakt"
                  to="kontakt"
                  smooth={true}
                  duration={500}
                  offset={isMobile ? -249 : 0}
                  onClick={() => onLinkClick("kontakt")}
                >
                  Kontakt
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>
      <div
        className={`to-top ${isScrolled === true ? "button-up-visible" : ""}`}
      >
        <Link
          className={`items `}
          href="/"
          to="uvod"
          smooth={true}
          duration={250}
          offset={isMobile ? -260 : -100}
          onClick={() => onLinkClick("uvod")}
        >
          <Button>
            <FaAngleDoubleUp />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
