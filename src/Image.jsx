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
    globalPosition,
    imageData,
    name,
  } = dataProp;

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(globalPosition);
  const oldPositionRef = useRef({
    global: globalPosition,
    position: position,
    latestIsGlobal: true,
  });
  const oldPosition = oldPositionRef.current;
  if (oldPosition.global !== globalPosition) {
    oldPosition.global = globalPosition;
    oldPosition.latestIsGlobal = true;
  } else if (oldPosition.position !== position) {
    oldPosition.position = position;
    oldPosition.latestIsGlobal = false;
  }

  const dragPosRef = useRef({
    startDrag: { x: 0, y: 0 },
  });
  const dragPos = dragPosRef.current;

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
  const imageRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const imageElem = imageRef.current;
    const handleMouseUp = (e) => {
      setIsDragging(false);
      const rect = e.target.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    };
    const handleMouseDown = (e) => {
      dragPos.startDrag = { x: e.clientX, y: e.clientY };
      setIsDragging(true);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragPos.startDrag.x;
      const deltaY = e.clientY - dragPos.startDrag.y;

      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });
    };
    const handleWheel = (e) => {
      e.preventDefault();
      const scaleFactor = 0.1;
      let newZoom =
        (oldZoom.latestIsGlobal ? globalZoom : zoom) +
        (e.deltaY < 0 ? scaleFactor : -scaleFactor);
      newZoom = Math.max(0.1, Math.min(newZoom, 10)); // Min and max zoom limits
      setZoom(newZoom);
      oldZoom.latestIsGlobal = false;
    };
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    if (imageElem) {
      imageElem.addEventListener("mousedown", handleMouseDown);
      imageElem.addEventListener("mousemove", handleMouseMove);
      imageElem.addEventListener("mouseup", handleMouseUp);
      imageElem.addEventListener("mouseleave", handleMouseUp);
    }

    // Cleanup listener on unmount
    return () => {
      if (imageElem) {
        imageElem.removeEventListener("mousedown", handleMouseDown);
        imageElem.removeEventListener("mousemove", handleMouseMove);
        imageElem.removeEventListener("mouseup", handleMouseUp);
        imageElem.removeEventListener("mouseleave", handleMouseUp);
      }
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [dragPos, globalZoom, isDragging, oldZoom, position.x, position.y, zoom]);

  console.log(
    ` Image (${name}): setting translate(${
      oldPosition.latestIsGlobal
        ? `${oldPosition.global.x}px, ${oldPosition.global.y}px`
        : `${position.x}px, ${position.y}px`
    })`
  );

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
          ref={imageRef}
          style={{
            transform: `scale(${
              oldZoom.latestIsGlobal ? globalZoom : zoom
            }) translate(${
              oldPosition.latestIsGlobal
                ? `${oldPosition.global.x}%, ${oldPosition.global.y}%`
                : `${position.x}%, ${position.y}%`
            })`,
            height: height + "px",
          }}
          alt={"image of " + name}
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
    globalPosition: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    imageData: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Image;
