import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import useWeatherApi from "./hooks/useWeatherApi";
import { getMoment, findLocation } from "./utils/helper";
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from "./views/WeatherSetting";

const AUTH_KEY = "CWB-6477226A-6F44-4D1A-9908-5AD5F29C9E98";
// const locationName = "臺北";
// const cityName = "臺北市";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const usePrevProps = (value) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// };

const App = () => {
  const sotrageCity = localStorage.getItem("cityName") || "臺北市";
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const [currentCity, setCurrentCity] = useState(sotrageCity);
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  const { cityName, locationName, sunriseCityName } = currentLocation;
  // const {cityName, locationName, sunriseName} = currentCity
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  const [weatherElement, fetchData] = useWeatherApi({
    AUTH_KEY,
    locationName,
    cityName,
  });

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);
  // const prevHandleCount = usePrevProps(fetchData);
  // console.log(
  //   "兩次函數是否相等(useCallback範例)",
  //   prevHandleCount === fetchData
  // );
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            {...weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentPageChange={handleCurrentPageChange}
            handleCurrentCityChange={handleCurrentCityChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
