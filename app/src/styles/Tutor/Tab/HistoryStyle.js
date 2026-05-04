import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerPadding: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1C1E',
    },
    statsText: {
        fontSize: 14,
        color: '#6C757D',
        marginTop: 4,
        fontWeight: '600',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        gap: 10,
    },
    datePickerBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 45,
        borderRadius: 12,
        paddingHorizontal: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
    },
    dateText: {
        marginLeft: 8,
        fontSize: 13,
        color: '#495057',
        fontWeight: '600',
    },
    dropdown: {
        flex: 1,
        backgroundColor: '#FFF',
        height: 45,
        borderRadius: 12,
        paddingHorizontal: 12,
        elevation: 2,
    },
    dropdownPlaceholder: { fontSize: 13, color: '#ADB5BD' },
    dropdownSelected: { fontSize: 13, fontWeight: '600', color: '#37905f' },
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
    emptyState: {
        alignItems: 'center',
        marginTop: 80,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
    }
});