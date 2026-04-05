import { Container, Row, Col } from "reactstrap";
import { Link } from "react-scroll";
import { FiAward, FiCheckCircle, FiMapPin, FiMessageSquare } from "react-icons/fi";
import Kontakt from "../components/Kontakt";
import "./Home.css";
import Sluzby from "./Sluzby";
import PortfolioNew from "../components/PortfolioNew";

const Home = () => {
  return (
    <>
      {/* ── Hero ────────────────────────────────────── */}
      <section className="hero" id="uvod">
        <picture>
          <source srcSet="./images/uvodka720.webp" type="image/webp" />
          <img
            className="hero-img"
            src="./images/uvodka720.png"
            alt="Rodinný dům – ukázka projektu ARAPRO"
            loading="eager"
          />
        </picture>
        <div className="hero-overlay" />
        <Container className="hero-container">
          <Row>
            <Col md={8} lg={6}>
              <div className="hero-content">
                <p className="hero-eyebrow">Projektování pozemních staveb</p>
                <h1 className="hero-title">
                  Ing. Miroslav<br />Procházka
                </h1>
                <p className="hero-desc">
                  Architektonické studie, projektová dokumentace
                  a stavební dozor — na míru vašemu projektu.
                </p>
                <div className="hero-actions">
                  <Link to="kontakt" smooth duration={600} offset={0}>
                    <button className="btn-primary-cta">Nezávazná poptávka →</button>
                  </Link>
                  <Link to="reference" smooth duration={600} offset={-28}>
                    <button className="btn-ghost-cta">Naše reference</button>
                  </Link>
                </div>
                <p className="trust-badge">✓ Přes 50 realizovaných projektů od roku 2013</p>
              </div>
            </Col>
          </Row>
        </Container>

      </section>

      {/* ── Benefits strip — outside hero, overlaps bottom on desktop ── */}
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-icon"><FiAward /></div>
          <span className="stat-title">Praxe od roku 2013</span>
          <span className="stat-label">50+ dokončených projektů</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-icon"><FiCheckCircle /></div>
          <span className="stat-title">Komplexní servis</span>
          <span className="stat-label">Od studie po stavební povolení</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-icon"><FiMapPin /></div>
          <span className="stat-title">Praha a jižní Čechy</span>
          <span className="stat-label">Vyjíždíme po celé ČR</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-icon"><FiMessageSquare /></div>
          <span className="stat-title">Osobní přístup</span>
          <span className="stat-label">Přímá komunikace s projektantem</span>
        </div>
      </div>

      {/* ── O nás + Služby ──────────────────────────── */}
      <Container className="section-gap">
        <Row className="align-items-center mb-5">
          <Col md={12} lg={7}>
            <p className="about-text">
              V našich projektech uplatňujeme zásady trvale udržitelné výstavby
              společně s požadavky budoucích uživatelů. Výsledkem jsou stavby
              šetrné k životnímu prostředí, energeticky úsporné
              a architektonicky zajímavé.
            </p>
          </Col>
          <Col className="text-center d-none d-lg-block">
            <p className="quote-text">
              „Architektura je to, co činí zříceninu krásnou."
              <br /><em>(Le Corbusier)</em>
            </p>
          </Col>
        </Row>
        <Sluzby />
      </Container>

      {/* ── Portfolio ───────────────────────────────── */}
      <div className="portfolio-wrapper">
        <Container className="noGutter">
          <PortfolioNew />
        </Container>
      </div>

      {/* ── Kontakt ─────────────────────────────────── */}
      <Container>
        <Row>
          <Kontakt />
        </Row>
      </Container>
    </>
  );
};
export default Home;
