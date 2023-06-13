import React, { useEffect } from "react";

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
    const tideElement = document.getElementById("marea" + (i + 1).toString());
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
      debugger;
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
  //   setCSSTides(tideIndex, dayTides.length);
  debugger;

  return (
    <div className="container">
      <div>Json: {jsonFileName}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {tides.map((t) => {
          return (
            <span>
              {t.text} - {t.active ? "true" : "false"}
            </span>
          );
        })}
      </div>
    </div>
  );
};
