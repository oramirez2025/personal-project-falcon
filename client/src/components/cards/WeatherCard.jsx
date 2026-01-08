import { useState, useEffect } from "react";
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

  useEffect(() => {
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
        <Heading size="2xl" color="red.400">
          {currTemp !== null ? `${currTemp}°` : "--"}
        </Heading>

        {/* Feels like */}
        <Text color="gray.400">
          Feels like{" "}
          <Text as="span" color="white">
            {feelsLikeTemp !== null ? `${feelsLikeTemp}°` : "--"}
          </Text>
        </Text>

        {/* High / Low */}
        <HStack spacing={4}>
          <Text color="gray.400">
            H{" "}
            <Text as="span" color="white">
              {maxTemp !== null ? `${maxTemp}°` : "--"}
            </Text>
          </Text>

          <Text color="gray.400">
            L{" "}
            <Text as="span" color="white">
              {minTemp !== null ? `${minTemp}°` : "--"}
            </Text>
          </Text>
        </HStack>
      </VStack>
    </BaseCard>
  );
}
