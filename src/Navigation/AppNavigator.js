import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
import TimerScreen from '../Screens/TimerScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: '#262533',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          position: 'absolute',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 5},
          shadowOpacity: 0.3,
          shadowRadius: 10,
          paddingTop: 10,
        },

        tabBarIcon: ({focused}) => {
          let iconSource;

          if (route.name === 'Timer') {
            iconSource = require('../../assets/Icons/timer.png');
          } else if (route.name === 'History') {
            iconSource = require('../../assets/Icons/history.png');
          }

          return (
            <View
              style={{
                padding: 10,
                borderRadius: 10,
              }}>
              <Image
                source={iconSource}
                style={{
                  width: 22,
                  height: 22,
                  tintColor: focused ? '#FFFFFF' : '#B0B0B0',
                }}
                resizeMode="contain"
              />
            </View>
          );
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#B0B0B0',
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <Stack.Screen name="Timer" component={TimerScreen} />
      <Stack.Screen name="History" component={HomeScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default AppNavigator;
