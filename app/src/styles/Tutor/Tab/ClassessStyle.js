import { StyleSheet } from "react-native"
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerPadding: {
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1C1E',
    },
    subtitle: {
        fontSize: 14,
        color: '#6C757D',
        marginTop: 2,
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#F0F0F0',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    studentName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#212529',
    },
    subjectText: {
        fontSize: 13,
        color: '#6C757D',
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    liveBadge: { backgroundColor: '#E8F5E9' },
    scheduledBadge: { backgroundColor: '#F8F9FA' },
    dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    liveDot: { backgroundColor: '#28A745' },
    scheduledDot: { backgroundColor: '#ADB5BD' },
    statusText: { fontSize: 11, fontWeight: '700' },
    liveText: { color: '#28A745' },
    scheduledText: { color: '#6C757D' },
    detailsContainer: {
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 8,
        fontSize: 13,
        color: '#495057',
        fontWeight: '500',
    },
    joinBtn: {
        backgroundColor: '#28A745', // Green for Tutor to start class
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 10,
    },
    joinBtnDisabled: {
        backgroundColor: '#E9ECEF',
    },
    joinBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    joinBtnTextDisabled: {
        color: '#ADB5BD',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 15,
    }
});