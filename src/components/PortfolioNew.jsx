import React, { useRef, useEffect, useState } from "react";
import "./PortfolioNew.css";
import axios from "axios";
import { Row, Col, Button } from "reactstrap";
import ScrollAnimation from "react-animate-on-scroll";
// import "animate.css/animate.compat.css";
import "react-image-gallery/styles/css/image-gallery.css";
import "lightbox.js-react/dist/index.css";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
let pole = [];
const PortfolioNew = () => {
  const [data, setData] = useState([]);
  const tilesRef = useRef(null);
  const [projectVisibleAll, setProjectVisibleAll] = useState(false);

  async function getData(option) {
    axios.get(`http://localhost/index.php`).then((res) => {
      const serverData = res.data;
      serverData.reverse();
      let cutData = [];
      if (option == "cut") {
        for (let index = 0; index <= 11; index++) {
          cutData.push(serverData[index]);
        }

        setData(cutData);
      } else if (option == "all") {
        setData(serverData);
      }
      gridWide(serverData);
    });
  }
  const isElementInViewport = (el, offset = 200) => {
    const rect = el.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= -offset &&
      rect.left >= -offset &&
      rect.bottom <= windowHeight + offset &&
      rect.right <= windowWidth + offset
    );
  };
  useEffect(() => {
    getData("cut");
  }, []);
  useEffect(() => {
    const handleVisibility = () => {
      const tiles = tilesRef.current.querySelectorAll(".grid-item");
      tiles.forEach((tile) => {
        if (isElementInViewport(tile) && !tile.classList.contains("animate")) {
          tile.classList.add("animate");
        }
      });

      // Odstranění posluchače události skrolování, když jsou všechny prvky animované
      const allAnimated = Array.from(tiles).every((tile) =>
        tile.classList.contains("animate")
      );
      if (allAnimated) {
        window.removeEventListener("scroll", handleVisibility);
      }
    };

    // Kontrola viditelnosti při načtení stránky
    handleVisibility();

    // Přidání posluchače události skrolování
    window.addEventListener("scroll", handleVisibility);

    // Odstranění posluchače události skrolování při odmontování komponenty
    return () => {
      window.removeEventListener("scroll", handleVisibility);
    };
  }, []);

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

  const gridWide = (srvData) => {
    let screenWidth = window.innerWidth;

    let countInLine = 0;
    if (screenWidth > 1200) {
      countInLine = 4;
    } else if (screenWidth > 800 && screenWidth < 1199) {
      countInLine = 3;
    }
    console.log(srvData.length);
    const temp = srvData.length / countInLine;
    for (let i = 1; i <= temp; i++) {
      for (let index = 1; index <= countInLine; index++) {
        pole.push(index * 0.25);
      }
    }
    console.log(pole);
  };

  return (
    <>
      <h2 id="reference" className="heading">
        Reference
      </h2>
      <div className="portofolioNew" ref={tilesRef}>
        <Row>
          {data.map((x, index) => (
            <Col
              key={x.id}
              className={`grid-item ${
                projectVisibleAll == true && index > 11 ? "animate" : ""
              }`}
              onMouseOver={() => hoverOn(x.id)}
              sm={6}
              md={4}
              lg={3}
              onClick={() => handleGallery(index)}
              style={{ animationDelay: `${pole[index]}s` }}
            >
              <img
                src={`${x.photos
                  .filter((oo) => oo.name === "thumb.png")
                  .map((photo) => photo.path)}`}
              />

              <div className="overlay">
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
            </Col>
          ))}
        </Row>
      </div>
      <div className="hani">
        <hr className={`photo-line ${modal == true ? "active" : ""}`} />
        <Button
          className="photo-button"
          onClick={() => setProjectVisibleAll(!projectVisibleAll)}
          onMouseOver={() => setModal(true)}
          onMouseLeave={() => setModal(false)}
        >
          {projectVisibleAll == false ? "vice" : "mene"}
        </Button>
      </div>
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
    </>
  );
};

export default PortfolioNew;
