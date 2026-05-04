/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, Image, Pressable, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../../context/auth'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons';
import { style as styles } from '../../../styles/Student/Tab/StudentHomeDashboardStyle'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import Colors from '../../../theme/Colors';
const Header = ({ headerdata }) => {
    const navigation = useNavigation()
    const { user } = useAuth()

    return (
        <SafeAreaView style={styles.headerContainer}>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Pressable onPress={() => navigation.navigate('Profile')}>
                    <Image
                        source={{ uri: `${Image_URL}${user?.profile}` }}
                        style={styles.profileImage}
                    />
                </Pressable>

                <View style={styles.profileInfo}>
                    <Text style={styles.greetingText}>
                        Assalam-u-Alaikum
                    </Text>

                    <Text style={styles.nameText}>
                        {user?.name || 'Guest'}
                    </Text>

                    <Text style={styles.locationText}>
                        {user?.city || 'City'}, {user?.country || 'Country'}
                    </Text>
                </View>
            </View>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.progressTitle}>
                            {headerdata?.upcomingClass?.surahName}
                        </Text>
                        {/* <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.lessonText}>
                                1
                                /
                            </Text>

                            <Text style={styles.lessonText}>
                                29
                                Lessons
                            </Text>
                        </View> */}
                    </View>

                    <Text style={styles.progressSubtitle}>{headerdata?.classStatistics?.progressPercentage || 0}%</Text>
                </View>

                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                width: `${headerdata?.classStatistics?.progressPercentage || 0}%`
                            }
                        ]}
                    />
                </View>
            </View >
        </SafeAreaView >
    );
}
export default function StudentHomeDashboard() {
    const { user } = useAuth()
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false);


    const onRefresh = () => {
        setRefreshing(true); 
        FetchData();
    };
    useFocusEffect(useCallback(() => {
        FetchData()
    }, [FetchData]))
    useEffect(() => {
        console.log(user)
        if (!user) {
            navigation.replace('login')
        }
    }, [user, navigation])

    const [data, setHeaderData] = useState()
    let FetchData = useCallback(async () => {
        try {
            const response = await fetch(`${Base_URL}StudentDashboard/GetDataOfStudent?studentId=${user?.userID}`)
            if (response.ok) {
                const result = await response.json()
                console.log(result);
                if (result?.success) {
                    setHeaderData(result?.data);
                }
            }
        } catch (error) {
            setRefreshing(false)
        } finally {
            setRefreshing(false)
        }
    }, [user?.userID])
    useEffect(() => {
        FetchData()
    }, [FetchData])
    const convertUtcToUserTime = (utcTimeValue) => {
        if (!utcTimeValue) return "";

        // Use user timezone or fallback to system default
        const userTimeZone = user?.timezone;

        try {
            // 1. Get today's date to create a full ISO string
            const today = new Date().toISOString().split('T')[0];

            // 2. IMPORTANT: Append 'Z' to tell JS this string is strictly UTC
            // Format: 2026-04-13T11:00:00Z
            const utcDate = new Date(`${today}T${utcTimeValue}Z`);

            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: userTimeZone,
                hour: '2-digit',
                minute: '2-digit',
                // second: '2-digit',
                hour12: false
            });

            // 3. Format and return the local hour
            const formattedTime = formatter.format(utcDate);
            return formattedTime;

        } catch (error) {
            console.error("Conversion Error:", error);
            return utcTimeValue.split(':')[0] + utcTimeValue.split(':')[1];
        }
    };
    let checkDateAndTime = ({ i }) => {
        console.log(i);
        const now = new Date();
        const classDate = new Date(i.scheduledDate);
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
    return (
        <View style={{ flex: 1 }}>
            <Header headerdata={data} />
            <ScrollView style={{ flex: 1, padding: 10, paddingTop: 10 }} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <Text style={[styles.nameText, { color: Colors.backgroundColor }]}>Classes</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Icon name="book-outline" size={22} color="#4CAF50" />
                        <Text style={styles.statNumber}>
                            {data?.classStatistics?.totalClasses || 0}
                        </Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Icon name="checkmark-circle-outline" size={22} color="#2196F3" />
                        <Text style={styles.statNumber}>
                            {data?.classStatistics?.completedClasses || 0}
                        </Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Icon name="time-outline" size={22} color="#FF9800" />
                        <Text style={styles.statNumber}>
                            {data?.classStatistics?.pendingClasses || 0}
                        </Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>


                {/* Upcoming Class Card */}
                {data?.upcomingClass && (
                    <View style={styles.upcomingCard}>

                        {/* Header Row */}
                        <View style={styles.cardHeader}>
                            <Text style={styles.upcomingTitle}>Upcoming Class</Text>

                            <View style={styles.statusBadgeCard}>
                                <Text style={styles.statusTextCard}>
                                    {data?.upcomingClass?.status}
                                </Text>
                            </View>
                        </View>

                        {/* Main Content */}
                        <View style={styles.upcomingRow}>

                            {/* Instructor Image */}
                            <Image
                                source={{
                                    uri: `${Image_URL}${data?.upcomingClass?.instructorProfile}`
                                }}
                                style={styles.instructorImage}
                            />

                            {/* Info Section */}
                            <View style={{ flex: 1 }}>

                                <Text style={styles.instructorName}>
                                    {data?.upcomingClass?.instructorName}
                                </Text>

                                {/* Lesson */}
                                <View style={styles.infoRow}>
                                    <Text style={styles.urduText}>
                                        {data?.upcomingClass?.surahName}
                                    </Text>
                                    <Text style={styles.lessonText}>
                                        {data?.upcomingClass?.lessonName.split('-')[1]}
                                    </Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Icon name="calendar-outline" size={14} color="#777" />
                                    <Text style={styles.dateText}>
                                        {data?.upcomingClass?.scheduledDate}
                                    </Text>
                                </View>
                                {/* Time */}
                                <View style={styles.infoRow}>
                                    <Icon name="time" size={18} color="#097343" />
                                    <Text style={styles.lessonText}>
                                        {convertUtcToUserTime(data?.upcomingClass?.startTime)}  -   {convertUtcToUserTime(data?.upcomingClass?.endTime)}
                                    </Text>
                                </View>
                                {/* Urdu */}
                            </View>
                        </View>
                        <TouchableOpacity
                            disabled={checkDateAndTime({ i: data?.upcomingClass })}
                            onPress={() => navigation.navigate('Class', { classID: data?.upcomingClass?.classId })}

                            style={
                                checkDateAndTime({ i: data?.upcomingClass }) ? styles.joinBtnDisabled
                                    : styles.joinBtn}
                        >
                            <Icon name="videocam-outline" size={16} color="#fff" />
                            <Text style={styles.joinText}>
                                {checkDateAndTime({ i: data?.upcomingClass }) ?
                                    'Scheduled' : 'Join'
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={[styles.nameText, { color: Colors.backgroundColor }]}>Al -Quran</Text>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.card}
                        onPress={() => navigation.navigate('Surahs')}
                    >
                        <View style={styles.iconContainer}>
                            <Icon name="reader-outline" size={20} color="#fff" />
                        </View>

                        <Text style={styles.title}>Surah</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.card}
                        onPress={() => navigation.navigate('Qurans')}
                    >
                        <View style={styles.iconContainer}>
                            <Icon name="library-outline" size={12} color="#fff" />
                        </View>
                        <Text style={styles.title}>Juzz</Text>
                    </TouchableOpacity>





                </View>
            </ScrollView>
        </View >
    )
}