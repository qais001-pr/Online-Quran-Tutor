import { StyleSheet, Platform, StatusBar } from "react-native";
import Colors from '../../../theme/Colors'
export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#f3f5f7',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.header,
        height: 60,
        paddingHorizontal: 10,
    },

    headerText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 22,
        marginLeft: 12,
    },

    profileCard: {
        alignItems: 'center',
        margin: 15,
        borderRadius: 15,
        padding: 25,
    },

    profileImage: {
        height: 140,
        width: 140,
        borderRadius: 70,
        marginBottom: 10,
    },

    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
    },

    subText: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },

    infoCard: {
        marginHorizontal: 15,
        borderRadius: 15,
        padding: 15,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
    },

    label: {
        fontSize: 13,
        color: '#888',
    },

    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
});
