
import { StyleSheet } from "react-native";
import Colors from './../../theme/Colors'
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 15,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 230,
        height: 230,
    },
    formContainer: {
        alignItems: 'center',
        gap: 15,
    },
    input: {
        width: '90%',
        height: 48,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 10,
        fontSize: 16,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    loginButton: {
        width: '90%',
        height: 50,
        backgroundColor: '#094936',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fafafa',
    },
    infoText: {
        fontSize: 18,
        color: '#000',
    },
    divider: {
        width: 300,
        height: 1,
        backgroundColor: '#ddd',
    },
    signupText: {
        fontSize: 21,
        color: '#ffffffdd',
        fontWeight: '300',
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 30,
        marginTop: 10,
    },
    roleButton: {
        backgroundColor: '#094936',
        height: 50,
        paddingHorizontal: 25,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roleText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#fafafa',
    },
});
