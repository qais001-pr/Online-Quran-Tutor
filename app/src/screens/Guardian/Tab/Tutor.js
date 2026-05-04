/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
    ActivityIndicator,
    Platform,
    ToastAndroid, RefreshControl
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Portal, Provider } from 'react-native-paper';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import Colors from '../../../theme/Colors';
import { useFocusEffect, } from '@react-navigation/native';
import { styles } from '../../../styles/Student/Tab/TutorStyle';
import Icon from 'react-native-vector-icons/Ionicons'
import { useChildrens } from '../../../context/Childrens';
import ChildrenHeader from '../../../components/ChildrenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Tutor({ navigation }) {
    const { selectedChildID, child } = useChildrens();
    const [loading, setLoading] = useState(false);
    const [hireCheck, sethireCheck] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [surahlist, setSurahlist] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [tutorID, setTutorID] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true); setLoading(false)
        fetchData();
    };
    useEffect(() => {
        fetchData()
    }, [selectedChildID, fetchData])
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );
    let fetchSurah = async () => {
        try {
            const response = await fetch(`${Base_URL}Qurans/GetSurah`)
            const data = await response.json()
            setSurahlist(data)
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false)
        }
    }
    useEffect(() => {
        fetchSurah()
    }, [])
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${Base_URL}Students/getAvailableTutorByStudentID?studentID=${selectedChildID}`
            );

            const data = await response.json();
            setDataList(data);

        } catch (error) {
            console.log('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedChildID])
    // When i will click on the Hire Button
    const HireButton = (item) => {
        try {
            setTutorID(item?.userID);
            sethireCheck(true)
        } catch (error) {
            console.log(error);
        }
    }
    // When i will click on the Sent Button this will work
    const SentRequest = async () => {
        if (!selectedSurah) {
            return;
        }
        // console.log(user)
        const SurahID = selectedSurah?.Id;
        try {
            const response = await fetch(`${Base_URL}Requests/requestToTutor`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tutorId: tutorID,
                    surahID: SurahID,
                    studentId: selectedChildID,
                    email: child?.email
                }),
            })
            const result = await response.json();
            // console.log(result);
            if (!result?.success) {
                Platform.OS === 'android' && ToastAndroid.show('Request Already Send to this Tutor', 4000)
                return;
            }
            if (response.ok) {
                if (result?.success) {
                    Platform.OS === 'android' && ToastAndroid.show('Request Send Successfully', 4000)
                    return;
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            sethireCheck(!hireCheck)
        }
    }

    //  TUTOR CARD 
    const renderTutor = ({ item }) => (
        <View style={styles.card}>

            {/* TOP ROW */}
            <View style={styles.topRow}>

                {/* LEFT CLICKABLE AREA */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.leftSection}
                    onPress={() =>
                        navigation.navigate('TutorProfile', {
                            userid: item?.userID,
                        })
                    }
                >
                    <Image
                        style={styles.avatar}
                        source={{
                            uri: `${Image_URL}${item.profile}`
                        }}
                    />

                    <View style={styles.infoSection}>
                        <Text style={styles.name}>{item?.name}</Text>
                        <Text style={styles.location}>
                            {item?.city}, {item?.country}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <Icon name='star' color='#dfd043' size={14} />
                            </View>
                            <Text style={styles.location}>
                                {item?.rating.toFixed(1)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* RIGHT BUTTON */}
                <TouchableOpacity style={styles.hireBtn}

                    onPress={() => HireButton(item)}>
                    <Text style={styles.hireText}>Hire</Text>
                </TouchableOpacity>

            </View>

            {/* SUBJECTS */}
            {!!item?.subjects?.length && (
                <View style={styles.subjectContainer}>
                    {item.subjects.map(sub => (
                        <View key={sub.subjectID} style={styles.subjectChip}>
                            <Text style={styles.subjectText}>
                                {sub.subjectName}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

        </View>
    );


    // UI
    return (
        <Provider>
            <SafeAreaView style={styles.safeAreaView}>

                {/* Children Header */}
                <ChildrenHeader />
                {/* LIST */}
                <FlatList
                    data={dataList}
                    keyExtractor={(item) => item.userID.toString()}
                    renderItem={renderTutor}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    ListHeaderComponent={() => (<View
                        style={{ marginBottom: 5 }}>
                        <Text style={{ fontSize: 18, color: 'green', fontWeight: '600' }}>Available Tutors</Text>
                    </View>)}
                    ListEmptyComponent={
                        !loading && (
                            <Text style={styles.emptyText}>
                                No tutors available
                            </Text>)}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />

                {/* LOADING MODAL */}
                <Portal>
                    <Modal visible={loading} transparent>
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="white" />
                            <Text style={{ color: 'white', marginTop: 10 }}>
                                Loading Tutors...
                            </Text>
                        </View>
                    </Modal>
                </Portal>

            </SafeAreaView>
            <Portal>
                <Modal
                    transparent={true}
                    visible={hireCheck}
                    onDismiss={() => {
                        sethireCheck(false);
                        setSelectedSurah(null);
                    }}
                >
                    <View style={styles.hireSheet}>
                        <View style={styles.modalIndicator} />

                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Select Surah</Text>
                                <Text style={styles.modalSubtitle}>Which lesson will you start today?</Text>
                            </View>
                            <TouchableOpacity onPress={() => sethireCheck(false)} style={styles.closeBtn}>
                                <Text style={{ color: '#999', fontSize: 16 }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={surahlist}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                const isSelected = selectedSurah?.Id === item.Id;
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedSurah(item)}
                                        style={[
                                            styles.surahItem,
                                            isSelected && styles.selectedItem
                                        ]}
                                    >
                                        <View style={[styles.surahNumber, isSelected && { backgroundColor: Colors.header }]}>
                                            <Text style={[styles.surahNumberText, isSelected && { color: 'white' }]}>
                                                {item?.Id || '?'}
                                            </Text>
                                        </View>
                                        <Text style={styles.surahName}>{item?.surah_names || ''}</Text>
                                        <Text style={styles.arabicName}>{item?.surah_Urdu_Names || ''}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        />

                        {/* FIXED FOOTER BUTTON */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                disabled={!selectedSurah}
                                style={[styles.sendBtn, !selectedSurah && styles.disabledBtn]}
                                onPress={SentRequest}
                            >
                                <Text style={styles.sendText}>
                                    Sent
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Portal>


        </Provider>
    );
}
