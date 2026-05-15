import { View, Text, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import React, { useCallback,  useState } from 'react';
import Colors from '../../../theme/Colors';
import { useAuth } from '../../../context/auth';
import { Base_URL } from '../../../../IpConfig';
import { Checkbox, Modal, Portal, Provider } from 'react-native-paper';
import Header from '../../../components/Header';
import { styles } from '../../../styles/Student/Tab/ScheduleStyle';
import { useFocusEffect } from '@react-navigation/native';

const TIME_COLUMN_WIDTH = 55;

export default function Schedule({ navigation }) {
    const { user } = useAuth();
    console.log(user)
    const [loading, setLoading] = useState(false);
    const [scheduleList, setScheduleList] = useState([]);
    const [timeList, setTimeList] = useState([]);
    console.log(user)

    useFocusEffect(useCallback(() => {
        fetchSchedule();
    }, [fetchSchedule]))

    const fetchSchedule = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${Base_URL}Slots/GetSlotsWithDay?userid=${user?.userID}`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setTimeList(data[0].Slots);
                    setScheduleList(data);
                }
            }
        } catch (error) {
            console.log("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.userID])

    const getDayLabel = (day) => {
        const days = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
        return days[day] || day;
    };

    const renderTimeItem = ({ item }) => {
        const startHour = item?.StartTime?.split(':')[0];
        const endHour = item?.EndTime?.split(':')[0];

        return (
            <View style={styles.timeCell}>
                <Text style={styles.timeText}>
                    {startHour} - {endHour}
                </Text>
            </View>
        );
    };

    let onClickSlot = async (item) => {
        let url = ''
        if (item?.Status === 'available') {
            url = 'slots/bookedstudentslot'
        }
        else {
            url = 'slots/availablestudentslot'
        }
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
                await fetchSchedule()
            }
        } catch (error) {
        } finally {
            setLoading(false)
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
                scrollEnabled={true}
                renderItem={renderCheckboxCell}
            />
        </View>
    );

    return (
        <Provider>
            <View style={styles.safeAreaView}>
                <StatusBar barStyle={'dark-content'} />
                <Header />
                {/* <Text style={{ paddingLeft: 10, fontSize: 17, backgroundColor: Colors.border, color: Colors.backgroundColor }}>Schedule</Text> */}
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
                    />
                </View>

                <Portal>
                    <Modal visible={loading} dismissable={false}>
                        <ActivityIndicator size="large" color="white" />
                    </Modal>
                </Portal>
            </View>
        </Provider >
    );
}
