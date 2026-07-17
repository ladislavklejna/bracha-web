import { useState, useEffect } from "react";
import { scroller } from "react-scroll";
import { useNavHeight } from "../hooks/useNavHeight";
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

// Extra breathing room below the navbar for section headings (not needed for
// "uvod", which scrolls to the hero's own edge-to-edge top).
const SCROLL_GAP = 20;

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navHeight = useNavHeight();
  const offsetSection = -navHeight;
  const offsetHeading = -(navHeight + SCROLL_GAP);

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

  // Scrolls to a section, accounting for the mobile hamburger menu: react-scroll
  // measures the target element's position at call time, but the Collapse menu
  // (which pushes page content down while open) takes ~350ms to animate shut.
  // Calling scroller.scrollTo() immediately on click would measure the target
  // while the menu is still visually open, overshooting past it. So on mobile,
  // close the menu first and wait for its collapse transition to finish.
  const scrollToSection = (id, offset) => {
    const needsCollapseWait = isMobile && isOpen;
    if (isMobile) {
      setIsOpen(false);
      setIsRotated(false);
    }
    const run = () => scroller.scrollTo(id, { smooth: true, duration: 500, offset });
    if (needsCollapseWait) {
      setTimeout(run, 380);
    } else {
      run();
    }
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
                <a
                  className="nav-link items"
                  href="#uvod"
                  onClick={(e) => { e.preventDefault(); scrollToSection("uvod", offsetSection); }}
                >
                  Úvod
                </a>
              </NavItem>
              <NavItem>
                <a
                  className="nav-link items"
                  href="#sluzby"
                  onClick={(e) => { e.preventDefault(); scrollToSection("sluzby", offsetHeading); }}
                >
                  Služby
                </a>
              </NavItem>
              <NavItem>
                <a
                  className="nav-link items"
                  href="#reference"
                  onClick={(e) => { e.preventDefault(); scrollToSection("reference", offsetHeading); }}
                >
                  Reference
                </a>
              </NavItem>
              <NavItem>
                <a
                  className="nav-link items"
                  href="#kontakt"
                  onClick={(e) => { e.preventDefault(); scrollToSection("kontakt", offsetHeading); }}
                >
                  Kontakt
                </a>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>
      <div
        className={`to-top ${isScrolled === true ? "button-up-visible" : ""}`}
      >
        <a
          className="items"
          href="#uvod"
          onClick={(e) => { e.preventDefault(); scrollToSection("uvod", offsetSection); }}
        >
          <Button>
            <FaAngleDoubleUp />
          </Button>
        </a>
      </div>
    </div>
  );
}

export default Header;
