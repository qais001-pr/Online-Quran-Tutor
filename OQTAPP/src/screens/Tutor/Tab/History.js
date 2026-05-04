/* eslint-disable react-native/no-inline-styles */
import { FlatList, Image, View, RefreshControl, TouchableOpacity, StatusBar } from 'react-native'
import React, { useCallback, useState, useMemo } from 'react'
import Header from '../../../components/Header'
import { styles } from '../../../styles/Tutor/Tab/HistoryStyle'
import { Base_URL, Image_URL } from '../../../../IpConfig'
import { useAuth } from '../../../context/auth'
import { useFocusEffect } from '@react-navigation/native'
import { Text } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dropdown } from 'react-native-element-dropdown'
import DatePicker from 'react-native-date-picker'
export default function History() {
    const [data, setData] = useState([])
    const { user } = useAuth()
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(false)

    console.log(date);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        FetchHistory();
        setStatus('');
        setSelectedDate(false);
        setDate(new Date())
    };
    const statusList = [
        { label: 'All', value: '' },
        { label: 'Missed', value: 'missed' },
        { label: 'Completed', value: 'completed' }
    ]
    const [status, setStatus] = useState('');
    let FetchHistory = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await fetch(Base_URL + `Tutor/getHistoryData?userID=${user?.userID}`)
            if (response.ok) {
                const result = await response.json()
                setData(result?.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false)
        }
    }, [user?.userID])
    useFocusEffect(useCallback(() => {
        FetchHistory()
    }, [FetchHistory]))
    const convertUtcToUserTime = (utcTimeValue) => {
        if (!utcTimeValue) return "";
        const userTimeZone = user?.timezone;
        try {
            const today = new Date().toISOString().split('T')[0];
            const utcDate = new Date(`${today}T${utcTimeValue}Z`);
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: userTimeZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            const formattedTime = formatter.format(utcDate);
            return formattedTime;
        } catch (error) {
            console.log("Conversion Error:", error);
            return utcTimeValue.split(':')[0];
        }
    };

    const filteredList = useMemo(() => {
        return data.filter(item => {
            const matchStatus = status
                ? item?.Status?.toLowerCase() === status.toLowerCase()
                : true;

            const matchDate = selectedDate
                ? new Date(item?.ClassDate).toLocaleDateString().split('T')[0] === date.toLocaleDateString().split('T')[0]
                : true;

            return matchStatus && matchDate;
        });
    }, [data, status, selectedDate, date]);
    const renderHistoryItem = ({ item }) => {
        const isCompleted = item?.Status?.toLowerCase() === 'completed';

        return (
            <View style={styles.card}>
                {/* Top Section */}
                <View style={styles.cardHeader}>
                    <Image
                        source={{ uri: Image_URL + item?.profile }}
                        style={styles.avatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.studentName}>{item?.name || 'Student'}</Text>
                        <View style={[styles.statusBadge, isCompleted ? styles.completedBadge : styles.missedBadge]}>
                            <Text style={[styles.statusText, isCompleted ? styles.completedText : styles.missedText]}>
                                {item?.Status?.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    {isCompleted && item?.rating > 0 && (
                        <View style={styles.ratingBox}>
                            <Icon name="star" size={14} color="#FFB800" />
                            <Text style={styles.ratingText}>{item?.rating}</Text>
                        </View>
                    )}
                </View>

                {/* Middle Info Section */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Icon name="calendar-range" size={16} color="#666" />
                        <Text style={styles.detailText}>{item?.ClassDate?.split('T')[0]}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Icon name="clock-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>
                            {convertUtcToUserTime(item?.startTime)} - {convertUtcToUserTime(item?.endTime)}
                        </Text>
                    </View>
                </View>

                {/* Footer Section (Comments/Assignments) */}
                {(item?.Comment || item?.assignment) && (
                    <View style={styles.footerSection}>
                        {item?.Comment && (
                            <View style={styles.noteLine}>
                                <Text style={styles.noteLabel}>Feedback: </Text>
                                <Text style={styles.noteText} numberOfLines={1}>{item.Comment}</Text>
                            </View>
                        )}
                        {item?.assignment && (
                            <View style={styles.noteLine}>
                                <Text style={styles.noteLabel}>Task: </Text>
                                <Text style={styles.noteText} numberOfLines={1}>{item.assignment}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />

            <View style={styles.headerPadding}>
                <Text style={styles.mainTitle}>Monthly Classes</Text>
                <View style={styles.statsRow}>
                    <Text style={styles.statsText}>
                        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Total'} Classes: {filteredList.length}
                    </Text>
                </View>

                {/* Filters Row */}
                {/* <View style={styles.filterRow}>
                    <TouchableOpacity style={styles.datePickerBtn} onPress={() => setOpen(true)}>
                        <Icon name="calendar-search" size={18} color="#37905f" />
                        <Text style={styles.dateText}>
                            {selectedDate ? date.toLocaleDateString() : 'Pick Date'}
                        </Text>
                    </TouchableOpacity>

                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedTextStyle={styles.dropdownSelected}
                        data={statusList}
                        labelField="label"
                        valueField="value"
                        placeholder="Status"
                        value={status}
                        onChange={(item) => setStatus(item?.value)}
                        renderLeftIcon={() => (
                            <Icon name="filter-variant" size={18} color="#37905f" style={{ marginRight: 5 }} />
                        )}
                    />
                </View> */}
            </View>

            <FlatList
                data={filteredList}
                keyExtractor={(item) => item?.ClassID.toString()}
                renderItem={renderHistoryItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Icon name="history" size={60} color="#CCC" />
                        <Text style={styles.emptyText}>No matching records found</Text>
                    </View>
                }
            />

            <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={(selectdate) => {
                    setOpen(false);
                    setDate(selectdate);
                    setSelectedDate(true);
                }}
                onCancel={() => setOpen(false)}
            />
        </View>
    );
}