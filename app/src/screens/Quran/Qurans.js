/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    TextInput,
    Animated,
    RefreshControl,
    Platform,
    StatusBar,
} from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'
import { Base_URL } from '../../../IpConfig';


export default function Qurans({ navigation }) {
    const [verses, setVerses] = useState([]);
    const [filteredVerses, setFilteredVerses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollY = useRef(new Animated.Value(0)).current;

    const fetchVerses = useCallback(async () => {
        try {
            setError(null);
            const response = await fetch(`${Base_URL}/Qurans/getQuranAyats`);
            if (response.ok) {
                const data = await response.json();
                setVerses(data);
                setFilteredVerses(data);
            } else {
                setError('Failed to load verses');
            }
        } catch (error) {
            console.log(error);
            setError('Unable to connect. Check your connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchVerses();
    }, [fetchVerses]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchVerses();
    }, [fetchVerses]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredVerses(verses);
        } else {
            const filtered = verses.filter((verse) =>
                verse.AyahText.includes(query) || verse.ID.toString().includes(query)
            );
            setFilteredVerses(filtered);
        }
    };

    const renderHeader = () => (
        <View>
            <View style={styles.topHeader}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation?.goBack()}
                    android_ripple={{ color: 'rgba(76, 175, 80, 0.2)' }}
                >
                    <Icon name="chevron-back" size={28} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.topHeaderTitle}>Quran</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <View style={styles.contentHeader}>
                <Text style={styles.mainTitle}>Holy Quran</Text>
                <Text style={styles.subtitle}>
                    {filteredVerses.length} {filteredVerses.length === 1 ? 'Verse' : 'Verses'}
                </Text>
            </View>

            {/* <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#8B7D6B" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search verses..."
                    placeholderTextColor="#C4B5A0"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                {searchQuery !== '' && (
                    <Pressable onPress={() => handleSearch('')}>
                        <Icon name="close-circle" size={20} color="#8B7D6B" />
                    </Pressable>
                )}
            </View> */}
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
                                    outputRange: [0, 5],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.verseNumberBadge}>
                        <Text style={styles.verseNumber}>{item.ID}</Text>
                    </View>
                    <View style={styles.decorativeLine} />
                </View>
                <Text style={styles.ayah}>{item.AyahText}</Text>
            </Animated.View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No verses found</Text>
            <Text style={styles.emptyText}>
                Try adjusting your search query
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
            <Text style={styles.loadingText}>Loading Holy Qur'an...</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                {renderLoadingState()}
            </SafeAreaView>
        );
    }

    if (error && verses.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                {renderHeader()}
                {renderErrorState()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {renderHeader()}
            <Animated.FlatList
                data={filteredVerses}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderItem}
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
    contentHeader: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2C2416',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#8B7D6B',
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 14,
        color: '#2C2416',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 12,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginBottom: 12,
        borderRadius: 14,
        overflow: 'hidden',
        paddingHorizontal: 16,
        paddingVertical: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    verseNumberBadge: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    verseNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4CAF50',
        textAlign: 'center',
    },
    decorativeLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E8DFD5',
        marginLeft: 10,
    },
    ayah: {
        fontSize: 32,
        lineHeight: 36,
        textAlign: 'right',
        fontFamily: 'QuranFonts',
        color: '#2C2416',
        fontWeight: '500',
        marginBottom: 2,
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