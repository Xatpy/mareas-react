export const getMonthAndYearFilenameJson = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return `${year}_${month}.json`;
};

export const getDay = () => {
  return new Date().getDate();
};

export const getCurrentTime = () => {
  const today = new Date();
  return {
    hour: today.getHours(),
    minutes: today.getMinutes(),
    seconds: today.getSeconds(),
  };
};

export const getSpanTimeTide = (dayTide) => {
  const hourTitle = `${dayTide.tipo === "Alta" ? "⬆️" : "⬇️"}  ${
    dayTide.hora
  } - ${dayTide.tipo}`;
  return hourTitle;

  //   const spanTime = document.createElement("span");
  //   spanTime.innerHTML = hourTitle;
  //   spanTime.classList.add("spanTime");
  //   return spanTime;
};

export const getTideIndex = (currentTime, tides) => {
  let currentTimeMinutes = calculateTotalMinutes(
    currentTime.hour,
    currentTime.minutes
  );
  let arrayMinutes = tides.map((tide) => getTotalMinutesOfTide(tide));

  let tideIndex = -1;
  if (currentTimeMinutes < arrayMinutes[0]) {
    tideIndex = -1;
  } else if (currentTimeMinutes > arrayMinutes[arrayMinutes.length - 1]) {
    tideIndex = arrayMinutes.length - 1;
  } else {
    for (let i = 0; i < arrayMinutes.length - 1; ++i) {
      if (
        currentTimeMinutes >= arrayMinutes[i] &&
        currentTimeMinutes <= arrayMinutes[i + 1]
      ) {
        tideIndex = i;
      }
    }
  }
  return tideIndex;
};

const calculateTotalMinutes = (hour, minutes) => {
  return parseInt(hour) * 60 + parseInt(minutes);
};

const getTotalMinutesOfTide = (tide) => {
  const [tideHour, tideMinutes] = tide.hora
    .substr(0, tide.hora.indexOf(" "))
    .split(":");
  return calculateTotalMinutes(tideHour, tideMinutes);
};

export const createTitle = (currentTime) => {
  const emojiTime = getEmojiTime(currentTime.hour, currentTime.minutes);
  const time = `🗓 ${getTodayDate()} || ${formatTiming(
    currentTime.hour
  )}:${formatTiming(currentTime.minutes)}h ${emojiTime}`;
  const location = "Conil de la Frontera";
  return {
    day: `🌊 Mareas en ${location} 🏖️`,
    date: time,
  };
  //   document.getElementById("day").textContent = `🌊 Mareas en ${location} 🏖️`;
  //   document.getElementById("date").textContent = time;
};

const getEmojiTime = (hour, minutes) => {
  if (hour >= 12) {
    hour = hour - 12;
  }
  if (hour === 0) {
    return minutes < 30 ? "🕛" : "🕧";
  } else if (hour === 1) {
    return minutes < 30 ? "🕐" : "🕜";
  } else if (hour === 2) {
    return minutes < 30 ? "🕑" : "🕝";
  } else if (hour === 3) {
    return minutes < 30 ? "🕒" : "🕞";
  } else if (hour === 4) {
    return minutes < 30 ? "🕓" : "🕟";
  } else if (hour === 5) {
    return minutes < 30 ? "🕔" : "🕠";
  } else if (hour === 6) {
    return minutes < 30 ? "🕕" : "🕡";
  } else if (hour === 7) {
    return minutes < 30 ? "🕖" : "🕢";
  } else if (hour === 8) {
    return minutes < 30 ? "🕗" : "🕣";
  } else if (hour === 9) {
    return minutes < 30 ? "🕘" : "🕤";
  } else if (hour === 10) {
    return minutes < 30 ? "🕙" : "🕥";
  } else if (hour === 11) {
    return minutes < 30 ? "🕚" : "🕦";
  } else {
    return "🕰";
  }
};

const getTodayDate = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return date;
};

const formatTiming = (numberStr) => {
  return numberStr.toString().length === 1 ? "0" + numberStr : numberStr;
};

const getPercentagePassed = (
  tides,
  index,
  currentTime,
  previousDayTides,
  nextDayTides
) => {
  let totalDifference = -1;
  let minutes = calculateTotalMinutes(currentTime.hour, currentTime.minutes);
  if (index === -1) {
    let minutesFromPrevDay = 0;
    if (previousDayTides !== null) {
      minutesFromPrevDay =
        calculateTotalMinutes("23", "59") -
        getTotalMinutesOfTide(previousDayTides[previousDayTides.length - 1]);
    }
    totalDifference = getTotalMinutesOfTide(tides[0]) + minutesFromPrevDay;
    minutes += minutesFromPrevDay;
  } else if (index === tides.length - 1) {
    const endOfDayMinutes = calculateTotalMinutes("23", "59");
    totalDifference =
      endOfDayMinutes - getTotalMinutesOfTide(tides[tides.length - 2]);
    minutes = endOfDayMinutes - minutes;
  } else {
    totalDifference =
      getTotalMinutesOfTide(tides[index + 1]) -
      getTotalMinutesOfTide(tides[index]);
    minutes = getTotalMinutesOfTide(tides[index + 1]) - minutes;
  }
  const percentage = 100 - ((minutes / totalDifference) * 100.0).toFixed();
  return percentage;
};

export const getTideStatus = (
  tides,
  index,
  currentTime,
  previousDayTides,
  nextDayTides
) => {
  let status = "";
  let goingDown = false;
  if (index === -1) {
    if (tides[0].tipo === "Alta") {
      status += "⏫ Subiendo...";
    } else {
      status += "⏬ Bajando...";
      goingDown = true;
    }
  } else {
    if (tides[index].tipo === "Alta") {
      status += "⏬ Bajando... ";
      goingDown = true;
    } else {
      status += "⏫ Subiendo... ";
    }
  }
  const percentage = getPercentagePassed(
    tides,
    index,
    currentTime,
    previousDayTides,
    nextDayTides
  );
  status += ` ${percentage}%`;
  return [status, percentage, goingDown];
};
