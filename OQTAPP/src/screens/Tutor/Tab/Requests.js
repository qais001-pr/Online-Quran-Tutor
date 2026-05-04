/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */

import React, { useCallback, useState } from 'react';
import {
    Text,
    View,
    Platform,
    Modal,
    ToastAndroid,
    FlatList,
    RefreshControl,
    Image,
    Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Provider } from 'react-native-paper';
import Header from '../../../components/Header';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import { useAuth } from '../../../context/auth';
import Loader from '../../../components/Loader';
import { styles } from '../../../styles/Tutor/Tab/RequestStyle';
export default function Requests() {
    const { user } = useAuth();

    const [requestsList, setRequestList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    // For Retrieve Schedule
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [scheduleVisible, setScheduleVisible] = useState(false);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch(
                Base_URL + `Tutor/getRequests?tutorID=${user?.userID}`
            );

            const result = await response.json();

            if (result.success) {
                setRequestList(result.data);
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Something Went Wrong!', ToastAndroid.LONG);
                }
            }
        } catch (error) {
            console.log(error);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Network Error!', ToastAndroid.LONG);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.userID])

    useFocusEffect(
        useCallback(() => {
            if (user?.userID) {
                fetchRequests();
            }
        }, [fetchRequests, user?.userID])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchRequests();
    };
    const onAccept = async (item) => {
        try {
            console.log(item)
            setLoading(true)
            const response = await fetch(`${Base_URL}Enrollments/AcceptRequestAndEnrolled?requestID=${item?.RequestID}`, {
                method: 'POST'
            })
            const result = await response.json()
            console.log(result);
            if (result?.success) {
                Platform.OS === 'android' && ToastAndroid.show('Classes Created Successfully', 4000)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        } finally {
            fetchRequests()
            setLoading(false)
        }
    }

    const onReject = async (requestID) => {
        try {
            setLoading(true)
            console.log(requestID)
            const response = await fetch(`${Base_URL}Classes/rejectRequest?requestID=${requestID}`, {
                method: 'POST'
            })
            const result = await response.json()
            console.log(result);
            if (result?.success) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Request Rejected Successfully', 5000)
                }
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            Platform.OS === 'android' &&
                ToastAndroid.show('Request Rejected Successfully', 5000)
        } finally {
            fetchRequests()
            setLoading(false)
        }
    }

    const renderRequest = ({ item }) => {
        return (
            <View style={styles.card}>
                {/* Top Section */}
                <View style={styles.topRow}>
                    <Image
                        source={{ uri: `${Image_URL}${item?.profileImage}` }}
                        style={styles.avatar}
                    />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.title}>{item.StudentName}</Text>
                        <Text style={styles.email} numberOfLines={1}>Islamabad,Pakistan</Text>
                    </View>
                    <View>
                        {/* Accept Button on Request */}
                        <Pressable
                            style={styles.actionBtn}
                            onPress={() => onAccept(item)}>
                            <Text style={styles.actionBtnText}>Accept</Text>
                        </Pressable>
                        {/* Reject Button on Request */}
                        <Pressable
                            style={[styles.actionBtn, { backgroundColor: 'red' }]}
                            onPress={() => onReject(item?.RequestID)}>
                            <Text style={styles.actionBtnText}>Reject</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Subject Info */}
                <View style={styles.infoRow}>
                    {/* <Text style={styles.infoLabel}>Subject</Text> */}
                    <Text style={styles.infoValue}>{item.SubjectName}</Text>
                    <Text style={styles.infoValue}>{item.SurahName}</Text>
                </View>
                {/* Schedule Button */}
                <Pressable
                    style={styles.scheduleBtn}
                    onPress={() => {
                        console.log(item)
                        setSelectedSchedule(item);
                        setScheduleVisible(true);
                    }}>
                    <Text style={styles.scheduleBtnText}>View Schedule</Text>
                </Pressable>
            </View>
        );
    };
    return (
        <Provider>
            <View style={styles.container}>
                <Header />

                <FlatList
                    data={requestsList}
                    keyExtractor={(item) => item.RequestID.toString()}
                    renderItem={renderRequest}
                    contentContainerStyle={{ padding: 15 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        !loading && (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No Requests Found</Text>
                            </View>
                        )
                    }
                />

                {/* Loading Modal */}
                {loading && (
                    <Modal transparent animationType="fade">
                        <Loader />
                    </Modal>
                )}



                {/* Schedule Modal */}
                <Modal visible={scheduleVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                <Image width={50} height={50}
                                    borderRadius={100}
                                    source={{ uri: `${Image_URL}${selectedSchedule?.profileImage}` }} />
                                <Text style={styles.modalTitle}>
                                    {selectedSchedule?.StudentName}'s Timetable
                                </Text>
                            </View>

                            <FlatList
                                data={selectedSchedule?.Schedule}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.dayBox}>
                                        <Text style={styles.dayTitle}>{item.DayName}</Text>
                                        <FlatList
                                            data={item.Slots}
                                            keyExtractor={(slot) => slot?.slotID.toString()}
                                            renderItem={({ item }) => (
                                                <View style={styles.timeBadge}>
                                                    <Text style={styles.timeText}>
                                                        {item?.startTime.split(':')[0]} - {item?.endTime.split(':')[0]}
                                                    </Text>
                                                </View>
                                            )}
                                            scrollEnabled={true}
                                        />
                                    </View>
                                )}
                            />

                            <Pressable
                                style={styles.closeBtn}
                                onPress={() => setScheduleVisible(false)}>
                                <Text style={styles.closeText}>Close</Text>
                            </Pressable>

                        </View>
                    </View>
                </Modal>
            </View>
        </Provider>
    );
}

