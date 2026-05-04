

import { StyleSheet } from "react-native";
import Colors from './../../../theme/Colors'
// STYLES
export const styles = StyleSheet.create({

    safeAreaView: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },

    listContainer: {
        padding: 14,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },


    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: '#eee',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    infoSection: {
        flex: 1,
        marginLeft: 14,
    },

    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },

    location: {
        color: '#777',
        fontSize: 14,
        marginTop: 4,
    },

    hireBtn: {
        backgroundColor: Colors.header,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 30,
    },

    hireText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },

    subjectContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 14,
        gap: 8,
    },

    subjectChip: {
        backgroundColor: '#f1f5ff',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 20,
    },

    subjectText: {
        color: '#3b4cca',
        fontWeight: '500',
        fontSize: 13,
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#5f5d5d',
        fontSize: 16,
    },

    loadingOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    hireSheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '60%',
        paddingHorizontal: 20,
        paddingTop: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    modalIndicator: {
        width: 45,
        height: 5,
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 15,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2D3436',
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#A0A0A0',
        marginTop: 2,
    },
    closeBtn: {
        backgroundColor: '#F5F5F5',
        padding: 8,
        borderRadius: 20,
    },
    surahItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedItem: {
        backgroundColor: '#FFF5F5',
        borderColor: '#c92727',
    },
    surahNumber: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    surahNumberText: {
        color: '#636E72',
        fontWeight: '700',
        fontSize: 14,
    },
    surahName: {
        flex: 1,
        fontSize: 14,
        color: '#2D3436',
        fontWeight: '700',
    },
    arabicName: {
        fontSize: 23,
        fontWeight: '700',
        color: '#5004ff',
        fontFamily: 'JameelNoori',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    sendBtn: {
        backgroundColor: Colors.header || '#c92727',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#c92727',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledBtn: {
        backgroundColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },
    sendText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
