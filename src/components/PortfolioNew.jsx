import React, { useEffect, useState } from "react";
import "./PortfolioNew.css";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "lightbox.js-react/dist/index.css";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
const PortfolioNew = () => {
  const [data, setData] = useState([]);
  async function getData(option) {
    axios.get(`http://localhost/index.php`).then((res) => {
      const serverData = res.data;
      console.log(serverData.reverse());
      let cutData = [];
      if (option == "cut") {
        for (let index = 0; index <= 11; index++) {
          cutData.push(serverData[index]);
        }

        setData(cutData);
      } else if (option == "all") {
        setData(serverData);
      }
    });
  }
  useEffect(() => {
    getData("cut");
  }, []);
  const [projectVisibleAll, setProjectVisibleAll] = useState(false);
  useEffect(() => {
    if (projectVisibleAll == false) {
      getData("cut");
    } else {
      getData("all");
    }
  }, [projectVisibleAll]);

  const [hover, setHover] = useState(0);
  const hoverOn = (idcko) => {
    setHover(idcko);
  };
  const [chosenProject, setChosenProject] = useState([]);
  console.log(chosenProject);
  const handleGallery = (ind) => {
    // toggle();
    setIsOpen(true);
    let lada = data[ind].photos;
    let images = [];

    lada.forEach((one) => {
      if (one.name != "thumb.png") {
        let image = { src: one.path };
        images.push(image);
      }
    });

    setChosenProject(images);
  };
  const [modal, setModal] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  // const toggle = () => setModal(!modal);
  return (
    <>
      <h2 id="reference" className="heading">
        Reference
      </h2>

      <Row className="portofolioNew">
        {data.map((x, index) => (
          <Col
            key={x.id}
            className="grid-item"
            onMouseOver={() => hoverOn(x.id)}
            sm={6}
            md={4}
            lg={3}
            onClick={() => handleGallery(index)}
          >
            <img
              src={`${x.photos
                .filter((oo) => oo.name === "thumb.png")
                .map((photo) => photo.path)}`}
            />

            <div className={`${hover == x.id ? "overlay" : "none"}`}>
              <div className="margin-overlay">
                <h6 className="mt-3">
                  {x.name} / <span className="italic">{x.location}</span>
                </h6>
                {/* <h5 className="text-center">{x.location}</h5> */}
                <div className="actions">
                  {x.actions.map((akce) => (
                    <h6>
                      {akce == "studie"
                        ? "architektonická studie"
                        : "" || akce == "dokumentace"
                        ? "projektová dokumentace"
                        : "" || akce}
                    </h6>
                  ))}
                </div>
              </div>
            </div>
            <div className={`${hover == x.id ? "square-top" : "none"}`}></div>
            <div
              className={`${hover == x.id ? "square-bottom" : "none"}`}
            ></div>
          </Col>
        ))}
      </Row>
      <Button onClick={() => setProjectVisibleAll(!projectVisibleAll)}>
        {projectVisibleAll == false ? "show more" : "show less"}
      </Button>
      <SlideshowLightbox
        disableImageZoom={true}
        downloadImages={false}
        fullScreen={true}
        showSlideshowIcon={false}
        images={chosenProject}
        showThumbnails={true}
        open={isOpen}
        lightboxIdentifier="lbox1"
        onClose={() => {
          setIsOpen(false);
        }}
      />
      {/* <div>
        <Modal isOpen={modal} toggle={toggle} fullscreen="md" size="lg">
          <ModalHeader toggle={toggle}>Modal title</ModalHeader>
          <ModalBody>
            <ImageGallery
              showBullets
              className="gallery"
              // useBrowserFullscreen
              items={chosenProject}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div> */}
    </>
  );
};

export default PortfolioNew;
