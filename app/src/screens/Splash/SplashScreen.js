import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Modal,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/auth';

import { styles } from '../../styles/Splash/SplashStyle';
import Loader from '../../components/Loader';

export default function SplashScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user === undefined) return;

        if (user) {
            const userType = user?.userType;
            if (userType === 'Student' || userType === 'Child') {
                navigation.replace(`StudentDashboard`);
                return;
            }
            navigation.replace(`${userType}Dashboard`)
        }
    }, [user, navigation]);

    const onNavigation = (name) => {
        setLoading(true);
        setTimeout(() => {
            navigation.replace(name);
            setLoading(false);
        }, 800);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="default" />

            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/images/splash.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => onNavigation('StudentSignup')}
                >
                    <Text style={styles.primaryText}>Sign Up as Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => onNavigation('TutorSignup')}
                >
                    <Text style={styles.primaryText}>Sign Up as Tutor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => onNavigation('Login')}
                >
                    <Text style={styles.secondaryText}>
                        Already have an account? Login
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Loading Modal */}
            <Modal transparent visible={loading}>
                <Loader message='Loading...'/>
            </Modal>
        </View>
    );
}
