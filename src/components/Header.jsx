import React, { useState, useEffect } from "react";
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
} from "reactstrap";

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [togglerImage, setTogglerImage] = useState("/images/menu.png");
  const [isRotated, setIsRotated] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("uvod"); // Výchozí aktivní odkaz

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollTop(currentPosition);
      setIsScrolled(currentPosition > 40);
      // Získáme pozice jednotlivých sekcí na stránce
      // const x = +100;
      const uvodPosition = document.getElementById("uvod").offsetTop - 100;
      const sluzbyPosition = document.getElementById("sluzby").offsetTop - 140;
      const referencePosition =
        document.getElementById("reference").offsetTop - 140;
      const kontaktPosition =
        document.getElementById("kontakt").offsetTop - 350;

      // console.log(sluzbyPosition);
      // Porovnáme pozice sekcí s pozicí okna a určíme nejbližší sekci
      if (currentPosition >= uvodPosition && currentPosition < sluzbyPosition) {
        setActiveLink("uvod");
      } else if (
        currentPosition >= sluzbyPosition &&
        currentPosition < referencePosition
      ) {
        setActiveLink("sluzby");
      } else if (
        currentPosition >= referencePosition &&
        currentPosition < kontaktPosition
      ) {
        setActiveLink("reference");
      } else if (currentPosition >= kontaktPosition) {
        setActiveLink("kontakt");
      }
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
      setTogglerImage(isRotated ? "./images/menu.png" : "./images/close2.png");
    }
  };

  const onLinkClick = (linkId) => {
    setActiveLink(linkId);
    toggle(); // Po kliknutí na odkaz zavře menu
  };

  const imageClasses = `toggler-image ${isRotated ? "rotate" : ""}`;

  return (
    <div className="navi">
      <Container className={isScrolled ? "true" : "false"}>
        <Navbar {...args} expand={"md"}>
          <NavbarBrand href="/">
            <img
              src="./images/logo11.png"
              alt="logo firmy Arapro.cz"
              style={{ height: 70, width: 250 }}
            />
          </NavbarBrand>
          <NavbarToggler
            className={imageClasses}
            id="custom-toggler"
            onClick={toggle}
          >
            <img src={togglerImage} alt="Custom Toggler" />
          </NavbarToggler>
          <Collapse isOpen={isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink>
                  <Link
                    className={`items ${activeLink === "uvod" ? "active" : ""}`}
                    href="/"
                    to="uvod"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -260 : -100}
                    onClick={() => onLinkClick("uvod")}
                  >
                    Úvod
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link
                    className={`items ${
                      activeLink === "sluzby" ? "active" : ""
                    }`}
                    href="#sluzby"
                    to="sluzby"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -299 : -126}
                    onClick={() => onLinkClick("sluzby")}
                  >
                    Služby
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link
                    className={`items ${
                      activeLink === "reference" ? "active" : ""
                    }`}
                    to="reference"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -299 : -128}
                    onClick={() => onLinkClick("reference")}
                  >
                    Reference
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link
                    className={`items ${
                      activeLink === "kontakt" ? "active" : ""
                    }`}
                    to="kontakt"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -299 : -100}
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
    </div>
  );
}

export default Header;
