import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type LocationData = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
};

type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
};

export default function HomeScreen() {
  const [cityInput, setCityInput] = useState('Da Nang');

  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // =========================
  // WEATHER CODE
  // =========================

  const getWeatherInfo = (code: number) => {
    if (code === 0) {
      return {
        icon: '☀️',
        description: 'Clear sky',
      };
    }

    if (code === 1 || code === 2) {
      return {
        icon: '🌤️',
        description: 'Partly cloudy',
      };
    }

    if (code === 3) {
      return {
        icon: '☁️',
        description: 'Cloudy',
      };
    }

    if (
      code === 45 ||
      code === 48
    ) {
      return {
        icon: '🌫️',
        description: 'Foggy',
      };
    }

    if (
      code >= 51 &&
      code <= 57
    ) {
      return {
        icon: '🌦️',
        description: 'Drizzle',
      };
    }

    if (
      code >= 61 &&
      code <= 67
    ) {
      return {
        icon: '🌧️',
        description: 'Rainy',
      };
    }

    if (
      code >= 71 &&
      code <= 77
    ) {
      return {
        icon: '❄️',
        description: 'Snowy',
      };
    }

    if (
      code >= 80 &&
      code <= 82
    ) {
      return {
        icon: '🌧️',
        description: 'Rain showers',
      };
    }

    if (
      code === 95 ||
      code === 96 ||
      code === 99
    ) {
      return {
        icon: '⛈️',
        description: 'Thunderstorm',
      };
    }

    return {
      icon: '🌤️',
      description: 'Unknown',
    };
  };

  // =========================
  // SEARCH WEATHER
  // =========================

  const searchWeather = async () => {
    Keyboard.dismiss();

    const city = cityInput.trim();

    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setWeather(null);

      // =========================
      // 1. TÌM THÀNH PHỐ
      // =========================

      const locationResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );

      if (!locationResponse.ok) {
        throw new Error('Location request failed');
      }

      const locationData =
        await locationResponse.json();

      if (
        !locationData.results ||
        locationData.results.length === 0
      ) {
        throw new Error('City not found');
      }

      const result = locationData.results[0];

      const newLocation: LocationData = {
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
      };

      setLocation(newLocation);

      // =========================
      // 2. LẤY THỜI TIẾT
      // =========================

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
      );

      if (!weatherResponse.ok) {
        throw new Error('Weather request failed');
      }

      const weatherData =
        await weatherResponse.json();

      const current = weatherData.current;

      const newWeather: WeatherData = {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
      };

      setWeather(newWeather);
    } catch (error) {
      setLocation(null);
      setWeather(null);

      setError(
        'Cannot find weather data. Please check the city name.'
      );
    } finally {
      setLoading(false);
    }
  };

  const weatherInfo = weather
    ? getWeatherInfo(weather.weatherCode)
    : null;

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <Text style={styles.smallTitle}>
        REAL-TIME WEATHER
      </Text>

      <Text style={styles.title}>
        Clima
      </Text>

      <Text style={styles.subtitle}>
        Check current weather anywhere
      </Text>

      {/* SEARCH */}

      <View style={styles.searchContainer}>

        <TextInput
          style={styles.input}
          placeholder="Enter city..."
          placeholderTextColor="#8AA5B5"
          value={cityInput}
          onChangeText={setCityInput}
          onSubmitEditing={searchWeather}
        />

        <Pressable
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={searchWeather}
        >
          <Text style={styles.searchIcon}>
            🔍
          </Text>
        </Pressable>

      </View>

      {/* ERROR */}

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {/* LOADING */}

      {loading && (
        <View style={styles.loadingBox}>

          <ActivityIndicator
            size="large"
            color="#3A80F2"
          />

          <Text style={styles.loadingText}>
            Getting weather data...
          </Text>

        </View>
      )}

      {/* WEATHER */}

      {!loading && weather && location && weatherInfo && (

        <View style={styles.weatherCard}>

          <Text style={styles.city}>
            📍 {location.name}
          </Text>

          <Text style={styles.country}>
            {location.country}
          </Text>

          <Text style={styles.weatherIcon}>
            {weatherInfo.icon}
          </Text>

          <Text style={styles.temperature}>
            {Math.round(weather.temperature)}°
          </Text>

          <Text style={styles.condition}>
            {weatherInfo.description}
          </Text>

          {/* DETAILS */}

          <View style={styles.detailsRow}>

            <View style={styles.detailBox}>

              <Text style={styles.detailIcon}>
                💧
              </Text>

              <Text style={styles.detailValue}>
                {weather.humidity}%
              </Text>

              <Text style={styles.detailLabel}>
                Humidity
              </Text>

            </View>

            <View style={styles.detailBox}>

              <Text style={styles.detailIcon}>
                💨
              </Text>

              <Text style={styles.detailValue}>
                {weather.windSpeed}
              </Text>

              <Text style={styles.detailLabel}>
                km/h Wind
              </Text>

            </View>

          </View>

          {/* REFRESH */}

          <Pressable
            style={styles.refreshButton}
            onPress={searchWeather}
          >
            <Text style={styles.refreshText}>
              🔄 REFRESH WEATHER
            </Text>
          </Pressable>

        </View>
      )}

      {/* INITIAL STATE */}

      {!loading && !weather && error === '' && (

        <View style={styles.emptyState}>

          <Text style={styles.emptyIcon}>
            🌤️
          </Text>

          <Text style={styles.emptyTitle}>
            Search for a city
          </Text>

          <Text style={styles.emptyText}>
            Get real-time weather information
          </Text>

        </View>
      )}

      <Text style={styles.footer}>
        Powered by Open-Meteo
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF',
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  smallTitle: {
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 3,
    color: '#6C8EA3',
    fontWeight: '700',
  },

  title: {
    textAlign: 'center',
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1B4965',
    marginTop: 5,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6C8EA3',
    marginTop: 4,
    marginBottom: 20,
  },

  // SEARCH

  searchContainer: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 4,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1B4965',
  },

  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#3A80F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },

  searchIcon: {
    fontSize: 19,
  },

  buttonPressed: {
    transform: [
      {
        scale: 0.92,
      },
    ],
  },

  // ERROR

  error: {
    color: '#E85D75',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },

  // LOADING

  loadingBox: {
    alignItems: 'center',
    marginTop: 60,
  },

  loadingText: {
    marginTop: 12,
    color: '#6C8EA3',
    fontSize: 14,
  },

  // WEATHER CARD

  weatherCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 18,

    shadowColor: '#6C8EA3',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,

    elevation: 6,
  },

  city: {
    fontSize: 19,
    fontWeight: '700',
    color: '#315A70',
  },

  country: {
    fontSize: 12,
    color: '#8AA5B5',
    marginTop: 3,
  },

  weatherIcon: {
    fontSize: 65,
    marginTop: 8,
  },

  temperature: {
    fontSize: 58,
    fontWeight: 'bold',
    color: '#1B4965',
    marginTop: -4,
  },

  condition: {
    fontSize: 17,
    color: '#6C8EA3',
    fontWeight: '600',
    marginTop: -5,
  },

  // DETAILS

  detailsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  detailBox: {
    flex: 1,
    backgroundColor: '#F2FAFD',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
  },

  detailIcon: {
    fontSize: 20,
  },

  detailValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#315A70',
    marginTop: 3,
  },

  detailLabel: {
    fontSize: 11,
    color: '#8AA5B5',
    marginTop: 2,
  },

  // REFRESH

  refreshButton: {
    marginTop: 18,
    backgroundColor: '#EAF7FF',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 13,
  },

  refreshText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3A80F2',
  },

  // EMPTY

  emptyState: {
    alignItems: 'center',
    marginTop: 55,
  },

  emptyIcon: {
    fontSize: 55,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#527487',
    marginTop: 10,
  },

  emptyText: {
    fontSize: 12,
    color: '#8AA5B5',
    marginTop: 5,
  },

  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: '#9AAEB8',
    marginTop: 18,
  },
});