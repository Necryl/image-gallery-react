import PropTypes from "prop-types";
import "./Image.css";
import { useState } from "react";

function Image({ dataProp }) {
  const {
    height,
    width,
    imageBgColor,
    borderWidth,
    borderColor,
    imageData,
    name,
  } = dataProp;

  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 0.1;
    let newZoom = zoom + (e.deltaY < 0 ? scaleFactor : -scaleFactor);
    newZoom = Math.max(0.5, Math.min(newZoom, 3)); // Min and max zoom limits
    setZoom(newZoom);
  };

  return (
    <div
      className="image-container"
      onWheel={handleWheel}
      style={{
        backgroundColor: imageBgColor,
        borderWidth: borderWidth,
        borderColor: borderColor,
        cursor: isDragging ? "grabbing" : "grab",
        height: height + "px",
        width: width + "px",
        overflow: "hidden",
      }}
    >
      <img
        src={imageData}
        style={{
          height: height + "px",
          width: width + "px",
          transform: `scale(${zoom})`,
        }}
        alt={"image of " + name}
        onMouseDown={() => {
          setIsDragging(true);
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseLeave={() => {
          setIsDragging(false);
        }}
      />
      <h3>{name}</h3>
    </div>
  );
}

Image.propTypes = {
  dataProp: PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    imageBgColor: PropTypes.string.isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.string.isRequired,
    imageData: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Image;
