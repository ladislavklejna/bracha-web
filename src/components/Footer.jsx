import { Container, Row, Col } from "reactstrap";
import { Link } from "react-scroll";
import { useNavHeight } from "../hooks/useNavHeight";
import "./Footer.css";

const SCROLL_GAP = 20;

const Footer = () => {
  const rok = new Date().getFullYear();
  const navHeight = useNavHeight();
  const offsetSection = -navHeight;
  const offsetHeading = -(navHeight + SCROLL_GAP);

  return (
    <footer className="site-footer">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <p className="footer-brand">
              ARA<span className="footer-accent">PRO</span>
            </p>
            <p className="mt-2">
              © {rok} arapro.cz &nbsp;·&nbsp; Web design & dev{" "}
              <a
                href="https://www.krelio.cz"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <picture>
                  <source srcSet="./images/krelio-logo.webp" type="image/webp" />
                  <img
                    src="./images/krelio-logo.png"
                    alt="Krelio logo"
                    className="krelio-logo"
                    height={40}
                  />
                </picture>
              </a>
            </p>
          </Col>
          <Col md={6}>
            <nav className="footer-links" aria-label="Patička navigace">
              <Link className="footer-link" href="#uvod" to="uvod" smooth duration={500} offset={offsetSection}>Úvod</Link>
              <Link className="footer-link" href="#sluzby" to="sluzby" smooth duration={500} offset={offsetHeading}>Služby</Link>
              <Link className="footer-link" href="#reference" to="reference" smooth duration={500} offset={offsetHeading}>Reference</Link>
              <Link className="footer-link" href="#kontakt" to="kontakt" smooth duration={500} offset={offsetHeading}>Kontakt</Link>
            </nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
