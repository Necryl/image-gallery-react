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
    globalPosOffset,
    imageData,
    name,
  } = dataProp;

  const [isDragging, setIsDragging] = useState(false);
  const [posOffset, setPosOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragRef = useRef({
    start: { ...position },
    offset: null,
  });

  const drag = dragRef.current;

  const oldPosOffsetRef = useRef({
    global: globalPosOffset[0],
    globalCounter: globalPosOffset[1],
    pos: posOffset,
    latestIsGlobal: true,
  });
  const oldPosOffset = oldPosOffsetRef.current;
  if (oldPosOffset.globalCounter !== globalPosOffset[1]) {
    oldPosOffset.global = globalPosOffset[0];
    oldPosOffset.globalCounter = globalPosOffset[1];
    oldPosOffset.latestIsGlobal = true;
  } else if (oldPosOffset.pos !== posOffset) {
    oldPosOffset.pos = posOffset;
    oldPosOffset.latestIsGlobal = false;
  }

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

  //zooming
  useEffect(() => {
    const container = containerRef.current;

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

    // Cleanup listener on unmount
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [globalZoom, oldZoom, zoom]);

  //dragging
  useEffect(() => {
    const imageElem = imageRef.current;

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
    const handleMouseDown = (e) => {
      setIsDragging(true);
      drag.start = { x: e.clientX, y: e.clientY };
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - drag.start.x; // Calculate the mouse movement
      const deltaY = e.clientY - drag.start.y;

      setPosOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY })); // Update visual position
      drag.start = { x: e.clientX, y: e.clientY }; // Update the last mouse position
    };
    if (imageElem) {
      imageElem.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      if (imageElem) {
        imageElem.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, [drag, isDragging]);

  //positioning
  useEffect(() => {
    const imageElem = imageRef.current;

    if (imageElem) {
      const center = {
        x: -(imageElem.offsetWidth / 2 - width / 2),
        y: -(imageElem.offsetHeight / 2 - height / 2),
      };
      const newX =
        (oldPosOffset.latestIsGlobal ? globalPosOffset[0].x : posOffset.x) +
        center.x;
      const newY =
        (oldPosOffset.latestIsGlobal ? globalPosOffset[0].y : posOffset.y) +
        center.y;
      setPosition({ x: newX, y: newY });
    }
  }, [
    globalPosOffset,
    height,
    oldPosOffset.latestIsGlobal,
    posOffset.x,
    posOffset.y,
    width,
  ]);

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
            transformOrigin: "center center",
            transform: `translate(${position.x}px, ${position.y}px) scale(${
              oldZoom.latestIsGlobal ? globalZoom : zoom
            })`,
            height: height + "px",
          }}
          alt={"image of " + name}
        />
      </div>
      <h3 style={{ color: textColor, width: width + "px" }}>{name}</h3>
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
    globalPosOffset: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        }),
        PropTypes.number,
      ])
    ),
    imageData: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Image;
