/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text, RefreshControl, FlatList, StatusBar, Platform, ToastAndroid } from 'react-native'
import React, { useState, useCallback } from 'react';
import Header from '../../../components/Header';
import Colors from '../../../theme/Colors';
import { useAuth } from '../../../context/auth';
import { Base_URL } from '../../../../IpConfig';
import { Checkbox, Modal, Portal, Provider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../../../styles/Tutor/Tab/ScheduleStyle';
import Loader from '../../../components/Loader';
const TIME_COLUMN_WIDTH = 55;
export default function Schedule() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [scheduleList, setScheduleList] = useState([]);
    const [timeList, setTimeList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    useFocusEffect(
        useCallback(() => {
            fetchSchedule()
        }, []))
    const fetchSchedule = async () => {
        try {
            setLoading(!loading);
            const response = await fetch(`${Base_URL}Slots/GetSlotsWithDay?userid=${user.userID}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.length > 0) {
                    setTimeList(data[0].Slots);
                    setScheduleList(data);
                }
            }
        } catch (error) {
            console.log("Fetch Error:", error);
        } finally {
            setLoading(!loading);
            setRefreshing(false)
        }
    };
    const onRefresh = () => {
        setRefreshing(true);
        fetchSchedule();
    };
    const getDayLabel = (day) => {
        const days = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
        return days[day] || day;
    };

    const renderTimeItem = ({ item, index }) => {
        const startTime = item?.StartTime.split(':')[0]
        const endTime = item?.EndTime.split(':')[0]
        return (
            <View style={styles.timeCell}>
                <Text style={styles.timeText}>{startTime} - {endTime}</Text>
            </View>
        )
    };

    let onClickSlot = async (item) => {
        console.log(item)
        let url = 'slots/UpdateStatusTutorBooked'
        const data = {
            UserId: user?.userID,
            DayId: item.DayID,
            SlotId: item?.SlotID
        }
        try {
            setLoading(true)
            const response = await fetch(`${Base_URL}${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                const d = await response.json()
                console.log(d);
                Platform.OS === 'android' && ToastAndroid.show(d, 4000);
                await fetchSchedule()
            }

        } catch (error) {
        } finally {
            setLoading(!loading)
        }

    }
    const renderCheckboxCell = ({ item, index }) => (
        <View style={styles.checkboxCell}>
            <Checkbox
                status={item.Status.toString() === 'booked' ? 'checked' : 'unchecked'}
                onPress={() => onClickSlot(item)}
                color={Colors.header || '#6200ee'}
            />
        </View>
    );

    const renderDayColumn = ({ item }) => (
        <View style={styles.dayColumn}>
            <View style={styles.columnHeader}>
                <Text style={styles.dayHeaderText}>{getDayLabel(item?.DayName)}</Text>
            </View>
            <FlatList
                data={item?.Slots}
                keyExtractor={(slot) => slot.SlotID.toString()}
                scrollEnabled={false}
                renderItem={renderCheckboxCell}
            />
        </View>
    );

    return (
        <Provider>
            <View style={styles.safeAreaView}>
                <StatusBar barStyle={'dark-content'} />

                <Header />

                <View style={styles.gridContainer}>
                    <View style={{ width: TIME_COLUMN_WIDTH }}>
                        <View style={styles.columnHeader}>
                            <Text style={styles.headerLabelText}>Time</Text>
                        </View>
                        <FlatList
                            data={timeList}
                            keyExtractor={(item) => item.SlotID.toString()}
                            renderItem={renderTimeItem}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    </View>

                    <FlatList
                        data={scheduleList}
                        keyExtractor={(item) => item.DayID.toString()}
                        renderItem={renderDayColumn}
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
                                progressViewOffset={300}
                                colors={['#0000ff']} />

                        }
                    />

                </View>
                <Portal>
                    {loading && (
                        <Modal transparent animationType="fade">
                            <Loader message='Loading' />
                        </Modal>
                    )}
                </Portal>
            </View>
        </Provider>
    );
}
