import { StyleSheet } from "react-native";
import Colors from './../../../theme/Colors'
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ddd',
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },

    email: {

        fontSize: 13,
        color: '#666',
        marginTop: 3,
    },

    divider: {
        height: 2,
        borderRadius: 100,
        backgroundColor: Colors.backgroundColor,
        marginVertical: 12,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },

    infoLabel: {
        color: '#777',
        fontSize: 13,
    },

    infoValue: {
        fontWeight: '600',
        color: '#333',
    },


    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },

    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
    actionBtn: {
        elevation: 3,
        borderWidth: 0.3,
        margin: 6,
        borderColor: Colors.secondary,
        backgroundColor: Colors.button,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 50

    },
    actionBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    scheduleBtn: {
        marginTop: 12,
        backgroundColor: Colors.backgroundColor,
        paddingVertical: 10,
        borderRadius: 30,
        alignItems: 'center',
    },

    scheduleBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 28,
        paddingVertical: 24,
        paddingHorizontal: 20,
        maxHeight: '85%',
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        color: '#222',
        marginLeft: 10,
        letterSpacing: 0.5,
    },

    dayBox: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#fafbff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#eef0f6',
    },

    dayTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },

    timeBadge: {
        backgroundColor: '#eef4ff',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 30,
        alignSelf: 'flex-start',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#d8e3ff',
    },

    timeText: {
        color: '#00620f',
        fontSize: 13,
        fontWeight: '600',
    },

    closeBtn: {
        marginTop: 20,
        backgroundColor: '#f1f3f5',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
    },

    closeText: {
        color: '#444',
        fontWeight: '600',
        fontSize: 14,
    },
});