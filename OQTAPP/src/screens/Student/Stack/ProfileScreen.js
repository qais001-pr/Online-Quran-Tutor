/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    ToastAndroid,
    ScrollView,
} from 'react-native';
import { useAuth } from '../../../context/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../../theme/Colors';
import { Base_URL, Image_URL } from '../../../../IpConfig';
import { launchImageLibrary } from 'react-native-image-picker';
import { styles } from '../../../styles/Student/Stack/ProfileStyle';
import { useNavigation } from '@react-navigation/native';
const Row = ({ iconName, subtitle, Path, navigation, isLast }) => (
    <TouchableOpacity
        style={[styles.row, isLast && { borderBottomWidth: 0 }]}
        onPress={() => navigation.navigate(Path)}
    >
        <View style={styles.rowIconContainer}>
            <Icon name={iconName} size={22} color={Colors.header || '#045e43'} />
        </View>
        <Text style={styles.rowText}>{subtitle}</Text>
        <Icon name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const navigation = useNavigation()
    const { user, logout } = useAuth();
    const [picture, setPicture] = useState(
        user?.profile ? `${Image_URL}${user.profile}` : null
    );

    const RowList = [
        { key: 1, iconName: 'person-outline', subtitle: 'Personal Info', Path: 'PersonalInfo' },
    ];
    const GuardianRow = [
        { key: 1, iconName: 'people-outline', subtitle: 'Children', Path: 'ChildrenAccounts' },
    ];

    useEffect(() => {
        if (!user) navigation.replace('Login');
    }, [user, navigation]);

    if (!user) return null;

    const logoutAction = async () => {
        await logout();
        navigation.navigate('Login');
    };

    const updatePicture = async () => {
        try {
            const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
            if (result.didCancel || !result.assets?.[0]) return;

            const asset = result.assets[0];
            setPicture(asset.uri);

            const formData = new FormData();
            formData.append('updatedProfilePicture', {
                uri: asset.uri,
                type: asset.type,
                name: asset.fileName || 'profile.jpg',
            });

            const response = await fetch(
                `${Base_URL}Profile/UpdateProfilePicture?userid=${user.userID}&oldPath=${user.profile}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    body: formData,
                }
            );

            if (response.ok) {
                ToastAndroid.show('Profile Updated!', ToastAndroid.SHORT);
            }
        } catch (e) {
            ToastAndroid.show('Upload Failed!', ToastAndroid.LONG);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Header Curve */}
            <View style={styles.headerCurve} />

            <View style={styles.headerContent}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircleBtn}>
                    <Icon name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity onPress={logoutAction} style={styles.headerCircleBtn}>
                    <Icon name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Image Section */}
                <View style={styles.imageSection}>
                    <View style={styles.imageWrapper}>
                        {picture ? (
                            <Image source={{ uri: picture }} style={styles.profileImage} />
                        ) : (
                            <View style={[styles.profileImage, styles.noImage]}>
                                <Text style={styles.noImageText}>{user?.name?.charAt(0)}</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.cameraBtn}
                            onPress={updatePicture}
                            activeOpacity={0.9}
                        >
                            <Icon name="camera" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'Student Account'}</Text>
                </View>

                {/* Settings Card */}
                <View style={styles.menuCard}>
                    <Text style={styles.cardLabel}>Account Settings</Text>
                    {RowList.map((r, index) => (
                        <Row
                            key={r.key}
                            iconName={r.iconName}
                            subtitle={r.subtitle}
                            Path={r.Path}
                            navigation={navigation}
                            isLast={index === RowList.length - 1}
                        />
                    ))}
                    {
                        user?.userType === 'Guardian' &&
                        GuardianRow.map((r, index) => (
                            <Row
                                key={r.key}
                                iconName={r.iconName}
                                subtitle={r.subtitle}
                                Path={r.Path}
                                navigation={navigation}
                                isLast={index === RowList.length - 1}
                            />
                        ))}
                </View>

                {/* Optional: App Info Card */}
                {/* <View style={[styles.menuCard, { marginTop: 20 }]}>
                    <Text style={styles.cardLabel}>Other</Text>
                    <Row iconName="help-circle-outline" subtitle="Help Center" navigation={navigation} />
                    <Row iconName="information-circle-outline" subtitle="About App" navigation={navigation} isLast={true} />
                </View> */}
            </ScrollView>
        </View>
    );
}
