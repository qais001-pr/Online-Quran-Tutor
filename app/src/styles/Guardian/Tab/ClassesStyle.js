import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Modern light background
    },
    listHeader: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    titleText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1C1E',
    },
    subtitleText: {
        fontSize: 14,
        color: '#6C757D',
        marginTop: 2,
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        // Premium Shadow
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    tutorName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#212529',
    },
    lessonSubject: {
        fontSize: 13,
        color: '#6C757D',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    liveBadge: { backgroundColor: '#E8F5E9' },
    upcomingBadge: { backgroundColor: '#F8F9FA' },
    statusText: { fontSize: 10, fontWeight: '800' },
    liveText: { color: '#28A745' },
    upcomingText: { color: '#6C757D' },
    divider: {
        height: 1,
        backgroundColor: '#F1F3F5',
        marginVertical: 12,
    },
    cardFooter: {
        gap: 8,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    footerInfoText: {
        fontSize: 13,
        color: '#495057',
        fontWeight: '500',
    },
    joinBtn: {
        backgroundColor: '#327c53',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 5,
    },
    disabledBtn: {
        backgroundColor: '#E9ECEF',
    },
    joinBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    disabledBtnText: {
        color: '#ADB5BD',
    },
});