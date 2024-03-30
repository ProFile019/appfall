import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image,Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { AntDesign } from '@expo/vector-icons';
import { initializeApp, getApps } from 'firebase/app';
import { onValue } from 'firebase/database'
import "firebase/app"
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import { getStorage, ref as storageRef,listAll, getDownloadURL,deleteObject } from 'firebase/storage';
import { getDatabase, ref as dbRef, set, push, remove } from "firebase/database";
const Noti = () => {
    const [notifications, setNotifications] = useState([]);
    const [images, setImages] = useState([]);
    useEffect(() => {
        var firebaseConfig = {
            apiKey: "AIzaSyA0s17YydhIML__VSP9ccweB-NceuX3YrM",
            authDomain: "data-c9b1b.firebaseapp.com",
            databaseURL: "https://data-c9b1b-default-rtdb.firebaseio.com/",
            projectId: "data-c9b1b",
            storageBucket: "data-c9b1b.appspot.com",
            messagingSenderId: "350431843221",
            appId: "1:350431843221:web:d5f5e438a9d3b965541c9c",
            measurementId: "G-TRTMHDPJSV"
        };
        if (getApps().length < 1) {
            initializeApp(firebaseConfig);
            console.log("\n Kết nối thành công \n");
            // Initialize other firebase products here
        }
    }, [])
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const { title, body } = remoteMessage.notification;
            const newNotification = {
                title: title,
                content: body,
                timestamp: new Date().getTime(), // Thời gian hiện tại
            };
            console.log('Received new notification:', newNotification); // Kiểm tra dữ liệu của thông báo mới
            // setNotifications(prevNotifications => [newNotification, ...prevNotifications]);

        });
        // Gọi hàm để đẩy dữ liệu lên Firebase khi component unmount
        return () => {
            unsubscribe();
        };
    }, []);


    // Hàm để loại bỏ thông báo khỏi danh sách
    const removeNotification = async (notificationId, imageName) => {
        try {
            // Loại bỏ thông báo khỏi danh sách cục bộ
            setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== notificationId));
    
            // Loại bỏ thông báo khỏi cơ sở dữ liệu Firebase
            const db = getDatabase();
            const notificationRef = dbRef(db, `Noti/${notificationId}`);
            await remove(notificationRef);
            console.log('Notification removed from Firebase');
    
            // Loại bỏ file ảnh từ Firebase Storage
            const storage = getStorage();
            const fileRef = storageRef(storage, `frames/${imageName}.jpg`);
            await deleteObject(fileRef);
            console.log('Image file removed from Firebase Storage');
        } catch (error) {
            console.error('Error removing notification and image:', error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    const getHours = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}`;
    }
    const getMinutes = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getMinutes()}`;
    }
    const getDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getDate()}`;
    }
    const getMonth = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getMonth()}`+1;
    }
    useEffect(() => {
        const db = getDatabase();
        const notiRef = dbRef(db, 'Noti/');
        const storage = getStorage();
        const framesRef = storageRef(storage, 'frames/');

        // Lắng nghe sự thay đổi trên nút Noti/ trong cơ sở dữ liệu Firebase
        onValue(notiRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Chuyển dữ liệu từ định dạng object sang mảng
                const notificationsArray = Object.keys(data).map(key => ({ ...data[key], id: key }));
                setNotifications(notificationsArray);
            } else {
                setNotifications([]);
            }
        }, (error) => {
            console.error('Error getting data from Firebase: ', error);
        });
        const fetchImages = async () => {
            try {
                const listResult = await listAll(storageRef(getStorage(), 'frames'));
                const urls = await Promise.all(listResult.items.map(async (item) => {
                    const downloadURL = await getDownloadURL(item);
                    return { url: downloadURL, name: item.name };
                }));
                setImages(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        // Fetch images when component mounts
        fetchImages();
    }, []);
    const showDeleteConfirmation = (notificationId, timestamp) => {
        Alert.alert(
            "Xác nhận xoá",
            "Bạn có chắc chắn muốn xoá thông báo này?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Xoá",
                    onPress: () => removeNotification(notificationId, timestamp)
                }
            ]
        );
    };
    // const combinedData = zip(notifications, imageUrls);
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: "#B0E2FF", height: 40 }}></View>
            <View style={styles.header}>
                <Text style={styles.headerText}>Ứng dụng Camera</Text>
                <AntDesign style={{ marginLeft: 10 }} name="camera" size={24} color="white" />
            </View>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => showDeleteConfirmation(item.id,item.timestamp)}>
                        <View style={styles.notificationContainer}>
                            <Text style={styles.notificationTime}>{formatTime(item.timestamp)}</Text>
                            <Text style={styles.notificationTitle}>{item.title}</Text>
                            <Text style={styles.notificationContent}>{item.content} vào lúc {getHours(item.timestamp)}:{getMinutes(item.timestamp)} ngày {getDate(item.timestamp)} tháng {getMonth(item.timestamp)}</Text>
                            {images.filter(image => image.name === `${item.timestamp}.jpg`).map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image.url }}
                            style={styles.notificationImage}
                            resizeMode="cover"
                            width={100}
                            height={200}
                        />
                    ))}
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

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
    notificationContainer: {
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    notificationContent: {
        fontSize: 16,
    },
    notificationTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    notificationImage: {
        width: '100%',
        margin: 5,
    }
});

export default Noti;
