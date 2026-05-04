import { StyleSheet } from "react-native"
import Colors from './../../../theme/Colors'

export const style = StyleSheet.create({
    headerContainer: {
        backgroundColor: Colors.backgroundColor,
        paddingHorizontal: 20,
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32,
    },

    // Profile Section Styles
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },

    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: Colors.border || 'rgba(255, 255, 255, 0.3)',
        marginRight: 16,
        elevation: 8,
    },

    profileInfo: {
        flex: 1,
        justifyContent: 'center',
    },

    greetingText: {
        fontSize: 15,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: 0.5,
    },

    nameText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },

    locationContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },

    locationText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },

    // Progress Section Styles
    progressContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        marginBottom: 16,
    },

    progressHeader: {
        marginBottom: 18,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    },

    progressTitle: {
        fontFamily: 'QuranFonts',
        fontSize: 28,
        color: Colors.backgroundColor,
        marginBottom: 2,
    },

    progressSubtitle: {
        fontSize: 22,
        color: Colors.backgroundColor,
        fontWeight: '600',
        alignSelf: 'center',
    },

    progressBars: {
        gap: 14,
    },

    progressItem: {
        gap: 6,
    },

    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    progressLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a1a1a',
    },

    progressPercent: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.backgroundColor,
    },

    progressBarBackground: {
        height: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
        overflow: 'hidden',
    },

    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.backgroundColor,
        borderRadius: 3,
    },

    // ✅ NEW: Stats Row
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        flexWrap: 'wrap',
        gap: 6,
    },

    statText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#444',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    // ✅ NEW: Status Badge
    statusBadge: {
        alignSelf: 'flex-end',
        marginTop: 10,
        backgroundColor: '#fff3cd',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
    },

    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#856404',
        textTransform: 'capitalize',
    },

    // Existing Buttons
    button: {
        backgroundColor: Colors.button,
        height: 100,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        margin: 10,
        elevation: 5
    },

    buttonText: {
        fontSize: 18,
        fontWeight: '300',
        color: 'white'
    },
    // ✅ Grid Layout
    statsGrid: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    // ✅ Individual Box
    statBox: {
        width: '20%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: 10,
        elevation: 10,
        alignItems: 'center',
    },

    // ✅ Number
    statNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginTop: 4,
    },

    // ✅ Label
    statLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    // Header Row
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    // Improved Card
    upcomingCard: {
        width: '92%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        elevation: 10,
    },

    upcomingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.backgroundColor,
    },

    // Row Layout
    upcomingRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    // Image
    instructorImage: {
        width: 55,
        height: 55,
        borderRadius: 30,
        marginRight: 12,
    },

    // Name
    instructorName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },

    // Info Row (icon + text)
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },

    lessonText: {
        fontSize: 15,
        color: '#444',
        marginLeft: 6,
    },

    urduText: {
        fontSize: 19,
        color: '#2e7d32',
        marginTop: 3,
        fontFamily: 'QuranFonts'
    },

    dateText: {
        fontSize: 11,
        color: '#666',
        marginLeft: 6,
    },

    // Status Badge
    statusBadgeCard: {
        backgroundColor: '#fff3cd',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    statusTextCard: {
        fontSize: 11,
        fontWeight: '700',
        color: '#856404',
        textTransform: 'capitalize',
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
        backgroundColor: Colors.button,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 15,
        margin:10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinBtnDisabled: {
        backgroundColor: 'rgb(186, 192, 192)',
        marginTop: 14,
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },


    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 80,
        // Elevation (Android)
        elevation: 5,
    },

    iconContainer: {
        width: 25,
        height: 25,
        borderRadius: 30,
        backgroundColor: '#4CAF50', // You can replace with your theme color
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },

    subtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 3,
    },
})