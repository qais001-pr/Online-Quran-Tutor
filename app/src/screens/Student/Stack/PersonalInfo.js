/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    StatusBar,
    Pressable,
    Image,
    ScrollView,
} from 'react-native';
import React from 'react';
import Colors from '../../../theme/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../context/auth';
import { Image_URL } from '../../../../IpConfig';
import { styles } from '../../../styles/Student/Stack/PersonnelInfoStyle';

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <Icon name={icon} size={20} color={Colors.header} />
        <View style={{ marginLeft: 12 }}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || '-'}</Text>
        </View>
    </View>
);

export default function PersonalInfoStudent({ navigation }) {
    const { user } = useAuth();

    return (
        <View style={styles.safeAreaView}>
            <StatusBar barStyle={'dark-content'} />

            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" color="white" size={25} />
                </Pressable>
                <Text style={styles.headerText}>Personal Info</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* PROFILE CARD */}
                <View style={styles.profileCard}>
                    <Image
                        source={{
                            uri: `${Image_URL}${user.profile}`
                        }}
                        style={styles.profileImage}
                    />

                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.subText}>{user?.city}, {user?.country}</Text>
                </View>

                {/* INFO CARD */}
                <View style={styles.infoCard}>
                    <InfoRow icon="person" label="Full Name" value={user?.name} />
                    <InfoRow icon="location" label="City" value={user?.city} />
                    <InfoRow icon="flag" label="Country" value={user?.country} />
                    <InfoRow
                        icon="calendar"
                        label="Date of Birth"
                        value={user?.dateOfBirth?.split('T')[0]}
                    />
                    <InfoRow icon="male-female" label="Gender" value={user?.gender} />
                </View>
            </ScrollView>
        </View>
    );
}

