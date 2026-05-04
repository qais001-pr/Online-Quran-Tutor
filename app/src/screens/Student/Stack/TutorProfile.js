/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

import {
    View,
    Text,
    Platform,
    ToastAndroid,
    Image,
    ActivityIndicator,
    ScrollView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import Colors from '../../../theme/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../../../styles/Student/Stack/TutorStyle';

export default function TutorProfile({ navigation, route }) {

    const { userid } = route?.params || {};
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userid) {
            navigation.goBack();
            Platform.OS === 'android' &&
                ToastAndroid.show('Something went wrong!', ToastAndroid.LONG);
            return;
        }

        fetchTutor();
    }, []);

    const fetchTutor = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${Base_URL}Students/getTutorData?userid=${userid}`
            );

            const data = await response.json();

            if (data?.success) {
                setUser(data.tutor);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.header} />
                <Text style={{ marginTop: 10 }}>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back' size={28} color='white' />
                    </TouchableOpacity>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Tutor Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* PROFILE TOP */}
                <View style={styles.topSection}>
                    {user?.profile ? (
                        <Image
                            source={{ uri: `${Image_URL}${user.profile}` }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.noImage]}>
                            <Text>No Image</Text>
                        </View>
                    )}

                    <Text style={styles.name}>{user?.name}</Text>

                    <Text style={styles.location}>
                        {user?.city || '-'}, {user?.country || '-'}
                    </Text>
                </View>

                {/* ABOUT */}
                {!!user?.about && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>About Tutor</Text>
                        <Text style={styles.about}>{user.about}</Text>
                    </View>
                )}

                {/* DETAILS */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Personal Details</Text>

                    <InfoRow label="Gender" value={user?.gender} />
                    <InfoRow label="Timezone" value={user?.timezone} />
                    <InfoRow
                        label="Date of Birth"
                        value={user?.dateOfBirth?.split('T')[0]}
                    />
                </View>
                {/* SUBJECTS */}
                {!!user?.Subjects?.length && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Subjects</Text>

                        <View style={styles.subjectContainer}>
                            {user.Subjects.map((item, index) => (
                                <View key={index} style={styles.subjectChip}>
                                    <Icon
                                        name="book-outline"
                                        size={16}
                                        color={Colors.header}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text style={styles.subjectText}>
                                        {item?.subjectName}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

            </ScrollView>
        </View>
    );
}


const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
)
