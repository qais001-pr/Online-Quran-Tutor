
const CELL_HEIGHT = 26;
const DAY_COLUMN_WIDTH = 50;
const TIME_COLUMN_WIDTH = 55;
import { StyleSheet } from "react-native";
import Colors from '../../../theme/Colors'
export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    headerBar: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: Colors.header || '#6200ee',
        elevation: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerImage: {
        justifyContent: 'center',
        backgroundColor: Colors.secondary,
        width: 50,
        height: 50,
        borderRadius: 100,
        margin: 10,
        alignItems: 'center'
    },
    gridContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    columnHeader: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    headerLabelText: {
        fontWeight: 'bold',
        color: '#888',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    dayHeaderText: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 14,
    },
    /* Time Column */
    timeCell: {
        height: CELL_HEIGHT,
        width: TIME_COLUMN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    timeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#444',
    },
    timeTextSub: {
        fontSize: 11,
        color: '#999',
    },
    /* Day Columns */
    dayColumn: {
        width: DAY_COLUMN_WIDTH,
    },
    checkboxCell: {
        height: CELL_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        borderRightWidth: 1,
        borderRightColor: '#f0f0f0',
    }
});