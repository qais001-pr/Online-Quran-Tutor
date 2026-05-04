import { View, Text, StatusBar, Platform, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '../theme/Colors';
import { useAuth } from '../context/auth';
import { Image_URL } from '../../IpConfig';
import { useNavigation } from '@react-navigation/native';
export default function Header() {
    const { user } = useAuth();
    const navigation = useNavigation()
    return (
        <View style={styles.headerContainer}>
            {/* Profile Image */}
            <StatusBar barStyle={'dark-content'} />
            <Text style={styles.userName}>
                {user?.name || 'Guest'}
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                {user?.profile ? (
                    <Image
                        source={{ uri: `${Image_URL}${user.profile}` }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={[styles.avatar, styles.noImage]}>
                        <Text style={styles.noImageText}>No Image</Text>
                    </View>
                )}
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: Colors.header,
        height: 60,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: Colors.secondary,
        backgroundColor: '#eee',
    },
    noImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        fontSize: 10,
        color: '#555',
    },
    userName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
