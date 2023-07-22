import { Container, Row, Col } from "reactstrap";
import Galery from "../components/Galery";
import Kontakt from "../components/Kontakt";
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
              <strong>Architektonická a projekční kancelář</strong> <br />
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
          <br />
          <br />
          <Sluzby />
        </Row>
        <Row>
          <br />
          <br />
          <Galery />
          <br />
          <br />
          <Kontakt />
        </Row>
      </Container>
    </>
  );
};
export default Home;
