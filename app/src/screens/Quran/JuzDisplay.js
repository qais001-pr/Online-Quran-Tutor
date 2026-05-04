/* eslint-disable react-native/no-inline-styles */

import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Base_URL } from '../../../IpConfig'

export default function JuzDisplay({ navigation, route }) {
    const juzID = route?.params?.JuzID;
    const [data, setdata] = useState()
    let FetchJuz = useCallback(async () => {
        try {
            const response = await fetch(Base_URL + `Qurans/GetQuranAyatsFromJuzs?Juzid=${juzID}`)
            if (response.ok) {
                const result = await response.json()
                setdata(result)
            }
        } catch (error) {
            console.log(error)
        }
    }, [juzID])
    useEffect(() => {
        FetchJuz()
    }, [FetchJuz])
    const renderItem = ({ item }) => (
        <View style={styles.ayahCard}>
            <Text style={styles.ayahNumber}>
                {item?.VerseID}
            </Text>

            <Text style={styles.ayahText}>
                {item?.AyahText}
            </Text>
        </View>
    );
    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.surahName}>سُورَةُ الفَاتِحَة</Text>
                <Text style={styles.metaText}>
                    {data?.length || 0} Ayat
                </Text>
            </View>

            {/* Ayah List */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    )
}




const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },

    /* HEADER */
    header: {
        backgroundColor: '#097343',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
    },

    surahName: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'QuranFonts',
        marginBottom: 4,
    },

    metaText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },

    /* AYAH CARD */
    ayahCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,

        elevation: 2,
    },

    ayahNumber: {
        position: 'absolute',
        top: 10,
        left: 10,
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },

    ayahText: {
        fontSize: 22,
        color: '#222',
        textAlign: 'right', // IMPORTANT for Arabic
        lineHeight: 38,
        fontFamily: 'QuranFonts',
    },
});