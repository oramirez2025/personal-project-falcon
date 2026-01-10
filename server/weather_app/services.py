import openmeteo_requests
import pandas as pd
from retry_requests import retry

def fetchWeather():
    # Setup the Open-Meteo API client with cache and retry on error
	retry_session = retry(retries = 5, backoff_factor = 0.2)
	openmeteo = openmeteo_requests.Client(session = retry_session)

	# Make sure all required weather variables are listed here
	# The order of variables in hourly or daily is important to assign them correctly below
	url = "https://api.open-meteo.com/v1/forecast"
	params = {
		"latitude": 40.93,
		"longitude": -73.89,
		"daily": ["temperature_2m_max", "temperature_2m_min"],
		"current": ["temperature_2m", "apparent_temperature"],
		"forecast_days": 1,
		"temperature_unit": "fahrenheit",
	}
	responses = openmeteo.weather_api(url, params=params)

	# Process first location. Add a for-loop for multiple locations or weather models
	response = responses[0]

	# Process current data. The order of variables needs to be the same as requested.
	current = response.Current()
	current_temperature_2m = current.Variables(0).Value()
	current_apparent_temperature = current.Variables(1).Value()

	# Process daily data. The order of variables needs to be the same as requested.
	daily = response.Daily()
	daily_temperature_2m_max = daily.Variables(0).ValuesAsNumpy()
	daily_temperature_2m_min = daily.Variables(1).ValuesAsNumpy()

	daily_data = {"date": pd.date_range(
		start = pd.to_datetime(daily.Time(), unit = "s", utc = True),
		end =  pd.to_datetime(daily.TimeEnd(), unit = "s", utc = True),
		freq = pd.Timedelta(seconds = daily.Interval()),
		inclusive = "left"
	)}

	daily_data["temperature_2m_max"] = daily_temperature_2m_max
	daily_data["temperature_2m_min"] = daily_temperature_2m_min
	return (int(current_temperature_2m), int(current_apparent_temperature), int(daily_temperature_2m_max[0]), int(daily_temperature_2m_min[0]))