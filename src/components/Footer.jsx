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
