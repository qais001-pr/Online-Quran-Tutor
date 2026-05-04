import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    filterSection: {
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    filterControls: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
    },
    datePickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        flex: 0.45,
    },
    datePickerLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
    dropdown: {
        flex: 0.5,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    card: {
        backgroundColor: '#FFF',
        padding: 14,
        marginVertical: 8,
        marginHorizontal: 12,
        borderRadius: 12,

        // Shadow (iOS)
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },

        // Elevation (Android)
        elevation: 3,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EEE',
    },

    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },

    sub: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },

    status: {
        fontSize: 11,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        overflow: 'hidden',
    },

    completed: {
        backgroundColor: '#E6F4EA',
        color: '#2E7D32',
    },

    pending: {
        backgroundColor: '#FFF4E5',
        color: '#EF6C00',
    },

    defaultStatus: {
        backgroundColor: '#EEE',
        color: '#555',
    },

    text: {
        fontSize: 13,
        color: '#444',
        marginTop: 4,
    },

    note: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 15,
    }
});