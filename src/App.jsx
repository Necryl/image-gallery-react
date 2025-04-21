import { useState } from "react";
import "./App.css";
import Image from "./Image.jsx";

function App() {
  const initialPosOffset = { x: 0, y: 0 };
  const [height, setHeight] = useState(150);
  const [width, setWidth] = useState(150);
  const [globalZoom, setGlobalZoom] = useState(1);
  const [globalPosOffset, setGlobalPosOffset] = useState([initialPosOffset, 0]);
  const [imageBgColor, setImageBgColor] = useState("#1979E7");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(0.75);
  const [bgColor, setBgColor] = useState("#F2F8FF");
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderColor, setBorderColor] = useState("#000000");
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);

  function receiveFiles(event) {
    const fileData = {};
    const files = event.target.files;
    function readFile(file, addUnit, length) {
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          // convert image file to base64 string
          let name = file.name.split(".")[0];
          addUnit(name, reader.result, file.name, length);
        },
        false
      );
      reader.readAsDataURL(file);
    }
    for (let i = 0; i < files.length; i++) {
      readFile(files[i], addUnit, files.length);
    }
    function addUnit(id, imageData, path, length) {
      fileData[id] = {
        src: imageData,
        path: path,
        id: id,
      };
      if (Object.keys(fileData).length === length) {
        setImages(fileData);
      }
    }
  }

  function receiveData(event) {
    let text = event.target.value;
    const entries = {};
    text
      .split("\n")
      .map((line) => line.split("\t"))
      .map((entry) => {
        return entry[0]
          ? {
              id: entry[0],
              name: entry[1] || entry[0],
              order: Number(entry[2]) || 1,
              subtext: entry[3] || "",
            }
          : false;
      })
      .forEach((entry) => {
        entries[entry.id] = entry;
      });
    setData(entries);
  }

  return (
    <div id="app">
      <div id="settings">
        <label htmlFor="" className="bgColor">
          Background color:{" "}
          <input
            type="color"
            name=""
            id=""
            value={bgColor}
            onChange={(e) => {
              setBgColor(e.target.value);
            }}
          />
        </label>
        <label htmlFor="" className="imageBgColor">
          Image Background color:{" "}
          <input
            type="color"
            name=""
            id=""
            value={imageBgColor}
            onChange={(e) => {
              setImageBgColor(e.target.value);
            }}
          />
        </label>
        <label className="height">
          Height (px):{" "}
          <input
            type="number"
            name=""
            id=""
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
            }}
          />
        </label>
        <label htmlFor="" className="width">
          Width (px):{" "}
          <input
            type="number"
            name=""
            id=""
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
            }}
          />
        </label>

        <label htmlFor="" className="borderWidth">
          Border width (px):{" "}
          <input
            type="number"
            name=""
            id=""
            value={borderWidth}
            onChange={(e) => {
              setBorderWidth(Number(e.target.value));
            }}
          />
        </label>
        <label htmlFor="" className="borderColor">
          Border Color:{" "}
          <input
            type="color"
            name=""
            id=""
            value={borderColor}
            onChange={(e) => {
              setBorderColor(e.target.value);
            }}
          />
        </label>
        <label htmlFor="" className="textSize">
          Text Size:
          <input
            type="number"
            name=""
            id=""
            value={textSize}
            onChange={(e) => {
              setTextSize(Number(e.target.value));
            }}
          />
        </label>
        <label htmlFor="" className="textColor">
          Text Color:
          <input
            type="color"
            name=""
            id=""
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value);
            }}
          />
        </label>
        <label htmlFor="" className="zoom">
          Set Scale on All Images (%):
          <input
            type="number"
            min={10}
            max={1000}
            name=""
            id=""
            value={globalZoom * 100}
            onChange={(e) => {
              setGlobalZoom(
                (() => {
                  const num = Number(e.target.value) / 100;
                  if (num >= 0.01 && num <= 10) {
                    return num;
                  } else if (num < 0.01) {
                    return 0.01;
                  } else {
                    return 10;
                  }
                })()
              );
            }}
          />
        </label>
        <label htmlFor="" className="centerAllBtn">
          <button
            onClick={() => {
              setGlobalPosOffset((prev) => [prev[0], prev[1] + 1]);
            }}
          >
            Center all images
          </button>
        </label>
        <label htmlFor="" className="uploadBtn">
          Load Images: <input type="file" onChange={receiveFiles} multiple />
        </label>
        <label htmlFor="" className="dataInput">
          Filename | Name | Order (Each column separated by TAB and each row by
          ENTER, or just copy paste such a table from Excel)
          <textarea name="" id="" onChange={receiveData}></textarea>
        </label>
      </div>
      <div id="output-container" style={{ backgroundColor: bgColor }}>
        {(() => {
          const imagesSorted = Object.values(images).sort((a, b) =>
            data[a.id] && data[b.id] ? data[a.id].order - data[b.id].order : 0
          );
          return imagesSorted.map((image, index) => {
            return (
              <Image
                dataProp={{
                  height,
                  width,
                  imageBgColor,
                  borderWidth,
                  borderColor,
                  textSize,
                  textColor,
                  globalZoom,
                  globalPosOffset,
                  imageData: image.src,
                  name: data[image.id] ? data[image.id].name : image.id,
                  subtext: data[image.id]?data[image.id].subtext:"",
                }}
                key={index}
              />
            );
          });
        })()}
      </div>
    </div>
  );
}

export default App;
