import {
  Card,
  CardTitle,
  CardBody,
  CardText,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Helmet } from "react-helmet";
import "./Sluzby.css";
const Sluzby = () => {
  var width = 50;
  var height = 50;
  return (
    <div className="gray">
      <Helmet>
        <title>Nabízíme</title>
        <meta
          name="description"
          content="Architektonickou studii - Projektovou dokumentaci - Pomoc s vyřízením stavebního povolení, Autorský, technický a stavební dozor"
        ></meta>
      </Helmet>
      <h2 id="sluzby" className="heading">
        Služby
      </h2>

      <hr className="cara" />
      <Container className="odsazeni">
        <Row>
          <Col md={4}>
            <Card className="imgcenter" color="light" outline>
              <img
                alt="Sample"
                src="./images/studie.png"
                width={width}
                height={height}
              />
              <CardBody>
                <CardTitle className="cartTitlecenter" tag="h4">
                  Architektonická studie
                </CardTitle>
                <br />
                <CardText className="cardText">
                  Představuje individuální návrh stavebního záměru, který
                  vychází z požadavků budoucích uživatelů a zároveň respektuje
                  omezující limity území. Obsahuje nezbytné informace pro
                  představu budoucí podoby stavby -
                  <i>
                    {" "}
                    navržené materiály, půdorysy, řezy, polohu stavby na
                    pozemku, vizualizace, aj.
                  </i>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="imgcenter" color="light" outline>
              <img
                alt="Sample"
                src="./images/dokumentace.png"
                width={width}
                height={height}
              />
              <CardBody>
                <CardTitle className="cartTitlecenter" tag="h4">
                  Projektová dokumentace staveb
                </CardTitle>
                <br />
                <CardText className="cardText">
                  Tvorba projektových dokumentací pozemních staveb různého
                  charakteru. Nejčastěji projektujeme novostavby rodinných domů,
                  modernizace a rekonstrukce stávajících staveb včetně
                  dokumentace skutečného provedení (pasport stavby). Podrobnost
                  vždy záleží na požadovaném stupni zpracování projektové
                  dokumentace.
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="imgcenter" color="light" outline>
              <img
                alt="Sample"
                src="./images/dozor.png"
                width={width}
                height={height}
              />
              <CardBody>
                <CardTitle id="dozor" className="cartTitlecenter" tag="h4">
                  •••
                </CardTitle>
                <br />
                <CardText className="cardText">
                  • Pomoc s vyřízením stavebního povolení.
                  <br />
                  <br /> • Autorský, technický a stavební dozor.
                  <br />
                  <br /> • Statické posouzení konstrukcí.
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Sluzby;
