import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeathData = async ({ AUTH_KEY, locationName }) => {
  const res = await fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTH_KEY}&locationName=${locationName}`
  );
  const { records } = await res.json();
  const locationData = records.location[0];
  // locationData.weatherElement取出[WDSD, TEMP]
  const weatherElements = locationData.weatherElement.reduce(
    (prev, element) => {
      if (["WDSD", "TEMP"].includes(element.elementName)) {
        prev[element.elementName] = element.elementValue;
      }
      return prev;
    },
    {}
  );
  return {
    locationName: locationData.locationName,
    windSpeed: weatherElements["WDSD"],
    temperature: weatherElements["TEMP"],
    observationTime: locationData.time.obsTime,
  };
  // return fetch(
  //   `${LOCATION_API}?Authorization=${AUTH_KEY}&locationName=${locationName}`
  // )
  //   .then((res) => res.json())
  //   .then(({ records }) => {
  //     const locationData = records.location[0];
  //     // locationData.weatherElement取出[WDSD, TEMP]
  //     const weatherElements = locationData.weatherElement.reduce(
  //       (prev, element) => {
  //         if (["WDSD", "TEMP"].includes(element.elementName)) {
  //           prev[element.elementName] = element.elementValue;
  //         }
  //         return prev;
  //       },
  //       {}
  //     );
  //     return {
  //       locationName: locationData.locationName,
  //       windSpeed: weatherElements["WDSD"],
  //       temperature: weatherElements["TEMP"],
  //       observationTime: locationData.time.obsTime,
  //     };
  //   });
};

const fetchWeatherForecast = async ({ AUTH_KEY, cityName }) => {
  const res = await fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTH_KEY}&locationName=${cityName}`
  );
  const { records } = await res.json();
  const locationData = records.location[0];
  const weatherElements = locationData.weatherElement.reduce(
    (prev, element) => {
      if (["Wx", "PoP", "CI"].includes(element.elementName)) {
        prev[element.elementName] = element.time[0].parameter;
      }
      return prev;
    },
    {}
  );
  return {
    description: weatherElements["Wx"].parameterName,
    weatherCode: weatherElements["Wx"].parameterValue,
    rainPossibility: weatherElements["PoP"].parameterName,
    comfortablibilty: weatherElements["CI"].parameterName,
  };

  // return fetch(
  //   `${LOCATION_36_API}?Authorization=${AUTH_KEY}&locationName=${cityName}`
  // )
  //   .then((res) => res.json())
  //   .then(({ records }) => {
  //     const locationData = records.location[0];
  //     const weatherElements = locationData.weatherElement.reduce(
  //       (prev, element) => {
  //         if (["Wx", "PoP", "CI"].includes(element.elementName)) {
  //           prev[element.elementName] = element.time[0].parameter;
  //         }
  //         return prev;
  //       },
  //       {}
  //     );
  //     return {
  //       description: weatherElements["Wx"].parameterName,
  //       weatherCode: weatherElements["Wx"].parameterValue,
  //       rainPossibility: weatherElements["PoP"].parameterName,
  //       comfortablibilty: weatherElements["CI"].parameterName,
  //     };
  //   });
};

const useWeatherApi = ({ AUTH_KEY, locationName, cityName }) => {
  const [weatherElement, setWeatherElement] = useState({
    locationName: "",
    description: "",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    weatherCode: 0,
    observationTime: new Date(),
    comfortablibilty: "",
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    setWeatherElement((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeathData({ AUTH_KEY, locationName }),
      fetchWeatherForecast({ AUTH_KEY, cityName }),
    ]);
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, [AUTH_KEY, locationName, cityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
