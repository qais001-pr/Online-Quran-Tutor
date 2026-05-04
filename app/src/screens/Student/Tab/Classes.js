/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import { View, Modal, FlatList, Image, TouchableOpacity, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Standard industry library

import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import { useAuth } from '../../../context/auth';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import Colors from '../../../theme/Colors';
import { Text } from 'react-native-gesture-handler';
import { styles } from '../../../styles/Student/Tab/ClassesStyle';
export default function Classes({ navigation }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [classesList, setClassesList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(

        useCallback(() => {

            fetchClasses()

        }, [fetchClasses]))

    // Fetch Classes Data

    const fetchClasses = useCallback(async () => {

        try {

            setLoading(true);

            const response = await fetch(Base_URL + `Classes/getClassesByStudent?studentID=${user?.userID}`)

            // console.log(response);

            if (response.ok) {

                const result = await response.json();

                // console.log(result);

                setClassesList(result?.data)

            }

        } catch (error) {

            setLoading(false)

        } finally {

            setLoading(false)

            setRefreshing(false)

        }



    }, [user?.userID])



    const getDate = (date) => {

        return date.split('T')[0]

    }

    let classJoin = (classID) => {

        navigation.navigate('Class', { classID: classID })

    }

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

    const onRefresh = () => {

        setRefreshing(true); setLoading(false)

        fetchClasses();

    };

    const renderClassItem = ({ item }) => {
        const isDisabled = checkDateAndTime({ i: item });

        return (
            <View style={styles.card}>
                {/* Top Section: Profile & Status */}
                <View style={styles.cardHeader}>
                    <Image
                        source={{ uri: `${Image_URL}${item?.tutorProfileImage}` }}
                        style={styles.avatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.tutorName}>{item?.tutorName || 'Unknown Tutor'}</Text>
                        <Text style={styles.subjectText}>{item?.subjectName} • {item?.lessonName}</Text>
                    </View>
                    <View style={[styles.statusBadge, isDisabled ? styles.scheduledBadge : styles.liveBadge]}>
                        <View style={[styles.dot, isDisabled ? styles.scheduledDot : styles.liveDot]} />
                        <Text style={[styles.statusText, isDisabled ? styles.scheduledText : styles.liveText]}>
                            {isDisabled ? 'Upcoming' : 'Live Now'}
                        </Text>
                    </View>
                </View>

                {/* Middle Section: Date & Time */}
                <View style={styles.detailContainer}>
                    <View style={styles.infoRow}>
                        <Icon name="calendar-month" size={16} color="#666" />
                        <Text style={styles.detailText}>{item?.ClassDate?.split('T')[0]}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="clock-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>
                            {convertUtcToUserTime(item?.startTime)} - {convertUtcToUserTime(item?.endTime)}
                        </Text>
                    </View>
                </View>

                {/* Bottom Section: Action Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Class', { classID: item.ClassID })}
                    disabled={isDisabled}
                    style={[styles.joinBtn, isDisabled && styles.joinBtnDisabled]}
                >
                    <Text style={[styles.joinBtnText, isDisabled && styles.joinBtnTextDisabled]}>
                        {isDisabled ? 'Class Locked' : 'Join Session'}
                    </Text>
                    {!isDisabled && <Icon name="arrow-right" size={18} color="#FFF" />}
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
                <Text style={styles.subtitle}>Manage your upcoming learning sessions</Text>
            </View>
            <FlatList
                data={classesList}
                keyExtractor={(item) => item?.ClassID.toString()}
                renderItem={renderClassItem}
                contentContainerStyle={{ paddingBottom: 30 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={!loading && (
                    <View style={styles.emptyState}>
                        <Icon name="book-open-variant" size={60} color="#CCC" />
                        <Text style={styles.emptyText}>No classes scheduled for this week</Text>
                    </View>
                )}
            />
            {loading && (
                <Modal transparent animationType="fade">
                    <Loader />
                </Modal>
            )}
        </View>
    );
}