import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect,useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Tab1 from './Tab1';
import Noti from './Notification';
const TabComponent = ({ tab }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{tab}</Text>
    </View>
  );

const Home =() =>{
    const [currentTab, setCurrentTab] = useState('Tab 1');
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1}}>
        {currentTab === 'Tab 1' && <Tab1/>}
        {currentTab === 'Tab 2' && <Noti/>}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Tab 1')}>
          <Ionicons name="home" size={24} color={currentTab === 'Tab 1' ? 'blue' : 'black'} />
          <Text style={[styles.tabText, { color: currentTab === 'Tab 1' ? 'blue' : 'black' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Tab 2')}>
          <Ionicons name="notifications" size={24} color={currentTab === 'Tab 2' ? 'blue' : 'black'} />
          <Text style={[styles.tabText, { color: currentTab === 'Tab 2' ? 'blue' : 'black' }]}>Thông báo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: 'lightgrey',
    },
    tabButton: {
      alignItems: 'center',
    },
    tabText: {
      fontSize: 16,
      marginTop: 5,
    },
  });
export default Home;
