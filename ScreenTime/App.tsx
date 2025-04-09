import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeModules } from 'react-native';
import AppList from './components/AppList';
const { ScreenTimeModule } = NativeModules;
const { WorkManagerModule } = NativeModules;

const App = () => {
  const [screenTime, setScreenTime] = useState<string | null>(null);
  const [appUsage, setAppUsage] = useState([]);

  WorkManagerModule.startWork();

  useEffect(() => {
    fetchScreenTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatTime(minutes: number) {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}min`
        : `${hours}h`;
    }
    return `${minutes}min`;
  }

  const fetchScreenTime = async () => {
    try {
      const response = await ScreenTimeModule.getScreenTime();
      console.log('Screen Time Data:', response);
      setScreenTime(formatTime(response.screenTimeMinutes));
      setAppUsage(response.appScreenTime || {});
      let appUsageData: any = [];
      Object.entries(response.appScreenTime).forEach(([app, time]) => {
        if (time > 0) {
          let appName;
          if (app.split('.').pop() === 'android') {
            let splitedAppNames = app.split('.');
            appName = splitedAppNames[splitedAppNames.length - 2];
          } else {
            appName = app.split('.').pop();
          }
          appUsageData.push({
            id: app,
            appName: appName,
            time: formatTime(time),
          });
        }
      });
      //console.log(formatTime(response.screenTimeMinutes));
      //console.log(appUsageData);

      setAppUsage(appUsageData || []);


    } catch (error) {
      console.error('Error fetching screen time:', error);
      // Narrow the type of 'error'
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Could not fetch screen time.';

      Alert.alert('Error', errorMessage);
    }
  };

  const openUsageAccessSettings = () => {
    ScreenTimeModule.requestUsageAccess();
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Screen Time</Text>

      {screenTime ? (
        <View style={styles.DataContainer}>
          <Text style={styles.text}>Total Screen Time:</Text>
          <Text style={styles.value}>
            {screenTime}
          </Text>
        </View>
      ) : (
        <Text style={styles.text}>Fetching data...</Text>
      )}

      <Text style={styles.subHeader}>App Usage:</Text>
      {Object.entries(appUsage).length > 0 ? (
        <AppList appUsage={appUsage} />
      ) : (
        <Text style={styles.text}>No data available</Text>
      )}

      <View style={styles.buttonStyles}>
        <Button title="Refresh Screen Time" onPress={fetchScreenTime} />
      </View>
      <View style={styles.buttonStyles}>
        <Button title="Grant Usage Access" onPress={openUsageAccessSettings} />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#272d44',
    padding: 20,
  },
  DataContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#272d44',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  subHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },

  buttonStyles: {
    marginTop: 20,
  },
});

export default App;
