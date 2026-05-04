import { StyleSheet, Platform, StatusBar } from "react-native";
import Colors from './../../theme/Colors'
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        marginTop: Platform.OS === 'android'
            ? StatusBar.currentHeight
            : 0,
    },

    header: {
        height: 60,
        backgroundColor: Colors.header,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },

    headerText: {
        color: 'white',
        fontSize: 22,
        fontWeight: '600',
        marginLeft: 12,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 14,
        marginBottom: 12,
        elevation: 3,
    },

    juzBadge: {
        height: 45,
        width: 45,
        borderRadius: 25,
        backgroundColor: Colors.header,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    juzNumber: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

    juzTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },

    arabicText: {
        fontSize: 34,
        color: '#000',
        marginTop: 4,
        fontFamily: 'QuranFonts',
        textAlign: 'right',
    },
});

