/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { View, Modal, FlatList, Image, ToastAndroid, RefreshControl, TouchableOpacity, StatusBar } from 'react-native'
import React, { useCallback, useState } from 'react'
import Header from '../../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import { Base_URL, Image_URL } from '../../../../IpConfig';
import { Text } from 'react-native-gesture-handler';
import { useAuth } from '../../../context/auth';
import Loader from '../../../components/Loader'
import { styles } from '../../../styles/Tutor/Tab/ClassessStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Classes({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const [classesList, setClassesList] = useState([])
    const { user } = useAuth()
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchClasses()
        }, []))
    // Fetch Classes Data
    const fetchClasses = async () => {
        try {
            setLoading(true)
            const response = await fetch(Base_URL + `Classes//getClasses?tutorID=${user?.userID}`)
            console.log(response);
            if (response.status === 500) {
                ToastAndroid.show('Something Went Wrong', 4000)
                return;
            }
            if (response.ok) {
                const result = await response.json();
                setClassesList(result?.data)
            }
        } catch (error) {
            setLoading(false)
        } finally {
            setLoading(false)
            setRefreshing(false);
        }

    }

    // const getDate = (date) => {
    //     return date.split('T')[0]
    // }

    // Render Class Containar
    let classJoin = (classID, start, end) => {
        navigation.navigate('Class', { classID: classID, startTime: start, endTime: end })
    }

    const convertUtcToUserTime = (utcTimeValue) => {
        if (!utcTimeValue) return "";

        const userTimeZone = user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

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
            console.error("Conversion Error:", error);
            return utcTimeValue.split(':')[0] + utcTimeValue.split(':')[1];
        }
    };
    const onRefresh = () => {
        setRefreshing(true); setLoading(false)
        fetchClasses();
    };
    let checkDateAndTime = ({ i }) => {
        const now = new Date();
        const classDate = new Date(i.ClassDate);
        const isSameDate =
            now.getFullYear() === classDate.getFullYear() &&
            now.getMonth() === classDate.getMonth() &&
            now.getDate() === classDate.getDate();
        if (!isSameDate) {
            return true;
        }
        const currentHour = now.getHours();
        const utcTimeStart = convertUtcToUserTime(i.startTime)
        const utcTimeEnd = convertUtcToUserTime(i.endTime)
        const startHour = parseInt(utcTimeStart.split(':')[0], 10);
        const endHour = parseInt(utcTimeEnd.split(':')[0], 10);
        const isInTimeRange = (currentHour >= startHour && currentHour < endHour);

        if (isSameDate && isInTimeRange) {
            return false;
        }
        return true;
    };
    const renderClassItem = ({ item }) => {
        const isLocked = checkDateAndTime({ i: item });

        return (
            <View style={styles.card}>
                {/* Header: Student Info & Status */}
                <View style={styles.cardHeader}>
                    <Image
                        source={{ uri: `${Image_URL}${item?.studentProfileImage}` }}
                        style={styles.avatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.studentName}>{item?.studentname || 'Guest Student'}</Text>
                        <Text style={styles.subjectText}>{item?.subjectName} • {item?.lessonName}</Text>
                    </View>
                    <View style={[styles.statusBadge, isLocked ? styles.scheduledBadge : styles.liveBadge]}>
                        <View style={[styles.dot, isLocked ? styles.scheduledDot : styles.liveDot]} />
                        <Text style={[styles.statusText, isLocked ? styles.scheduledText : styles.liveText]}>
                            {isLocked ? 'Scheduled' : 'Live Now'}
                        </Text>
                    </View>
                </View>

                {/* Info Section: Date, Day, and Time */}
                <View style={styles.detailsContainer}>
                    <View style={styles.infoRow}>
                        <Icon name="calendar-clock" size={16} color="#666" />
                        <Text style={styles.detailText}>{item?.dayName}, {item?.ClassDate?.split('T')[0]}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="clock-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>
                            {convertUtcToUserTime(item?.startTime)} - {convertUtcToUserTime(item?.endTime)}
                        </Text>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={() => classJoin(item?.ClassID, item?.startTime, item?.endTime)}
                    disabled={isLocked}
                    style={[styles.joinBtn, isLocked && styles.joinBtnDisabled]}
                >
                    <Text style={[styles.joinBtnText, isLocked && styles.joinBtnTextDisabled]}>
                        {isLocked ? 'Waiting for Time' : 'Start Session'}
                    </Text>
                    {!isLocked && <Icon name="play-circle" size={20} color="#FFF" />}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <View style={styles.headerPadding}>
                <Text style={styles.mainTitle}>Weekly Classes</Text>
                <Text style={styles.subtitle}>Your upcoming teaching schedule</Text>
            </View>
            <FlatList
                data={classesList}
                keyExtractor={(item) => item?.ClassID.toString()}
                renderItem={renderClassItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={!loading && (
                    <View style={styles.emptyState}>
                        <Icon name="calendar-blank" size={60} color="#CCC" />
                        <Text style={styles.emptyText}>No classes assigned for this week</Text>
                    </View>
                )}
            />
            {loading && (
                <Modal transparent animationType="fade">
                    <Loader message="Fetching sessions..." />
                </Modal>
            )}
        </View>
    );
}