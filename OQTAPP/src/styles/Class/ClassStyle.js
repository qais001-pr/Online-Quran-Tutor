import { Platform, StatusBar, StyleSheet } from "react-native";
import Colors from './../../theme/Colors'
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6FA",
    },

    header: {
        marginTop: Platform.OS === 'android' && StatusBar.currentHeight || 0,
        backgroundColor: Colors.header,
        paddingVertical: 15,
        paddingHorizontal: 10,
        elevation: 5,
    },

    surahName: {
        fontFamily:'QuranFonts',
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 5,
    },

    lessonTitle: {
        fontSize: 15,
        color: "#E0E7FF",
    },

    ayatCard: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
    },

    ayatNumberCircle: {
        backgroundColor: Colors.backgroundColor,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },

    ayatNumber: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 19,
    },

    ayatText: {
        fontSize: 35,
        textAlign: "right",
        lineHeight: 56,
        color: "#000000",
    },



    callActionButtonContainer: {
        bottom: 0,
        position: 'absolute',
        width: '100%',
        paddingBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: 'green',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 5,
    },
    buttonOff: {
        backgroundColor: '#555', // dimmed button when off
    },
    callButton: {
        backgroundColor: '#1DB954',
    },
    callActive: {
        backgroundColor: '#1DB954',
    },
    callInactive: {
        backgroundColor: '#E53935', // red when not active / hung up
    },
});