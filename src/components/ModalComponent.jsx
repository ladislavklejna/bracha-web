import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Container,
  Row,
  Col,
  CloseButton,
} from "reactstrap";
import "./ModalComponent.css";

const ModalComponent = ({ isOpen, onClose, references }) => {
  const [nextModal, setNextModal] = useState(false);

  const [clickedImageSrc, setClickedImageSrc] = useState(null);

  const toggleNext = (src) => {
    setClickedImageSrc(src);
    setNextModal(!nextModal);
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} scrollable={true} size={"lg"}>
      <ModalHeader toggle={onClose}>Seznam referencí</ModalHeader>
      <ModalBody>
        <Container>
          {/* Zobrazit seznam referencí */}
          {references.map((reference) => (
            <Row>
              <Col>
                <div key={reference.id}>
                  <h3>{reference.title}</h3>
                  <img
                    src={reference.imageUrl}
                    alt={reference.title}
                    height={250}
                    width={250}
                  />
                </div>
              </Col>
              <Col>
                <p>nazev objektu</p>
                <p>typ prace: {reference.title}</p>
                <p>rok realizace</p>
                <p>misto realizace</p>
                <img
                  src={reference.thumb1}
                  width={100}
                  height={100}
                  onClick={() => toggleNext(reference.imageUrl)}
                />
                <img
                  src={reference.thumb2}
                  width={100}
                  height={100}
                  onClick={() => toggleNext(reference.thumb2)}
                />
                <img
                  src={reference.imageUrl}
                  width={100}
                  height={100}
                  onClick={() => toggleNext(reference.imageUrl)}
                />
                <Modal
                  isOpen={nextModal}
                  toggle={toggleNext}
                  fullscreen
                  scrollable={"false"}
                >
                  <ModalHeader>
                    <CloseButton onClick={toggleNext}></CloseButton>
                  </ModalHeader>
                  <ModalBody>
                    <div id="my-gallery">
                      <a href={clickedImageSrc}>
                        <img
                          src={clickedImageSrc}
                          alt={`Obrázek ${
                            references.findIndex(
                              (ref) => ref.imageUrl === clickedImageSrc
                            ) + 1
                          }`}
                        />
                      </a>
                    </div>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </Modal>
              </Col>
              <hr></hr>
            </Row>
          ))}
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>
          Zavřít
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalComponent;
