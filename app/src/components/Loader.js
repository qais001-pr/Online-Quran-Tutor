import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const Loader = ({ message = "Loading..." }) => {
    return (
        <View style={styles.loaderContainer}>
            <View style={styles.loaderBox}>
                <ActivityIndicator size="large" />
                <Text style={styles.text}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    loaderBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
});

export default Loader;