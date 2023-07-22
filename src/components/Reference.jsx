import React, { useState } from "react";
import "./Reference.css";
import data from "../Data";

const Datapack = () => {
  data.map((onehouse) => {
    const { id, image, title, description } = onehouse;

    return (
      <div key={id}>
        <img src={image} />
        <h2>{title}</h2>
        <p>{description}</p>
        <h2>KUKUKU</h2>
      </div>
    );
  });
};

export default Datapack;
