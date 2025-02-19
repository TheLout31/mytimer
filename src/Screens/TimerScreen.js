import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const TimerScreen = () => {
  const [time, setTime] = useState(60);
  const [initialTime, setInitialTime] = useState('');
  const [running, setRunning] = useState(false);
  const [category, setCategory] = useState();
  const [savedTimers, setSavedTimers] = useState([]);
  const [saved, setSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            showCompletionModal('Timer Completed!');
            saveTimerStatus('completed');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    console.log('timer stopped!!!');
    setRunning(false);
    saveTimerStatus('paused');
    clearInterval(intervalRef.current);
  };
  
  const saveTimerStatus = async (status) => {
    const updatedTimers = savedTimers.map(timer =>
      timer.id === currentTimerId ? { ...timer, status } : timer
    );
    setSavedTimers(updatedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };
  

  

  const resetTimer = () => {
    stopTimer();
    setTime(initialTime);
    setCategory('');
    setSaved(false);
  };

  const saveTimer = async () => {
    const newTimer = {
      id: Date.now(),
      time: time,
      category: category,
      status: 'running',
    };
    const updatedTimers = [...savedTimers, newTimer];
    setSavedTimers(updatedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    setSaved(true);
  };

  // const loadTimers = async () => {
  //   const storedTimers = await AsyncStorage.getItem('timers');
  //   if (storedTimers) {
  //     setSavedTimers(JSON.parse(storedTimers));
  //   }
  // };

  const showCompletionModal = message => {
    setModalMessage(message);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <View>
          {/* <Text style={styles.title}>Timer</Text> */}
          {/* <AnimatedCircularProgress
        size={200}
        width={10}
        fill={(time / 60) * 100}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
      >
        {() => <Text style={styles.timerText}>{time}s</Text>}
      </AnimatedCircularProgress> */}
          {/* <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>
            {String(Math.floor(time / 3600)).padStart(2, '0')}{' '}
            <Text style={{fontSize: 25}}>h</Text>
          </Text>
          <Text style={styles.timerText}>
            {String(Math.floor((time % 3600) / 60)).padStart(2, '0')}{' '}
            <Text style={{fontSize: 25}}>m</Text>
          </Text>
          <Text style={styles.timerText}>
            {String(time % 60).padStart(2, '0')}{' '}
            <Text style={{fontSize: 25}}>s</Text>
          </Text>
        </View> */}
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>
              {time}
              <Text style={{fontSize: 25}}>s</Text>
            </Text>
          </View>

          {category ? (
            <View style={styles.Category}>
              <Text style={styles.CatText}>{category}</Text>
            </View>
          ) : null}

          <View style={{alignItems: 'center', marginTop: 15}}>
            <TextInput
              style={styles.input}
              placeholder="Enter Category"
              placeholderTextColor="#777777"
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#777777"
              placeholder="Set Timer (seconds)"
              keyboardType="numeric"
              value={initialTime.toString()}
              onChangeText={text => {
                const newTime = parseInt(text) || 0;
                setInitialTime(newTime);
                setTime(newTime);
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            {saved ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={startTimer}>
                  <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={stopTimer}>
                  <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={resetTimer}>
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.button} onPress={saveTimer}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}

            {/* <TouchableOpacity style={styles.button} onPress={resetTimer}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={saveTimer}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity> */}
          </View>

          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{modalMessage}</Text>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#0E0D1D',
  },
  title: {fontSize: 24, fontWeight: 'bold', color: '#FAFDF5', marginBottom: 25},
  // timerText: {fontSize: 30, fontWeight: 'bold', color: '#333'},
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FAFDF5',
    marginHorizontal: 5,
  },
  input: {
    borderBottomWidth: 1,
    width: '80%',
    marginVertical: 10,
    padding: 5,
    fontSize: 16,
    color: '#333',
    borderColor: '#333',
  },
  buttonContainer: {
    // flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    margin: 10,
    padding: 10,
    backgroundColor: '#D60036',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},

  Category: {
    margin: 10,
    padding: 10,
    backgroundColor: '#4A0B25',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D60036',
  },
  CatText: {color: 'white', fontSize: 16},

  savedTitle: {fontSize: 18, marginTop: 20, fontWeight: 'bold'},
  savedItem: {fontSize: 16, marginTop: 5, color: 'white'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#4A0B25',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D60036',
  },
  modalText: {fontSize: 18, fontWeight: 'bold', color: 'white'},
});

export default TimerScreen;
