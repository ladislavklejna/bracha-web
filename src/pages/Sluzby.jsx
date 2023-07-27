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
      <h2 id="sluzby" className="heading">
        Naše služby
      </h2>
      <Container>
        <Row>
          <Col md={4}>
            <Card className="imgcenter" color="light" outline>
              <img
                alt="Sample"
                src="./images/studie.png"
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
                src="./images/dokumentace.png"
                width={150}
                height={150}
              />
              <CardBody>
                <CardTitle className="cartTitlecenter" tag="h4">
                  Projektová dokumentace staveb
                </CardTitle>

                <CardText>
                  Tvorba projektových dokumentací pozemních staveb různého
                  charakteru. Nejčastěji projektujeme novostavby rodinných domů,
                  modernizace a rekonstrukce stávajících staveb včetně
                  dokumentace skutečného provedení (pasportizace stavby).
                  Podrobnost vždy záleží na požadovaném stupni zpracování
                  projektové dokumentace. .
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="imgcenter" color="light" outline>
              <img
                alt="Sample"
                src="./images/dozor.png"
                width={150}
                height={150}
              />
              <CardBody>
                <CardTitle className="cartTitlecenter" tag="h4">
                  Autorský, technický a stavební dozor
                </CardTitle>

                <CardText>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facere magni quas libero molestias nesciunt perferendis beatae
                  corrupti odio et officiis quia totam eveniet dolores nulla aut
                  non, nobis voluptas laboriosam?
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
