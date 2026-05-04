import { StyleSheet } from "react-native";
import Colors from './../../theme/Colors'
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    logoContainer: {
        flex: 1.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    actionsContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryText: {
        color: Colors.backgroundColor,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    secondaryText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
});