import React, { useState } from 'react';
import { Text,View, StyleSheet, Dimensions, Alert,ActivityIndicator  } from 'react-native';
// import Video from 'react-native-video';
import { WebView } from 'react-native-webview';

const CameraView = ({ cameraUrl }) => {
  const [loading, setLoading] = useState(true);

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleLoadError = () => {
    setLoading(false);
    Alert.alert('Thông báo', 'Không thể tải video');
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <WebView
        source={{ uri: cameraUrl }}
        style={styles.video}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        onLoadEnd={handleLoadEnd}
        onError={handleLoadError}
      />
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: windowWidth * 0.8,
    aspectRatio: 1, // Đảm bảo tỷ lệ khung hình
  },
});

export default CameraView;
