import { StyleSheet } from "react-native";
import Colors from "../../../theme/Colors";
export const externalStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#F8F9FA',
    },
    sectionContainer: {
        marginTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    badge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: '#1976D2',
        fontSize: 12,
        fontWeight: 'bold',
    },
    horizontalList: {
        paddingLeft: 15,
        paddingVertical: 10,
    },
    classCard: {
        width: '95%',
        margin: 10,
        backgroundColor: '#047d65',
        borderRadius: 12,
        padding: 15,
        marginRight: 15,
        elevation: 10,
    },
    classTypeLabel: {
        marginBottom: 10,
        color: '#fff',
        fontSize: 15,
        opacity: 0.8,
    },
    studentNameBold: {
        marginLeft: 15,
        color: '#fff',
        fontSize: 19,
        fontWeight: 'bold',
        marginTop: 5,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    whiteText: {
        color: '#fff',
        fontSize: 13,
    },
    lessonAndSurahText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        textAlign: 'left',
        fontFamily: 'QuranFonts'
    },

    statusBadge: {
        marginTop: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    emptyText: {
        color: '#999',
        marginLeft: 15,
    },
    statsContainer: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    subSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statBox: {
        width: '31%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        elevation: 2,
        borderBottomWidth: 3,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: '#888',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    studentListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 25,
        marginBottom: 10,
    },
    totalCountText: {
        color: '#666',
        fontSize: 14,
    },
    studentItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 12,
        elevation: 1,
    },
    studentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eee',
    },
    studentInfo: {
        marginLeft: 15,
        flex: 1,
    },
    studentNameText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#333',
    },
    studentLocationText: {
        color: '#888',
        fontSize: 12,
    },
    idBadge: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 20,
    },
    idText: {
        fontSize: 12,
    },
    centeredEmptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    listPadding: {
        paddingBottom: 20,
    },
    // Join Button
    joinButton: {
        marginTop: 14,
        backgroundColor: '#074f3f',
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    joinText: {
        color: '#fff',
        fontWeight: '700',
        marginLeft: 6,
    }, joinBtn: {
        margin: 10,
        backgroundColor: Colors.button,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinBtnDisabled: {
        margin: 10,
        backgroundColor: '#767373dd',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});