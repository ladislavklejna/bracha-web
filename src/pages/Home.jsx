import { Container, Row, Col } from "reactstrap";
import Kontakt from "../components/Kontakt";
import Portfolio from "../components/Portfolio";
import "./Home.css";
import Sluzby from "./Sluzby";

const Home = () => {
  return (
    <>
      <img id="uvod" className="uvodka" src="./images/IMAG3117.jpg"></img>
      <br />
      <br />
      <Container>
        <Row>
          <Col md={12} lg={6}>
            <p className="just">
              <h2>
                <strong>Architektonická a projekční kancelář</strong>
              </h2>
              <br />
              <br /> V našich projektech uplatňujeme zásady trvale udržitelné
              výstavby společně s požadavky klientů. Výsledkem jsou tak stavby
              šetrné k životnímu prostředí, energeticky úsporné a
              architektonicky zajímavé, které poskytují kvalitní úroveň užívání.
            </p>
          </Col>
          <Col className="centercenter">
            <p>
              „Architektura je to, co činí zříceninu krásnou.“ <br />
              <i>(Le Corbusier)</i>
            </p>
          </Col>
        </Row>
        <Row>
          <hr />
          <Sluzby />
        </Row>
        <Row>
          <hr />
          <Portfolio />
        </Row>
        <Kontakt />
      </Container>
    </>
  );
};
export default Home;
