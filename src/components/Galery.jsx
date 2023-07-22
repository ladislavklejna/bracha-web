import { Container, Row, Col, Button, Badge } from "reactstrap";
import "./Galery.css";

const Galery = () => {
  return (
    <>
      <h2 id="portfolio" className="center">
        Portfolio
      </h2>
      <Container>
        <Row>
          <Col className="sameResolution" sm={6} md={6} lg={4}>
            <img src="./references/house1.png" />
            <h3>Rekonstrukce Borotin</h3>
          </Col>
          <Col className="sameResolution" sm={6} md={6} lg={4}>
            <img src="./references/house2.png" />
            <h3>Studie Chotoviny</h3>
          </Col>
          <Col className="sameResolution" sm={6} md={6} lg={4}>
            <img src="./references/house3.jpeg" />
            <h3>Skolni projekt Zoo</h3>
          </Col>
        </Row>
        <Row>
          <Col sm={0} md={0} lg={4}></Col>
          <Col id="plusButton" sm={9} md={9} xl={4}>
            <Button className="tlacitkoVice"> + více projektů</Button>
          </Col>
          <Col sm={0} md={0} lg={4}></Col>
        </Row>
      </Container>
    </>
  );
};
export default Galery;
