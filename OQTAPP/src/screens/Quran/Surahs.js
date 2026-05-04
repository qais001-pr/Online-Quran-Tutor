/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Base_URL } from '../../../IpConfig';
import Icon from 'react-native-vector-icons/Ionicons'
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../theme/Colors';
export default function Surahs({ navigation, route }) {
    const [surahs, setSurahs] = useState([]);

    const FetchSurahs = useCallback(async () => {
        try {
            const response = await fetch(Base_URL + 'Qurans/GetSurah');
            if (response.ok) {
                const result = await response.json();
                setSurahs(result);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        FetchSurahs();
    }, [FetchSurahs]);

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('SurahsDisplay', { surahID: item?.Id })}
                style={styles.card} activeOpacity={0.8}>
                {/* Left Number */}
                <View style={styles.numberContainer}>
                    <Text style={styles.number}>{index + 1}</Text>
                </View>
                {/* Surah Info */}
                <View style={styles.info}>
                    <Text style={styles.name}>
                        {item?.surah_names || 'Surah Name'}
                    </Text>
                    <Text style={styles.subText}>
                        {item?.surah_Urdu_Names || ''}
                    </Text>
                </View>

                {/* Right Arrow */}
                <Icon name='arrow-forward' size={30} color={Colors.backgroundColor} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: 60, backgroundColor: Colors.backgroundColor, elevation: 10, marginBottom: 10, alignItems: 'center', flexDirection: 'row', paddingLeft: 10, }}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name='arrow-back' size={30} color={'white'} />
                </Pressable>
                <Text style={{
                    fontSize: 25, color: 'white', marginLeft: 10,
                }}>Surahs</Text>
            </View>
            <FlatList
                data={surahs}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 10 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 12,
        elevation: 3,
    },
    numberContainer: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: Colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    number: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    subText: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
    },
    arrow: {
        fontSize: 22,
        color: '#ccc',
    },
});