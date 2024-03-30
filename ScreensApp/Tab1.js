import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import CameraView from './CameraView';
import { AntDesign } from '@expo/vector-icons';
const Tab1 = () => {
  // URL của camera
  const cameraUrl = 'http://192.168.1.22:4747/video';
  const [showCamera, setShowCamera] = useState(false);
  const handleButtonPress = () => {
    setShowCamera(true);
  };

  const handleStopVideo = () => {
    setShowCamera(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#B0E2FF", height: 40 }}></View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ứng dụng Camera</Text>
        <AntDesign style={{ marginLeft: 10 }} name="camera" size={24} color="white" />
      </View>
      <View style={styles.videoContainer}>
        <View style={styles.buttonContainer}>
          {showCamera && <Button title='Tắt camera' onPress={handleStopVideo} />}
          {showCamera && <CameraView cameraUrl={cameraUrl} />}
        </View>
        <View style={styles.buttonContainer}>
          {!showCamera && <Button title='Xem camera' onPress={handleButtonPress} />}
          <View></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#007bff',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  videoContainer: {
    width:'100%',
    flex: 1,
    aspectRatio: 9 / 9, // tỷ lệ khung hình cho camera
    position: 'absolute',
    alignSelf: 'center',
    alignItems:'center',
    justifyContent:'center',
    marginTop:220,

  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent:'center',
    alignItems:'center',
  },

});

export default Tab1;
