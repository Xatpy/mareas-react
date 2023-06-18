import React, { useEffect } from "react";

import "./Container.css";

import { useFetch } from "../../hooks/useFetch";
import {
  getCurrentTime,
  getDay,
  getMonthAndYearFilenameJson,
  getTideIndex,
  createTitle,
  getTideStatus,
  getSpanTimeTide,
} from "../utils/utils";

import { Tide } from "./Tide";

export const Container: React.FC = () => {
  const jsonFileName = getMonthAndYearFilenameJson();

  const urlJson = `https://raw.githubusercontent.com/Xatpy/mareas/main/data/${jsonFileName}`;

  const { data, error } = useFetch<any>(urlJson);

  if (error) return <p>There is an error.</p>;
  if (!data) return <p>Loading...</p>;

  const currentDay = getDay();
  const dayTides = data.dias[currentDay - 1].mareas;
  const previousDayTides =
    currentDay > 1 ? data.dias[currentDay - 2].mareas : null;
  const nextDayTides =
    currentDay < data.dias.length ? data.dias[currentDay].mareas : null;

  let currentTime = getCurrentTime();
  /*currentTime = {
            "hour": "17",
            "minutes": "45",
            "seconds": "0"
        }*/

  const tideIndex = getTideIndex(currentTime, dayTides);

  const { day, date } = createTitle(currentTime);

  let tides = [];

  for (let i = -1; i < dayTides.length; ++i) {
    if (i >= 0) {
      // tideElement.appendChild(getSpanTimeTide(dayTides[i]));
      // tideElement.classList.add("selectedTide");
      tides.push({ text: getSpanTimeTide(dayTides[i]), active: false });
    }

    if (tideIndex === i) {
      const statusTide = getTideStatus(
        dayTides,
        tideIndex,
        currentTime,
        previousDayTides,
        nextDayTides
      );

      tides[i].active = true;
      //const el = document.createElement("div");
      //el.id = "selectedTide";
      //el.appendChild(document.createTextNode(statusTide[0]));
      //tideElement.appendChild(el);
      //el.classList.add("selectedTidePercentage");

      //   const divForCanvas = document.createElement("div");
      //   divForCanvas.id = "divForCanvas";
      //   const canvas = document.createElement("canvas");
      //   canvas.id = "canvasElement";
      //   const goingDown = statusTide[2];
      //   let percentage = statusTide[1];
      //   if (goingDown) {
      //     divForCanvas.style.transform = "scale(-1, 1)";
      //     percentage = 100 - percentage;
      //   }
      //   divForCanvas.appendChild(canvas);
      //   el.appendChild(divForCanvas);

      //createManometer(percentage, goingDown);
    }
  }

  const setCSSTides = () => {
    const numberOfTides = tides.length;
    const HEIGHT_HEADER = 13;
    const HEIGHT_SECUNDARY_TIDE = 3;

    // const initialTide = document.getElementById("marea0");
    let mainTideHeight = -1;
    if (tideIndex != -1) {
      mainTideHeight =
        100 - HEIGHT_HEADER - (numberOfTides - 1) * HEIGHT_SECUNDARY_TIDE;
      // initialTide.style.height = 0;
    } else {
      mainTideHeight =
        100 - HEIGHT_HEADER - numberOfTides * HEIGHT_SECUNDARY_TIDE;
      // initialTide.style.height = `${mainTideHeight}vh`;
      tides[0].height = mainTideHeight;
    }

    for (let index = 0; index < numberOfTides; ++index) {
      const tideElement = document.getElementById(`marea${index + 1}`);
      if (index === tideIndex) {
        // tideElement.style.height = `${mainTideHeight}vh`;
        tides[index].height = mainTideHeight;
      } else {
        // tideElement.style.height = `${HEIGHT_SECUNDARY_TIDE}vh`;
        tides[index].height = HEIGHT_SECUNDARY_TIDE;
      }
    }
  };
  setCSSTides();

  return (
    <div className="mainContainer">
      <div>Json: {jsonFileName}</div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {tides.map((t) => (
          <Tide text={t.text} active={t.active} height={t.height} />
        ))}
      </div>
    </div>
  );
};
