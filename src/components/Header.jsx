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
  Button,
} from "reactstrap";

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [togglerImage, setTogglerImage] = useState("/images/menu.png");
  const [isRotated, setIsRotated] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [activeLink, setActiveLink] = useState("uvod");

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollTop(currentPosition);
      setIsScrolled(currentPosition > 250);
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
      // if (currentPosition >= uvodPosition && currentPosition < sluzbyPosition) {
      //   setActiveLink("uvod");
      // } else if (
      //   currentPosition >= sluzbyPosition &&
      //   currentPosition < referencePosition
      // ) {
      //   setActiveLink("sluzby");
      // } else if (
      //   currentPosition >= referencePosition &&
      //   currentPosition < kontaktPosition
      // ) {
      //   setActiveLink("reference");
      // } else if (currentPosition >= kontaktPosition) {
      //   setActiveLink("kontakt");
      // }
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
    // setActiveLink(linkId);
    toggle(); // Po kliknutí na odkaz zavře menu
  };

  const imageClasses = `toggler-image ${isRotated ? "rotate" : ""}`;

  return (
    <div className="navi">
      <Container className={isScrolled ? "true" : "false"}>
        <Navbar {...args} expand={"md"}>
          <NavbarBrand className="logo" href="/">
            <img src="./images/logo11.png" alt="logo firmy Arapro.cz" />
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
                    className={`items `}
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
                    className={`items `}
                    href="#sluzby"
                    to="sluzby"
                    smooth={true}
                    duration={500}
                    offset={window.innerWidth <= 768 ? -299 : -26}
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
                    offset={window.innerWidth <= 768 ? -299 : -28}
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
                    offset={window.innerWidth <= 768 ? -299 : -0}
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
        className={`to-top ${isScrolled == true ? "button-up-visible" : ""}`}
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
          <Button>UP</Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
