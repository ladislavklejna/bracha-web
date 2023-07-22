import {
  Card,
  CardTitle,
  CardBody,
  CardText,
  Container,
  Row,
  Col,
} from "reactstrap";
import "./Sluzby.css";
const Sluzby = () => {
  return (
    <>
      <h1 name="sluzby">Nase sluzby</h1>
      <Container>
        <Row>
          <Col md={4}>
            <Card className="imgcenter" color="light" outline>
              <img
                alt="Sample"
                src="./images/house.png"
                width={150}
                height={150}
              />
              <CardBody>
                <CardTitle className="cartTitlecenter" tag="h4">
                  Architektonická studie
                </CardTitle>

                <CardText>
                  Představuje individuální návrh stavebního záměru, který
                  vychází z požadavků budoucích uživatelů a zároveň respektuje
                  omezující limity území. Obsahuje nezbytné informace pro
                  představu budoucí podoby stavby - navržené materiály,
                  půdorysy, řezy, polohu stavby na pozemku, vizualizace, aj.
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="imgcenter" color="light" outline>
              <img
                alt="Sample"
                src="./images/check.png"
                width={150}
                height={150}
              />
              <CardBody>
                <CardTitle className="cartTitlecenter" tag="h4">
                  Architektonická studie
                </CardTitle>

                <CardText>
                  Představuje individuální návrh stavebního záměru, který
                  vychází z požadavků budoucích uživatelů a zároveň respektuje
                  omezující limity území. Obsahuje nezbytné informace pro
                  představu budoucí podoby stavby - navržené materiály,
                  půdorysy, řezy, polohu stavby na pozemku, vizualizace, aj.
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="imgcenter" color="light" outline>
              <img
                alt="Sample"
                src="./images/hammer.png"
                width={150}
                height={150}
              />
              <CardBody>
                <CardTitle className="cartTitlecenter" tag="h4">
                  Architektonická studie
                </CardTitle>

                <CardText>
                  Představuje individuální návrh stavebního záměru, který
                  vychází z požadavků budoucích uživatelů a zároveň respektuje
                  omezující limity území. Obsahuje nezbytné informace pro
                  představu budoucí podoby stavby - navržené materiály,
                  půdorysy, řezy, polohu stavby na pozemku, vizualizace, aj.
                </CardText>
              </CardBody>
            </Card>
          </Col>
          {/* <p>
            <b>Architektonická studie</b> <br /> Představuje individuální návrh
            stavebního záměru, který vychází z požadavků budoucích uživatelů a
            zároveň respektuje omezující limity území. Obsahuje nezbytné
            informace pro představu budoucí podoby stavby - navržené materiály,
            půdorysy, řezy, polohu stavby na pozemku, vizualizace, aj. <br />
            <br />
            <b>Projektová dokumentace staveb</b> <br />
            Tvorba projektových dokumentací pozemních staveb různého charakteru.
            Nejčastěji projektujeme novostavby rodinných domů, modernizace a
            rekonstrukce stávajících staveb včetně dokumentace skutečného
            provedení (pasportizace stavby). Podrobnost vždy záleží na
            požadovaném stupni zpracování projektové dokumentace. <br /> <br />
            <b> Autorský, technický a stavební dozor</b>
          </p> */}
        </Row>
      </Container>
    </>
  );
};
export default Sluzby;
