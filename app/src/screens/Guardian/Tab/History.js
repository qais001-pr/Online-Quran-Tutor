/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import { FlatList, Image, View, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import ChildHeader from '../../../components/ChildHeader';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import { useChildrens } from '../../../context/Childrens';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import { styles } from '../../../styles/Student/Tab/HistoryStyle';
export default function History() {
    const [data, setData] = useState([]);
    const { child } = useChildrens()
    // const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(false);

    const statusList = [
        { label: 'All Statuses', value: '' },
        { label: 'Missed', value: 'missed' },
        { label: 'Completed', value: 'completed' }
    ];

    const FetchHistory = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`${Base_URL}Students/getHistoryData?userID=${child?.childrenID}`);
            if (response.ok) {
                const result = await response.json();
                setData(result?.data || []);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setRefreshing(false);
        }
    }, [child?.childrenID]);

    useFocusEffect(useCallback(() => {
        FetchHistory();
    }, [FetchHistory]));

    const onRefresh = () => {
        setStatus('');
        setDate(new Date());
        setSelectedDate(false);
        FetchHistory();
    };

    const convertUtcToUserTime = (utcTimeValue) => {
        if (!utcTimeValue) return "--:--";
        try {
            const today = new Date().toISOString().split('T')[0];
            const utcDate = new Date(`${today}T${utcTimeValue}Z`);
            return utcDate.toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit',
                hour12: false
            });
        } catch (e) { return utcTimeValue; }
    };

    const filteredList = useMemo(() => {
        return data.filter(item => {
            const statusMatch = status ? item?.Status.toLowerCase() === status.toLowerCase() : true;
            const dateMatch = selectedDate ?
                new Date(item?.ClassDate).toDateString() === date.toDateString() : true;
            return statusMatch && dateMatch;
        });
    }, [data, date, selectedDate, status]);

    const renderClassItem = ({ item }) => {
        if (!item) return null;

        return (
            <View style={styles.card}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userRow}>
                        <Image
                            source={{ uri: Image_URL + (item?.TutorImage || '') }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.name}>{item?.TutorName || 'Unknown'}</Text>
                            <Text style={styles.sub}>
                                {item?.ClassDate?.split('T')[0]} • {convertUtcToUserTime(item?.StartTime)} - {convertUtcToUserTime(item?.EndTime)}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.status, styles[item?.Status?.toLowerCase()] || styles.defaultStatus]}>
                        {item?.Status?.toUpperCase()}
                    </Text>
                </View>

                {/* Body */}
                <Text style={styles.text}>
                    Subject : {item?.Subject} • {item?.DayName} •  Ayat: {item?.startAyat ?? 0}-{item?.endAyat ?? 0}
                </Text>

                {item?.Status === 'completed' && (
                    <>
                        <Text style={styles.text}>Rating : {item?.Rating ?? 0} ⭐</Text>
                        <Text style={styles.note} numberOfLines={2}>
                            {item?.notes || 'No notes'}
                        </Text>
                    </>
                )}
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <ChildHeader />

            <View style={styles.filterSection}>
                <View>
                    <Text style={styles.title}>Monthly Classes</Text>
                    <Text style={styles.subtitle}>Found {filteredList.length} sessions</Text>
                </View>

                {/* <View style={styles.filterControls}>
                    <TouchableOpacity style={styles.datePickerBtn} onPress={() => setOpen(true)}>
                        <Icon name="calendar" size={18} color="#37905f" />
                        <Text style={styles.datePickerLabel}>
                            {selectedDate ? date.toLocaleDateString() : 'Date'}
                        </Text>
                    </TouchableOpacity>

                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={statusList}
                        labelField="label"
                        valueField="value"
                        placeholder="Status"
                        value={status}
                        onChange={item => setStatus(item.value)}
                    />
                </View> */}
            </View>

            <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={filteredList}
                keyExtractor={(item) => item?.ClassID.toString()}
                renderItem={renderClassItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="clipboard-text-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>No classes found for this criteria</Text>
                    </View>
                }
            />

            <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={(date) => { setOpen(false); setDate(date); setSelectedDate(true); }}
                onCancel={() => setOpen(false)}
            />
        </View>
    );
}