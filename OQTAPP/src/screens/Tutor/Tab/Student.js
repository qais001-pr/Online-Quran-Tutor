import React from 'react'
import { View } from 'react-native'
import Header from '../../../components/Header'
import { styles } from '../../../styles/Tutor/Tab/StudentStyle'
export default function Student() {
    return (
        <View style={styles.safeAreaView}>
            <Header />
            {/* <Text>Student</Text> */}
        </View>
    )
}

