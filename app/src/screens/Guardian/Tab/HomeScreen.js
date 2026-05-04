/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import {
    View, Text, Image, ScrollView, RefreshControl, StatusBar,
    TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import ChildrenHeader from '../../../components/ChildrenHeader';
import { useChildrens } from '../../../context/Childrens';

const { width } = Dimensions.get('window');

const ChildSummary = ({ data }) => {
    const progress = data?.classStatistics?.progressPercentage || 0;

    return (
        <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
                <View>
                    <Text style={styles.summaryTitle}>Progress</Text>
                    <Text style={styles.summarySubtitle}>Based on overall attendance</Text>
                </View>
                <Text style={styles.percentageText}>{progress}%</Text>
            </View>

            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            <View style={styles.summaryFooter}>
                <Text style={styles.footerNote}>Keep it up! You're doing great.</Text>
            </View>
        </View>
    );
};

const Stats = ({ data }) => {
    const stats = [
        { label: 'Total', value: data?.classStatistics?.totalClasses, icon: 'book-outline', color: '#6366f1' },
        { label: 'Done', value: data?.classStatistics?.completedClasses, icon: 'checkmark-done-circle-outline', color: '#059669' },
        { label: 'Pending', value: data?.classStatistics?.pendingClasses, icon: 'hourglass-outline', color: '#f59e0b' }
    ];

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Learning Activity</Text>
            <View style={styles.statsGrid}>
                {stats.map((item, i) => (
                    <View key={i} style={styles.statBox}>
                        <View style={[styles.iconCircle, { backgroundColor: `${item.color}15` }]}>
                            <Icon name={item.icon} size={22} color={item.color} />
                        </View>
                        <Text style={styles.statValue}>{item.value || 0}</Text>
                        <Text style={styles.statLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// --- Component 3: Premium Upcoming Class Card ---
const UpcomingClass = ({ data, isLocked }) => {
    if (!data?.upcomingClass) return null;
    const cls = data.upcomingClass;

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Upcoming Class</Text>
            <View style={styles.upcomingCard}>
                <View style={styles.instructorRow}>
                    <Image
                        source={{ uri: `${Image_URL}${cls?.instructorProfile}` }}
                        style={styles.instructorAvatar}
                    />
                    <View style={styles.instructorInfo}>
                        <Text style={styles.instructorName}>{cls.instructorName}</Text>
                        <Text style={styles.instructorRole}>Assigned Tutor</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: isLocked ? '#F3F4F6' : '#DCFCE7' }]}>
                        <Text style={[styles.badgeText, { color: isLocked ? '#6B7280' : '#166534' }]}>
                            {isLocked ? 'Scheduled' : 'Live Now'}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.lessonInfo}>
                    <View style={styles.infoRow}>
                        <Icon name="library-outline" size={18} color="#6B7280" />
                        <Text style={styles.lessonText}>{cls?.surahName} • {cls?.lessonName.split('-')[1]}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="calendar-outline" size={18} color="#6B7280" />
                        <Text style={styles.lessonText}>{cls?.scheduledDate}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.actionButton, isLocked && styles.disabledButton]}
                >
                    <Text style={[styles.actionButtonText, isLocked && styles.disabledButtonText]}>
                        {isLocked ? 'Waiting for Start Time' : 'Join Classroom'}
                    </Text>
                    {!isLocked && <Icon name="arrow-forward" size={18} color="#fff" />}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function HomeScreen() {
    const { child } = useChildrens();
    const [refreshing, setRefreshing] = useState(false);
    const [data, setHeaderData] = useState(null);

    const FetchData = useCallback(async () => {
        try {
            const response = await fetch(`${Base_URL}StudentDashboard/GetDataOfStudent?studentId=${child?.childrenID}`);
            if (response.ok) {
                const result = await response.json();
                if (result?.success) setHeaderData(result?.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, [child?.childrenID]);

    useFocusEffect(useCallback(() => { FetchData(); }, [FetchData]));

    const isLocked = data?.upcomingClass ? true : false; // Use your logic here

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            <ChildrenHeader />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); FetchData(); }} />}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                <ChildSummary data={data} />
                <Stats data={data} />
                <UpcomingClass data={data} isLocked={isLocked} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Professional off-white
    },
    sectionContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    // Summary Card
    summaryCard: {
        margin: 16,
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 2,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    summarySubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    percentageText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#059669',
    },
    progressTrack: {
        height: 10,
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#059669',
        borderRadius: 5,
    },
    summaryFooter: {
        marginTop: 12,
    },
    footerNote: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#9CA3AF',
    },
    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        width: (width - 48) / 3,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    statLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    // Upcoming Card
    upcomingCard: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    instructorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    instructorAvatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#E5E7EB',
    },
    instructorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    instructorName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    instructorRole: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 15,
    },
    lessonInfo: {
        gap: 8,
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    lessonText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: '#059669',
        padding: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#F3F4F6',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    disabledButtonText: {
        color: '#9CA3AF',
    }
});