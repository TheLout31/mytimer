import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const [List, setList] = useState({});

  const getData = async () => {
    const data = await AsyncStorage.getItem('timers');
    const result = JSON.parse(data);
    setList(result);
    console.log(List);
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.savedTitle}>Saved Timers</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={List}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              
              style={{
                backgroundColor: '#252533',
                padding: 10,
                borderRadius: 12,
                marginTop: 10,
                marginBottom: 10,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.Cardtext}>{item.category}</Text>
                <Text style={styles.Cardtext}>{item.time}s</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        item.status === 'completed'
                          ? '#4CB050'
                          : item.status === 'paused'
                          ? 'orange'
                          : item.status === 'running'
                          ? 'gray'
                          : 'gray', // Default color
                    },
                  ]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
    backgroundColor: '#0E0D1D',
  },
  text: {
    color: 'black',
    fontSize: 40,
    textAlign: 'center',
    marginTop: 50,
  },

  savedTitle: {fontSize: 18, marginTop: 20, fontWeight: 'bold', color: 'white'},
  savedItem: {fontSize: 16, marginTop: 5, color: 'white'},
  Cardtext: {
    color: 'white',
    fontSize: 18,
  },
  status: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#4CB050',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {color: 'white', fontSize: 14, fontWeight: 'bold'},
});

export default HomeScreen;
