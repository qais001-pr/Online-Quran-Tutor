import { StyleSheet } from "react-native";
import Colors from './../../../theme/Colors';

export const style = StyleSheet.create({

    /* ================= HEADER ================= */
    headerContainer: {
        backgroundColor: Colors.backgroundColor,
        paddingHorizontal: 20,
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32,
    },

    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },

    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        marginRight: 14,
    },

    profileInfo: { flex: 1 },

    greetingText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },

    nameText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },

    locationText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
    },

    /* ================= PROGRESS ================= */
    progressContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        elevation: 3,
        marginBottom: 16,
    },

    progressTitle: {
        fontFamily: 'QuranFonts',
        fontSize: 24,
        color: Colors.backgroundColor,
    },

    progressSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.backgroundColor,
    },

    progressBarBackground: {
        height: 6,
        backgroundColor: '#eee',
        borderRadius: 3,
        marginTop: 8,
        overflow: 'hidden',
    },

    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.backgroundColor,
    },

    /* ================= UPCOMING CARD ================= */
    upcomingCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },

    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },

    pending: {
        backgroundColor: '#FFF3E0',
    },

    defaultBadge: {
        backgroundColor: '#EEE',
    },

    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#E65100',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#EEE',
    },

    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
    },

    sub: {
        fontSize: 12,
        color: '#777',
    },

    surah: {
        fontSize: 16,
        fontWeight: '600',
        color: '#097343',
        marginBottom: 8,
        fontFamily: 'QuranFonts',
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },

    infoText: {
        fontSize: 13,
        color: '#555',
    },

    /* ================= BUTTON ================= */
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.button,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
        gap: 6,
    },

    btnDisabled: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BDBDBD',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
    },

    btnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },

    /* ================= QURAN CARDS ================= */
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 80,
        elevation: 3,
    },

    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
    },
});