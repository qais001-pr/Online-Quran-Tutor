/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Animated,
    RefreshControl,
    StatusBar,
    Platform,
} from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Base_URL } from '../../../IpConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SurahsDisplay({ route, navigation }) {
    const surahID = route?.params?.surahID;
    const surahName = route?.params?.surahName;
    const [datalist, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const FetchSurah = useCallback(async () => {
        try {
            setError(null);
            const response = await fetch(
                Base_URL + `Qurans/getQuranAyatsFromSurahID?surahsID=${surahID}`
            );
            if (response.ok) {
                const result = await response.json();
                setDataList(result);
            } else {
                setError('Failed to load verses. Please try again.');
            }
        } catch (error) {
            console.log(error);
            setError('Unable to connect. Check your internet.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [surahID]);

    useEffect(() => {
        FetchSurah();
    }, [FetchSurah]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        FetchSurah();
    }, [FetchSurah]);

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <Text style={styles.surahName}>{surahName}</Text>
                <Text style={styles.verseCount}>
                    {datalist.length} {datalist.length === 1 ? 'Verse' : 'Verses'}
                </Text>
            </View>
            <View style={styles.decorativeElement} />
        </View>
    );

    const renderTopHeader = () => (
        <View style={styles.topHeader}>
            <Pressable
                style={styles.backButton}
                onPress={() => navigation?.goBack()}
                android_ripple={{ color: 'rgba(76, 175, 80, 0.2)' }}
            >
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.topHeaderTitle}>Quran</Text>
            <View style={styles.headerPlaceholder} />
        </View>
    );

    const renderItem = ({ item, index }) => {
        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        opacity: new Animated.Value(1),
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, 10],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.cardContent}>
                    <View style={styles.verseNumber}>
                        <Text style={styles.number}>{index + 1}</Text>
                    </View>
                    <Text style={styles.ayah}>{item.AyahText}</Text>
                </View>
                <View style={styles.cardDivider} />
            </Animated.View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No verses found</Text>
            <Text style={styles.emptyText}>
                Unable to load verses for this Surah
            </Text>
        </View>
    );

    const renderErrorState = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
                style={styles.retryButton}
                onPress={onRefresh}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
            >
                <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
        </View>
    );

    const renderLoadingState = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading verses...</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                {renderTopHeader()}
                {renderLoadingState()}
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                {renderTopHeader()}
                {renderErrorState()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <StatusBar barStyle={'dark-content'} />
            {renderTopHeader()}
            <Animated.FlatList
                data={datalist}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4CAF50"
                        colors={['#4CAF50']}
                    />
                }
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F7F4',
    },
    topHeader: {
        marginTop: Platform.OS === 'android' && StatusBar.currentHeight || 0,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
    },
    topHeaderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    headerPlaceholder: {
        width: 44,
        height: 44,
    },
    listContent: {
        paddingHorizontal: 12,
        paddingBottom: 20,
    },
    header: {
        marginTop: 8,
        marginBottom: 24,
        alignItems: 'center',
    },
    headerContent: {
        alignItems: 'center',
        marginBottom: 16,
    },
    surahName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2C2416',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    verseCount: {
        fontSize: 13,
        color: '#8B7D6B',
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    decorativeElement: {
        width: 60,
        height: 2,
        backgroundColor: '#4CAF50',
        borderRadius: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginBottom: 12,
        borderRadius: 14,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#4CAF50',
    },
    cardContent: {
        padding: 16,
        flexDirection: 'row',
        gap: 12,
    },
    verseNumber: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 44,
        marginTop: 2,
    },
    number: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4CAF50',
        textAlign: 'center',
    },
    ayah: {
        flex: 1,
        fontSize: 34,
        lineHeight: 36,
        textAlign: 'right',
        fontFamily: 'QuranFonts',
        color: '#2C2416',
        fontWeight: '500',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#E8DFD5',
        marginHorizontal: 16,
    },
    // Loading State
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 14,
        color: '#8B7D6B',
        fontWeight: '500',
    },
    // Error State
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    errorIcon: {
        fontSize: 56,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C2416',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#8B7D6B',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 20,
    },
    retryButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 200,
        elevation: 3,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyIcon: {
        fontSize: 56,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C2416',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#8B7D6B',
        textAlign: 'center',
        lineHeight: 20,
    },
});