import { useState } from "react";
import "./App.css";
import Image from "./Image.jsx";

function App() {
  const [height, setHeight] = useState(250);
  const [width, setWidth] = useState(250);
  const [imageBgColor, setImageBgColor] = useState("blue");
  const [bgColor, setBgColor] = useState("white");
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderColor, setBorderColor] = useState("black");
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);

  function recieveFiles(event) {
    console.log("recieving files");
    const fileData = {};
    const files = event.target.files;
    function readFile(file, addUnit, length) {
      let reader = new FileReader();
      console.log("reading a file");
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
      console.log("file read:", arguments);
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

  function recieveData(event) {
    let text = event.target.value;
    const entries = {};
    text
      .split("\n")
      .map((line) => line.split("\t"))
      .map((entry) => {
        return {
          id: entry[0],
          name: entry[1],
          order: Number(entry[2]),
        };
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

        <label htmlFor="" className="borderWidth">
          Border width (px):{" "}
          <input
            type="number"
            name=""
            id=""
            value={borderWidth}
            onChange={(e) => {
              setBorderWidth(e.target.value);
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
        <label htmlFor="" className="uploadBtn">
          Upload Images: <input type="file" onChange={recieveFiles} multiple />
        </label>
        <label htmlFor="" className="centerAllBtn">
          <button>Center all images</button>
        </label>
        <label htmlFor="" className="dataInput">
          Name | ID | Order{" "}
          <textarea name="" id="" onChange={recieveData}></textarea>
        </label>
      </div>
      <div id="output-container" style={{ backgroundColor: bgColor }}>
        {(() => {
          const imagesSorted = Object.values(images).sort(
            (a, b) => data[a.id].order - data[b.id].order
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
                  imageData: image.src,
                  name: data[image.id].name,
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
