import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerPadding: {
        padding: 20,
        // borderBottomColor: '#dddf',
        // borderBottomWidth: 5,
        marginBottom: 10,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1C1E',
    },
    subtitle: {
        fontSize: 14,
        color: '#6C757D',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        // Shadow for Android
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 12, // Modern rounded squares instead of circles
        backgroundColor: '#EEE',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    tutorName: {
        fontSize: 16,
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
        paddingHorizontal: 8,
        paddingVertical: 4,
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
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 6,
        fontSize: 13,
        color: '#495057',
        fontWeight: '500',
    },
    joinBtn: {
        backgroundColor: '#37905f',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
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