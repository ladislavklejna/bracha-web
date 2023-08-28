import { Helmet } from "react-helmet";
import { Container, Row, Col } from "reactstrap";
import Kontakt from "../components/Kontakt";
import Portfolio from "../components/Portfolio";
import "./Home.css";
import Sluzby from "./Sluzby";

const Home = () => {
  return (
    <>
      <div style={{ position: "relative" }}>
        <img
          id="uvod"
          className="uvodka"
          src="./images/uvodka.jpg"
          alt="úvodní obrazek, můj vysněný dům"
        />
        <div
          className="uvodTxt"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            padding: "10px",
          }}
        >
          <Helmet>
            <title>O nás</title>
            <meta
              name="description"
              content="V projektech uplatňujeme zásady trvale udržitelné výstavby. Výsledkem jsou tak stavby šetrné k životnímu prostředí, energeticky úsporné a architektonicky zajímavé."
            ></meta>
          </Helmet>
          <Container>
            <Row>
              <Col md={12}>
                <p className="inzenyr">
                  Jmenuji se Miroslav Procházka, jsem inženýr v oboru pozemních
                  staveb. <br />
                  <br className="show-sm" />
                  Společně s týmem autorizovaných osob vytvářím projektové
                  dokumentace.
                  <br />
                  <br className="show-sm" />
                  Projekční činnosti se věnuji od roku 2013.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <br />
      <br />
      <Container>
        <Row>
          <Col md={12} lg={6}>
            <p className="just">
              <br />
              <br />
              V našich projektech uplatňujeme zásady trvale udržitelné výstavby
              společně s požadavky budoucích uživatelů. Výsledkem jsou tak
              stavby šetrné k životnímu prostředí, energeticky úsporné a
              architektonicky zajímavé.
            </p>
            <Row>
              <Col md={12} lg={3}>
                <p className="pluska">+ Smysl pro detail</p>
              </Col>
              <Col md={12} lg={6}>
                <p className="pluska">+ Rychlé a kvalitní zpracování</p>
              </Col>
              <Col md={12} lg={3}>
                <p className="pluska">+ Nízké ceny</p>
              </Col>
            </Row>
          </Col>
          <br />
          <br />
          <Col className="centercenter">
            <p>
              „Architektura je to, co činí zříceninu krásnou.“ <br />
              <i>(Le Corbusier)</i>
            </p>
          </Col>
          <br />
          <br />
        </Row>
        <Row>
          {/* <hr /> */}
          <Sluzby />
        </Row>
        <Row>
          {/* <hr /> */}
          <Portfolio />
        </Row>
        <Row>
          <Kontakt />
        </Row>
      </Container>
    </>
  );
};
export default Home;
