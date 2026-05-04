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
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        padding: 16,
        // Shadow
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    tutorSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EEE',
    },
    tutorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    completed: { backgroundColor: '#E8F5E9' },
    missed: { backgroundColor: '#FFEBEE' },
    statusText: { fontSize: 11, fontWeight: '800' },
    completedText: { color: '#2E7D32' },
    missedText: { color: '#C62828' },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    detailsSection: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
    },
    assignmentContainer: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
    },
    assignmentLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#888',
        marginBottom: 2,
    },
    assignmentText: {
        fontSize: 13,
        color: '#444',
        lineHeight: 18,
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