/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text, Image, FlatList, ToastAndroid, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import Header from '../../../components/Header';
import { useAuth } from '../../../context/auth';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import { useFocusEffect } from '@react-navigation/native';
import { externalStyles } from '../../../styles/Tutor/Tab/HomeDashboard'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'
export default function HomeDashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
            FetchTodayClass();
        }, [user?.userID])
    );

    const FetchTodayClass = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await fetch(Base_URL + `Dashboard/getTutorUpcomingClass?UserId=${user?.userID}`);
            if (response.ok) {
                const result = await response.json();
                setDashboardData(result);
                ToastAndroid.show('Fetched Data Successfully', 2000);
            } else {
                ToastAndroid.show('Something Went Wrong', 2000);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    }, [user?.userID]);
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
    const onRefresh = () => FetchTodayClass();
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
        console.log('Class Date', i?.ClassDate)
        console.log('Same Day', isSameDate)
        const currentHour = now.getHours();
        const utcTimeStart = convertUtcToUserTime(i.startTime)
        const utcTimeEnd = convertUtcToUserTime(i.endTime)
        const startHour = parseInt(utcTimeStart.split(':')[0], 10);
        const endHour = parseInt(utcTimeEnd.split(':')[0], 10);
        console.log('Start Time: ', startHour)
        console.log('End Time: ', endHour)

        const isInTimeRange = (currentHour >= startHour && currentHour < endHour);
        console.log('Time Range ', isInTimeRange)

        if (isSameDate && isInTimeRange) {
            return false;
        }
        return true;
    };
    const RenderTodayClasses = () => (
        <View style={externalStyles.sectionContainer}>
            <View style={externalStyles.sectionHeader}>
                <Text style={externalStyles.sectionTitle}>Today's Classes</Text>
                <View style={externalStyles.badge}>
                    <Text style={externalStyles.badgeText}>{dashboardData?.todaysClasses?.length || 0}</Text>
                </View>
            </View>
            <FlatList
                data={dashboardData?.todaysClasses || []}
                keyExtractor={(item) => item.classId.toString()}
                contentContainerStyle={externalStyles.horizontalList}
                renderItem={({ item }) => {
                    const Check = checkDateAndTime({ i: item })
                    return (
                        <View style={externalStyles.classCard}>
                            {/* Header: Avatar and Name */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Image
                                    source={{ uri: `${Image_URL}${item.studentProfile}` }}
                                    style={externalStyles.studentAvatar}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={[externalStyles.studentNameBold, { flex: 1 }]}>
                                    {item?.studentName}
                                </Text>
                            </View>

                            {/* Lesson Info */}
                            <Text style={externalStyles.lessonAndSurahText}>
                                {item?.surahName || ''}  -  {item?.subject || ''}
                            </Text>

                            {/* Time Info */}
                            <View style={[externalStyles.timeContainer, { flexDirection: 'row', marginTop: 4 }]}>
                                <Text style={externalStyles.whiteText}>
                                    {convertUtcToUserTime(item?.startTime)} - {convertUtcToUserTime(item?.endTime)}
                                </Text>
                            </View>

                            {/* Date */}
                            <Text style={[externalStyles.whiteText, { marginTop: 2 }]}>
                                {item?.classDate}
                            </Text>

                            {/* Status Badge */}
                            <View style={[externalStyles.statusBadge, { alignSelf: 'flex-start', marginTop: 8 }]}>
                                <Text style={externalStyles.statusText}>{item?.status}</Text>
                            </View>
                            <TouchableOpacity
                                disabled={Check}
                                onPress={() => navigation.navigate('Class', { classID: item?.classId, startTime: item?.startTime, endTime: item?.endTime })}

                                style={Check ? externalStyles.joinBtnDisabled
                                    : externalStyles.joinBtn}
                            >
                                <Icon name="videocam-outline" size={16} color="#fff" />
                                <Text style={externalStyles.joinText}>
                                    {Check ?
                                        'Scheduled' : 'Join'
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
                ListEmptyComponent={<Text style={externalStyles.emptyText}>No classes for today</Text>}
            />
        </View>
    );

    // // Statistics Grid
    // const RenderStats = () => {
    //     const stats = dashboardData?.monthlyStatistics;
    //     return (
    //         <View style={externalStyles.statsContainer}>
    //             <Text style={externalStyles.subSectionTitle}>Monthly Performance</Text>
    //             <View style={externalStyles.statsGrid}>
    //                 <StatBox label="Pending" value={stats?.pendingClasses || 0} color="#F5A623" />
    //                 <StatBox label="Completed" value={stats?.completedClasses || 0} color="#7ED321" />
    //                 <StatBox label="Progress" value={`${stats?.progress || 0}%`} color="#9013FE" />
    //             </View>
    //         </View>
    //     );
    // };

    // const StatBox = ({ label, value, color }) => (
    //     <View style={[externalStyles.statBox, { borderBottomColor: color }]}>
    //         <Text style={externalStyles.statLabel}>{label}</Text>
    //         <Text style={externalStyles.statValue}>{value}</Text>
    //     </View>
    // );

    const ListHeader = () => (
        <View>
            {/* <RenderStats /> */}
            <RenderTodayClasses />
            <View style={externalStyles.studentListHeader}>
                <Text style={externalStyles.sectionTitle}>My Students</Text>
                <Text style={externalStyles.totalCountText}>Total: {dashboardData?.TotalStudents || 0}</Text>
            </View>
        </View>
    );

    return (
        <View style={externalStyles.mainContainer}>
            <Header />
            <FlatList
                ListHeaderComponent={ListHeader}
                data={dashboardData?.students || []}
                keyExtractor={(item) => item.studentId.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#003366']} />}
                renderItem={({ item }) => (
                    <TouchableOpacity style={externalStyles.studentItemCard}>
                        <Image
                            source={{ uri: Image_URL + item.studentProfile }}
                            style={externalStyles.studentAvatar}
                        />
                        <View style={externalStyles.studentInfo}>
                            <Text style={externalStyles.studentNameText}>{item.studentName}</Text>
                            <Text style={externalStyles.studentLocationText}>Location: {item.studentLocation}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={externalStyles.centeredEmptyText}>No students linked</Text>}
                contentContainerStyle={externalStyles.listPadding}
            />
        </View>
    );
}
