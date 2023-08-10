import { Container, Row, Col } from "reactstrap";
import "./Footer.css";
const Footer = () => {
  // aktualni datum v paticce
  const datum = new Date();
  let rok = datum.getFullYear();
  // aktualni datum v paticce
  return (
    <>
      <Container className="footerMargin grey">
        <Row>
          <Col sm={0} md={2}></Col>
          <Col className="footerCenter" md={2}>
            <strong>
              <h5>
                Rodinné domy <br /> <br /> Průmyslové stavby
                <br /> <br />
                Rekonstrukce
                <br /> <br /> Pasportizace staveb
                <br /> <br /> Inženýring
              </h5>
            </strong>
          </Col>
          <Col className="footerCenter" md={4}>
            <strong>
              <h5>
                {/* <a className="normalLink" href="mailto:prochazkam98@gmail.com">
                  mail : prochazka@arapro.cz
                </a>
                <br />
                <br />
                <a className="normalLink" href="tel:739658874">
                  {" "}
                  Tel.: 739658874
                </a> */}
                <br />
                <br />
                ICO : 1092e1381048 <br />
                <br />
                DIC : 3823424224
              </h5>
            </strong>
          </Col>
          <Col className="footerCenter" md={2}>
            <strong>
              <h5>
                ARAPRO s.r.o. <br />
                <br />
                Borotín 189 <br />
                <br />
                391 35 Borotín <br />
                <br />
                Po - Pá 8:00 - 16:00
              </h5>
            </strong>
          </Col>

          <Col sm={0} md={2}></Col>
        </Row>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <br />
            <div className="copyright">
              <p className="footerCenter">
                © {rok} arapro.cz <br />
                Web design & dev k147l.cz
              </p>
            </div>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </>
  );
};
export default Footer;
