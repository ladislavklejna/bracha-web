import React, { useState, useEffect } from "react";
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

import togglerImage1 from "./menu.png";
import togglerImage2 from "./close.png";

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [togglerImage, setTogglerImage] = useState(togglerImage1);
  const [isRotated, setIsRotated] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollTop(currentPosition);
      setIsScrolled(currentPosition > 40);

      // Zde můžeš provést další akce na základě změny scrollování
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggle = () => {
    setIsOpen(!isOpen);
    setIsRotated(!isRotated);

    setTogglerImage(isRotated ? togglerImage1 : togglerImage2);
  };

  const imageClasses = `toggler-image ${isRotated ? "rotate" : ""}`;

  return (
    <div className="navi">
      <Container className={isScrolled ? "true" : "false"}>
        <Navbar {...args} expand={"md"}>
          <NavbarBrand href="/">
            <img
              src="./images/logofull.png"
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
                <NavLink className={isScrolled ? "scrolled" : ""} href="/#/">
                  Úvod
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={isScrolled ? "scrolled2" : ""} href="/#/">
                  Služby
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={isScrolled ? "scrolled3" : ""} href="/#/">
                  Reference
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={isScrolled ? "scrolled4" : ""} href="/#/">
                  Kontakt
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
