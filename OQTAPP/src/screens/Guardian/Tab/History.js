/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, StatusBar } from 'react-native'
import DatePicker from 'react-native-date-picker'
import React, { useState, useCallback, useMemo } from 'react'
import ChildrenHeader from '../../../components/ChildrenHeader'
import { Base_URL, Image_URL } from '../../../../IpConfig'
import { useChildrens } from '../../../context/Childrens'
import { useFocusEffect } from '@react-navigation/native'
import { styles } from '../../../styles/Guardian/Tab/HistoryStyle'
import { Dropdown } from 'react-native-element-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function History() {
    const [data, setData] = useState([])
    const { selectedChildID, child } = useChildrens()
    const [refreshing, setRefreshing] = useState(false);

    const statusList = [
        { label: 'All', value: '' },
        { label: 'Missed', value: 'missed' },
        { label: 'Completed', value: 'completed' }
    ]

    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(false)


    const onRefresh = () => {
        setRefreshing(true);
        FetchHistory();
        setStatus('')
        setDate(new Date())
        setSelectedDate(false)
    };
    let FetchHistory = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await fetch(Base_URL + `Students/getHistoryData?userID=${selectedChildID}`);
            if (response.ok) {
                const result = await response.json();
                setData(result?.data);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false)
        }
    }, [selectedChildID])
    useFocusEffect(useCallback(() => {
        FetchHistory()
    }, [FetchHistory]))
    const convertUtcToUserTime = (utcTimeValue) => {
        if (!utcTimeValue) return "";
        const userTimeZone = child?.timezone;
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
            const missedOrCompleted =
                status ? item?.Status.toLowerCase() === status.toLowerCase() : true

            const filteredByDate = selectedDate ? new Date(item?.ClassDate).toLocaleDateString() === date.toLocaleDateString() : true

            return missedOrCompleted && filteredByDate;
        })
    }, [data, date, selectedDate, status])
    const renderHistoryItem = ({ item }) => {
        const isCompleted = item?.Status.toLowerCase() === 'completed';

        return (
            <View style={styles.card}>
                {/* Top Row: Tutor Info & Status Badge */}
                <View style={styles.cardHeader}>
                    <Image
                        source={{ uri: Image_URL + item?.profile }}
                        style={styles.avatar}
                    />
                    <View style={styles.tutorInfo}>
                        <Text style={styles.tutorName}>{item?.name}</Text>
                        <View style={[styles.statusBadge, isCompleted ? styles.completedBadge : styles.missedBadge]}>
                            <Text style={[styles.statusText, isCompleted ? styles.completedText : styles.missedText]}>
                                {item?.Status.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    {isCompleted && (
                        <View style={styles.ratingBox}>
                            <Icon name="star" size={14} color="#FFD700" />
                            <Text style={styles.ratingNumber}>{item?.rating || 'N/A'}</Text>
                        </View>
                    )}
                </View>

                {/* Middle Row: Date & Time */}
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Icon name="calendar-blank" size={16} color="#666" />
                        <Text style={styles.detailValue}>{item?.ClassDate?.split('T')[0]}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="clock-outline" size={16} color="#666" />
                        <Text style={styles.detailValue}>
                            {convertUtcToUserTime(item?.startTime)} - {convertUtcToUserTime(item?.endTime)}
                        </Text>
                    </View>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="close-circle-outline" size={16} color="#bd0d0d" />
                    <Text style={styles.detailValue}>Corrections: {item?.Corrections}</Text>
                </View>

                {isCompleted && (
                    <View style={styles.assignmentBox}>
                        <Text style={styles.assignmentLabel}>Class Assignment:</Text>
                        <Text style={styles.assignmentContent} numberOfLines={2}>
                            {item?.assignment || 'No specific assignment provided for this session.'}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ChildrenHeader />

            {/* Header Section */}
            <View style={styles.pageHeader}>
                <View>
                    <Text style={styles.mainTitle}>Monthly History</Text>
                    <Text style={styles.statsSummary}>
                        Showing {filteredList.length} {status || 'total'} sessions
                    </Text>
                </View>
            </View>

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <TouchableOpacity style={styles.datePickerBtn} onPress={() => setOpen(true)}>
                    <Icon name="calendar-search" size={18} color="#37905f" />
                    <Text style={styles.dateText}>
                        {!selectedDate ? 'Filter Date' : date.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>

                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={statusList}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="All Status"
                    value={status}
                    onChange={item => setStatus(item.value)}
                    renderLeftIcon={() => (
                        <Icon style={styles.icon} color="#37905f" name="filter-variant" size={18} />
                    )}
                />
            </View>

            <FlatList
                data={filteredList}
                keyExtractor={(item) => item?.ClassID.toString()}
                renderItem={renderHistoryItem}
                contentContainerStyle={{ paddingBottom: 200 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Icon name="clipboard-text-search-outline" size={60} color="#CCC" />
                        <Text style={styles.emptyText}>No class records found for this period.</Text>
                    </View>
                )}
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
        </SafeAreaView>
    );
}