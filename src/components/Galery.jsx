import React, { useState } from "react";
import { Container, Row, Col, Button, Badge } from "reactstrap";
import "./Galery.css";
import ModalComponent from "./ModalComponent";

const references = [
  {
    id: 1,
    title: "Rekonstrukce Borotin",
    imageUrl: "./references/house1.png",
    imageUrl2: "./references/house2.png",

    thumbnails: [
      { id: 1, src: "./images/house.png" },
      { id: 2, src: "./images/phone.jpeg" },
    ],
  },
  {
    id: 2,
    title: "Studie Chotoviny",
    imageUrl: "./references/house2.png",
  },
  {
    id: 3,
    title: "Skolni projekt Zoo",
    imageUrl: "./references/house3.jpeg",
  },
  // Další reference...
];

const Galery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Stav pro viditelnost modálního okna
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  // Funkce pro zavření modálního okna
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <h2 id="portfolio" className="center">
        Portfolio
      </h2>
      <Container>
        <Row>
          <Col className="sameResolution" sm={6} md={6} lg={4}>
            <img onClick={handleModalOpen} src="./references/house1.png" />
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
            <Button onClick={handleModalOpen} className="tlacitkoVice">
              {" "}
              + více projektů
            </Button>
          </Col>
          <Col sm={0} md={0} lg={4}></Col>
        </Row>
      </Container>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={handleModalClose}
        references={references}
      />
    </>
  );
};
export default Galery;
