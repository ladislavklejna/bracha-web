import { lazy, Suspense } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-scroll";
import { FiMapPin, FiBox, FiZap } from "react-icons/fi";
import { useNavHeight } from "../hooks/useNavHeight";
import "./Home.css";
import Sluzby from "./Sluzby";

const PortfolioNew = lazy(() => import("../components/PortfolioNew"));
const Kontakt      = lazy(() => import("../components/Kontakt"));

const SCROLL_GAP = 20;

const Home = () => {
  const navHeight = useNavHeight();
  const offsetHeading = -(navHeight + SCROLL_GAP);

  return (
    <>
      {/* ── Hero ────────────────────────────────────── */}
      <section className="hero" id="uvod">
        <div className="hero-img-wrap">
          <picture>
            <source srcSet="./images/uvodka720.webp" type="image/webp" />
            <img
              className="hero-img"
              src="./images/uvodka720.png"
              alt="Rodinný dům – ukázka projektu ARAPRO"
              loading="eager"
              width="1280"
              height="720"
            />
          </picture>
          <div className="hero-overlay" />
        </div>
        <Container className="hero-container">
          <Row>
            <Col md={9} lg={7}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Vaše myšlenky o bydlení zachycené<br />v detailně promyšleném projektu.
                </h1>
                <ul className="hero-list">
                  <li>architektonické studie</li>
                  <li>projektové dokumentace</li>
                  <li>stavební dozor</li>
                </ul>
                <p className="hero-desc hero-desc--bold">
                  Zajišťuji komplexní projekční a inženýrské služby – od studie
                  přes vyřízení stavebního povolení až po odborný stavební dozor.
                </p>
                <div className="hero-actions">
                  <Link to="kontakt" href="#kontakt" smooth duration={600} offset={offsetHeading}>
                    <button className="btn-primary-cta">Nezávazná poptávka →</button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

      </section>

      {/* ── Benefits strip — outside hero, overlaps bottom on desktop ── */}
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-icon"><FiMapPin /></div>
          <span className="stat-title">Působnost v okruhu přibližně 150 km od Tábora.</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-icon"><FiBox /></div>
          <span className="stat-title">Projektování ve 3D softwaru pro tvorbu informačních modelů budov (BIM).</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-icon"><FiZap /></div>
          <span className="stat-title">Důraz na energeticky úsporné řešení stavby v každém návrhu.</span>
        </div>
      </div>

      {/* ── O nás + Služby ──────────────────────────── */}
      <Container className="section-gap">
        <Row className="align-items-center mb-5">
          <Col md={12} lg={7}>
            <p className="about-text">
              V našich projektech propojujeme zásady trvale udržitelné výstavby
              s individuálními požadavky budoucích uživatelů. Výsledkem jsou
              architektonicky zajímavé stavby, energeticky úsporné
              a šetrné k životnímu prostředí.
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
          <Suspense fallback={<div style={{ minHeight: 400 }} />}>
            <PortfolioNew />
          </Suspense>
        </Container>
      </div>

      {/* ── Kontakt ─────────────────────────────────── */}
      <Container>
        <Row>
          <Suspense fallback={<div style={{ minHeight: 300 }} />}>
            <Kontakt />
          </Suspense>
        </Row>
      </Container>
    </>
  );
};
export default Home;
