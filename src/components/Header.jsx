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
  NavLink,
  Container,
  Button,
} from "reactstrap";
import { FaAngleDoubleUp } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggle = () => {
    if (window.innerWidth <= 768) {
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
        <Navbar {...args} expand={"md"}>
          <NavbarBrand className="logo" href="/">
            <picture>
              <source srcSet="./images/logo11.webp" type="image/webp" />
              <img
                src="./images/logo11.png"
                alt="ARAPRO – projektování pozemních staveb"
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
                <NavLink>
                  <Link
                    className={`items `}
                    href="/"
                    to="uvod"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -249 : -100}
                    onClick={() => onLinkClick("uvod")}
                  >
                    Úvod
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link
                    className={`items `}
                    href="#sluzby"
                    to="sluzby"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -249 : -26}
                    onClick={() => onLinkClick("sluzby")}
                  >
                    Služby
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link
                    className={`items`}
                    to="reference"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -249 : -28}
                    onClick={() => onLinkClick("reference")}
                  >
                    Reference
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link
                    className={`items `}
                    to="kontakt"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -249 : -0}
                    onClick={() => onLinkClick("kontakt")}
                  >
                    Kontakt
                  </Link>
                </NavLink>
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
          offset={window.innerWidth <= 768 ? -260 : -100}
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
