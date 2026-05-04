import { StatusBar, StyleSheet, Platform } from "react-native";
import Colors from '../../../theme/Colors'
export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f2f4f7',
        marginTop: Platform.OS === 'android' && StatusBar.currentHeight || 0
    },

    loader: {
        opacity: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* HEADER */
    header: {
        backgroundColor: Colors.backgroundColor,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerTitle: {
        flex: 1,
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        marginRight: 35,
    },

    backBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },

    backText: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },

    /* TOP PROFILE */
    topSection: {
        backgroundColor: Colors.header,
        alignItems: 'center',
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    avatar: {
        width: 140,
        height: 140,
        borderRadius: 80,
        backgroundColor: '#eee',
        marginTop: 20,
        marginBottom: 12,
        borderWidth: 4,
        borderColor: 'white',
    },

    noImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
    },

    location: {
        color: '#e3efff',
        marginTop: 5,
    },

    /* CARD */
    card: {
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop: 18,
        padding: 18,
        borderRadius: 18,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222',
    },

    about: {
        color: '#555',
        lineHeight: 22,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
    },

    infoLabel: {
        color: '#666',
    },
    /* SUBJECTS */

    subjectContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },

    subjectChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eef4ff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },

    subjectText: {
        color: Colors.header,
        fontWeight: '600',
        fontSize: 13,
    },

    infoValue: {
        fontWeight: '600',
        color: '#222',
    },
});
