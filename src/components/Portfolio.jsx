// import { useState } from "react";
// import { Container, Col, Row, Badge, List } from "reactstrap";
// import data from "./data";
// // import Lightbox from "react-image-lightbox";
// // import "react-image-lightbox/style.css";
// import "./Portfolio.css";

// const Portfolio = () => {
//   const [lightboxOpen, setLightboxOpen] = useState(data.map(() => false));
//   const [lightboxIndexes, setLightboxIndexes] = useState(data.map(() => 0));

//   const openLightbox = (projectId, index) => {
//     setLightboxOpen((prevOpen) => {
//       const newOpen = [...prevOpen];
//       newOpen[projectId - 1] = true;
//       return newOpen;
//     });
//     setLightboxIndexes((prevIndexes) => {
//       const newIndexes = [...prevIndexes];
//       newIndexes[projectId - 1] = index;
//       return newIndexes;
//     });
//   };

//   const closeLightbox = (projectId) => {
//     setLightboxOpen((prevOpen) => {
//       const newOpen = [...prevOpen];
//       newOpen[projectId - 1] = false;
//       return newOpen;
//     });
//   };

//   const moveNext = (projectId) => {
//     setLightboxIndexes((prevIndexes) => {
//       const newIndexes = [...prevIndexes];
//       newIndexes[projectId - 1] =
//         (newIndexes[projectId - 1] + 1) % data[projectId - 1].foto.length;
//       return newIndexes;
//     });
//   };

//   const movePrev = (projectId) => {
//     setLightboxIndexes((prevIndexes) => {
//       const newIndexes = [...prevIndexes];
//       newIndexes[projectId - 1] =
//         (newIndexes[projectId - 1] + data[projectId - 1].foto.length - 1) %
//         data[projectId - 1].foto.length;
//       return newIndexes;
//     });
//   };

//   const getLightboxIndex = (projectId) => {
//     return lightboxIndexes[projectId - 1];
//   };

//   return (
//     <div className="noGutter">
//       <h2 id="reference" className="heading">
//         Reference
//       </h2>
//       <hr className="cara"></hr>
//       <p className="vyber">Výběr našich nejzajímavějších projektů.</p>

//       {data.map((project) => (
//         <Container key={project.id}>
//           <Row>
//             <Col md={6} lg={7}>
//               <div>
//                 <span className="headingTitle oooo">{project.title} | </span>
//                 <span className="kurziva">{project.location}</span>
//               </div>

//               {project.subtitle && project.subtitle.length > 0 ? (
//                 <div className="subtitle-gallery">
//                   {project.subtitle.map((subtitle) => (
//                     <List className="subtitles">
//                       <li className="oooo">
//                         <p key={subtitle.id}>{subtitle.text}</p>
//                       </li>
//                     </List>
//                   ))}
//                 </div>
//               ) : (
//                 <p>Žádné subtitles k dispozici.</p>
//               )}
//             </Col>
//             <Col className="odskok text-right" md={6} lg={5}>
//               {project.thumbnails && project.thumbnails.length > 0 ? (
//                 project.thumbnails
//                   .slice(0, window.innerWidth <= 768 ? 4 : 3)
//                   .map((thumb, index) => (
//                     <span
//                       key={thumb.id}
//                       className="thumbnail-container"
//                       onClick={() => openLightbox(project.id, index)}
//                     >
//                       {index === (window.innerWidth <= 768 ? 3 : 2) &&
//                         project.thumbnails.length >
//                           (window.innerWidth <= 768 ? 4 : 3) && (
//                           <Badge
//                             color={"warning"}
//                             className="thumbnail-overlay"
//                           >
//                             +{" "}
//                             {project.thumbnails.length -
//                               (window.innerWidth <= 768 ? 4 : 3)}{" "}
//                           </Badge>
//                         )}
//                       <img
//                         src={thumb.src}
//                         width={150}
//                         height={100}
//                         alt={project.title}
//                         className="thumbnail-img"
//                       />
//                     </span>
//                   ))
//               ) : (
//                 <p>Není k dispozici žádný náhled.</p>
//               )}
//             </Col>
//           </Row>
//           <hr />
//         </Container>
//       ))}
//       {data.map((project) => (
//         <div key={project.id}>
//           {lightboxOpen[project.id - 1] && (
//             <Lightbox
//               mainSrc={
//                 data[project.id - 1]?.foto?.length > 0
//                   ? data[project.id - 1].foto[getLightboxIndex(project.id)].src
//                   : "./images/hammer.png"
//               }
//               onCloseRequest={() => closeLightbox(project.id)}
//               imageTitle={project.title}
//               imageCaption={project.description}
//               nextSrc={
//                 data[project.id - 1]?.foto?.length > 1
//                   ? data[project.id - 1].foto[
//                       (getLightboxIndex(project.id) + 1) %
//                         data[project.id - 1].foto.length
//                     ].src
//                   : null
//               }
//               prevSrc={
//                 data[project.id - 1]?.foto?.length > 1
//                   ? data[project.id - 1].foto[
//                       (getLightboxIndex(project.id) +
//                         data[project.id - 1].foto.length -
//                         1) %
//                         data[project.id - 1].foto.length
//                     ].src
//                   : null
//               }
//               onMovePrevRequest={() => movePrev(project.id)}
//               onMoveNextRequest={() => moveNext(project.id)}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Portfolio;
