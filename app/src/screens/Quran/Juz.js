/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    StatusBar,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Base_URL } from '../../../IpConfig';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../theme/Colors';
import { styles } from '../../styles/Quran/JuzsStyle';



export default function Juz({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [datalist, setData] = useState([]);

    const fetchJuz = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(Base_URL + 'Qurans/GetallJuz');
            console.log(response)
            if (response.ok) {
                const res = await response.json();
                setData(res);
            } else {
                navigation.goBack();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [navigation])

    useEffect(() => {
        fetchJuz();
    }, [fetchJuz]);

    const renderRow = ({ item }) => (
        <Pressable style={styles.card}>
            {/* Juz Number Circle */}
            <View style={styles.juzBadge}>
                <Text style={styles.juzNumber}>{item?.Juz_ID}</Text>
            </View>

            {/* Text Section */}
            <View style={{ flex: 1 }}>

                <Text style={styles.arabicText}>
                    {item?.Arbabic_Start_Word}
                </Text>
            </View>

            <Icon name="chevron-forward" size={26} color="#999" />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="white" />
                </Pressable>

                <Text style={styles.headerText}>Juz</Text>
            </View>

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.header}
                    style={{ marginTop: 40 }}
                />
            ) : (
                <FlatList
                    data={datalist}
                    keyExtractor={(item) => item.Juz_ID.toString()}
                    renderItem={renderRow}
                    contentContainerStyle={{ padding: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

