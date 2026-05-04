/* eslint-disable react-native/no-inline-styles */
import { View, Modal, FlatList, Image, TouchableOpacity, RefreshControl, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ChildrenHeader from '../../../components/ChildrenHeader';
import { useFocusEffect } from '@react-navigation/native'
import { Base_URL, Image_URL } from '../../../../IpConfig';
import { Text } from 'react-native-gesture-handler';
import { useChildrens } from '../../../context/Childrens';
import { styles } from '../../../styles/Guardian/Tab/ClassesStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Loader from '../../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Classes({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const [classesList, setClassesList] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const { selectedChildID, child } = useChildrens();
    useFocusEffect(
        useCallback(() => {
            fetchClasses()
        }, [fetchClasses]))
    // Fetch Classes Data
    const fetchClasses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(Base_URL + `Classes/getClassesByStudent?studentID=${selectedChildID}`)
            if (response.ok) {
                const result = await response.json();
                setClassesList(result?.data)
            }
        } catch (error) {
            setLoading(false)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [selectedChildID])
    useEffect(() => {
        if (selectedChildID)
            fetchClasses()
    }, [selectedChildID, fetchClasses])

    const getDate = (date) => {
        return date.split('T')[0]
    }
    const convertUtcToUserTime = (utcTimeValue) => {
        if (!utcTimeValue) return "";
        console.log(child);
        console.log(utcTimeValue);
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
    const onRefresh = () => {
        setRefreshing(true);
        setLoading(false)
        fetchClasses();
    };
    const renderClassItem = ({ item }) => {
        const isLive = false; 

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Image
                        source={{ uri: `${Image_URL}${item?.tutorProfileImage}` }}
                        style={styles.avatar}
                    />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.tutorName}>{item?.tutorName || 'Unknown Tutor'}</Text>
                        <Text style={styles.lessonSubject}>{item?.subjectName} • {item?.lessonName}</Text>
                    </View>
                    <View style={[styles.statusBadge, isLive ? styles.liveBadge : styles.upcomingBadge]}>
                        <Text style={[styles.statusText, isLive ? styles.liveText : styles.upcomingText]}>
                            {isLive ? 'LIVE' : 'Scheduled'}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <View style={styles.infoRow}>
                        <Icon name="calendar-month-outline" size={16} color="#666" />
                        <Text style={styles.footerInfoText}>{item?.dayName}, {getDate(item?.ClassDate)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="clock-outline" size={16} color="#666" />
                        <Text style={styles.footerInfoText}>
                            {convertUtcToUserTime(item?.startTime)} - {convertUtcToUserTime(item?.endTime)}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.joinBtn, !isLive && styles.disabledBtn]}
                    disabled={!isLive}
                >
                    <Text style={[styles.joinBtnText, !isLive && styles.disabledBtnText]}>
                        {isLive ? 'Join Now' : 'Class not started'}
                    </Text>
                    {isLive && <Icon name="chevron-right" size={18} color="#FFF" />}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ChildrenHeader />
            <View style={styles.listHeader}>
                <Text style={styles.titleText}>Weekly Schedule</Text>
                <Text style={styles.subtitleText}>Don't miss your upcoming sessions</Text>
            </View>
            <FlatList
                data={classesList}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyExtractor={(item) => item?.ClassID.toString()}
                renderItem={renderClassItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
            {loading && (
                <Modal transparent animationType="fade">
                    <Loader />
                </Modal>
            )}
        </SafeAreaView>
    );
}