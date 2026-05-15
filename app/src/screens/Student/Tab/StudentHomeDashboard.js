/* eslint-disable no-unused-vars */
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
import { useSocket } from '../../../context/Socket';
const Header = ({ headerdata }) => {
    const navigation = useNavigation()
    const { user } = useAuth()
    const { ActiveUser } = useSocket()
    const [onlineStatus, setOnlineStatus] = useState(false);
    useEffect(() => {
        if (ActiveUser) {
            const check = ActiveUser.some(a => a.userID === user?.userID);
            if (check)
                setOnlineStatus(true);
        }
    }, [ActiveUser, user?.userID])
    return (
        <SafeAreaView style={styles.headerContainer}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Pressable onPress={() => navigation.navigate('Profile')}>
                    <Image
                        source={{ uri: `${Image_URL}${user?.profile}` }}
                        style={styles.profileImage}
                    />
                    {/* <View style={{
                        borderRadius: 100, backgroundColor: 'green',
                        position: 'absolute', borderWidth: 10, borderColor: onlineStatus ? '#06f021' : '#dc1515'
                    }}></View> */}
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
                            {headerdata?.surah_Urdu_Names}
                        </Text>
                    </View>
                    {/* "totalAyats": 287,
                    "completedAyats": 4,
                    "ayatProgress": 1.39 */}
                    <Text style={styles.progressSubtitle}>{headerdata?.ayatProgress || 0}%</Text>
                </View>

                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                width: `${headerdata?.ayatProgress || 0}%`
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
        // console.log(user)
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
                // console.log(result);
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
            console.error("Conversion Error:", error);
            return utcTimeValue.split(':')[0] + utcTimeValue.split(':')[1];
        }
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
    const upcoming = data?.upcomingClass?.[0];
    return (
        <View style={{ flex: 1 }}>
            <Header headerdata={data?.surahAyat || null} />
            <ScrollView style={{ flex: 1, padding: 10, paddingTop: 10 }} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                {/* Upcoming Class Card */}
                {upcoming && (
                    <View style={styles.upcomingCard}>

                        {/* Header */}
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Upcoming Class</Text>

                            <View style={[
                                styles.badge,
                                upcoming?.status === 'pending' ? styles.pending : styles.defaultBadge
                            ]}>
                                <Text style={styles.badgeText}>
                                    {upcoming?.status?.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        {/* Student Info */}
                        <View style={styles.row}>
                            <Image
                                source={{ uri: Image_URL + (upcoming?.tutorProfile || '') }}
                                style={styles.avatar}
                            />

                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>{upcoming?.tutorName}</Text>
                                <Text style={styles.sub}>{upcoming?.subject}</Text>
                            </View>
                        </View>

                        {/* Surah */}
                        <Text style={styles.surah}>{upcoming?.surahName}</Text>

                        {/* Date & Time */}
                        <View style={styles.infoRow}>
                            <Icon name="calendar-outline" size={14} color="#666" />
                            <Text style={styles.infoText}>{upcoming?.scheduledDate}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="time-outline" size={14} color="#666" />
                            <Text style={styles.infoText}>
                                {convertUtcToUserTime(upcoming?.startTime)} - {convertUtcToUserTime(upcoming?.endTime)}
                            </Text>
                        </View>

                        {/* Button */}
                        <TouchableOpacity
                            disabled={checkDateAndTime({ i: upcoming })}
                            onPress={() => navigation.navigate('Class', { classID: upcoming?.classId })}
                            style={
                                checkDateAndTime({ i: upcoming })
                                    ? styles.btnDisabled
                                    : styles.btn
                            }
                        >
                            <Icon name="videocam-outline" size={16} color="#fff" />
                            <Text style={styles.btnText}>
                                {checkDateAndTime({ i: upcoming }) ? 'Scheduled' : 'Join'}
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
                        onPress={() => navigation.navigate('Juz')}
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