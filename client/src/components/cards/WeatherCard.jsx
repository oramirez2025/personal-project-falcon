import { useState, useEffect, useRef } from "react";
import { Heading, Text, VStack, HStack } from "@chakra-ui/react";
import BaseCard from "./BaseCard";
import { grabWeather } from "../../utilities";

export default function WeatherCard() {
  const [weather, setWeather] = useState({
    currTemp: null,
    feelsLikeTemp: null,
    maxTemp: null,
    minTemp: null,
  });
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent StrictMode double-fetch
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchWeather = async () => {
      const data = await grabWeather();
      if (data) setWeather(data);
    };
    fetchWeather();
  }, []);

  const { currTemp, feelsLikeTemp, maxTemp, minTemp } = weather;

  return (
    <BaseCard hoverable={false}>
      <VStack align="stretch" spacing={4}>
        {/* Title */}
        <Heading size="md">Weather</Heading>

        {/* Current temp */}
        <Heading size="2xl" color="forge.red.400">
          {currTemp !== null ? ` ${currTemp}°` : "--"}
        </Heading>

        {/* Feels like */}
        <Text color="text.muted">
          Feels like{"  :  "}
          <Text as="span" color="text.primary">
            {feelsLikeTemp !== null ? ` ${feelsLikeTemp}°` : "--"}
          </Text>
        </Text>

        {/* High / Low */}
        <HStack spacing={4}>
          <Text color="text.muted">
            H{"  :  "}
            <Text as="span" color="text.primary">
              {maxTemp !== null ? `  ${maxTemp}°` : "--"}
            </Text>
          </Text>

          <Text color="text.muted">
            L{"  :  "}
            <Text as="span" color="text.primary">
              {minTemp !== null ? `${minTemp}°` : "--"}
            </Text>
          </Text>
        </HStack>
      </VStack>
    </BaseCard>
  );
}