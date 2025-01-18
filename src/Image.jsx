import PropTypes from "prop-types";
import "./Image.css";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

function Image({ dataProp }) {
  const {
    height,
    width,
    imageBgColor,
    borderWidth,
    borderColor,
    textSize,
    textColor,
    globalZoom,
    imageData,
    name,
  } = dataProp;

  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(globalZoom);
  const oldZoomRef = useRef({
    global: globalZoom,
    zoom: zoom,
    latestIsGlobal: true,
  });
  const oldZoom = oldZoomRef.current;
  if (oldZoom.global !== globalZoom) {
    oldZoom.global = globalZoom;
    oldZoom.latestIsGlobal = true;
  } else if (oldZoom.zoom !== zoom) {
    oldZoom.zoom = zoom;
    oldZoom.latestIsGlobal = false;
  }
  const containerRef = useRef();

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const scaleFactor = 0.1;
      let newZoom = zoom + (e.deltaY < 0 ? scaleFactor : -scaleFactor);
      newZoom = Math.max(0.1, Math.min(newZoom, 10)); // Min and max zoom limits
      setZoom(newZoom);
    };
    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup listener on unmount
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [zoom]);

  return (
    <div className="image-container" style={{ fontSize: textSize + "rem" }}>
      <div
        className="image-wrapper"
        ref={containerRef}
        style={{
          backgroundColor: imageBgColor,
          borderWidth: borderWidth,
          borderColor: borderColor,
          cursor: isDragging ? "grabbing" : "grab",
          height: height + "px",
          width: width + "px",
        }}
      >
        <img
          src={imageData}
          style={{
            transform: `scale(${oldZoom.latestIsGlobal ? globalZoom : zoom})`,
            height: height + "px",
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
      </div>
      <h3 style={{ color: textColor }}>{name}</h3>
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
    textSize: PropTypes.number.isRequired,
    textColor: PropTypes.string.isRequired,
    globalZoom: PropTypes.number.isRequired,
    imageData: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Image;
