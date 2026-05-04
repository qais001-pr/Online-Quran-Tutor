/* eslint-disable react/no-unstable-nested-components */
import React from 'react'

import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../../theme/Colors';


import HomeDashboard from '../Tab/HomeDashboard';
// import Classes from '../Tab/Classes';
import History from '../Tab/History';
import Schedule from '../Tab/Schedule';
import Request from '../Tab/Requests'




import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
const Tab = createBottomTabNavigator()
export default function TutorDashboard() {
    return (
        <Tab.Navigator initialRouteName='Home'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    borderColor: 'black',
                    backgroundColor: Colors.backgroundColor,
                    borderRadius: 10,
                    height: 90,
                    maxHeight: 110,
                    justifyContent: 'center',
                },
                tabBarIcon: ({ focused, size, color }) => {
                    let iconName

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline'
                    }
                    if (route.name === 'TutorStudent') {
                        iconName = focused ? 'people' : 'people-outline'
                    }

                    if (route.name === 'TutorSchedule') {
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    }
                    if (route.name === 'TutorRequest') {
                        iconName = focused ? 'person-add' : 'person-add-outline'
                    }


                    if (route.name === 'TutorClasses') {
                        iconName = focused ? 'book' : 'book-outline'
                    }

                    if (route.name === 'TutorHistory') {
                        iconName = focused ? 'time' : 'time-outline'
                    }

                    return <Icon name={iconName} size={focused ? 25 : 20} color={focused ? '#00da41dd' : '#ffffffdd'} />
                }
            })}

        >
            <Tab.Screen name='Home' component={HomeDashboard} options={{
                tabBarLabel: 'Home',
                tabBarLabelStyle: { fontSize: 15, color: '#ffffff' }
            }} />
            {/* <Tab.Screen name='TutorStudent' component={Student}
                options={{
                    tabBarLabel: 'Student',
                    tabBarLabelStyle: { fontSize: 15, color: '#ffffff' }
                }} /> */}
            <Tab.Screen name='TutorSchedule' component={Schedule}
                options={{
                    tabBarLabel: 'Schedule',
                    tabBarLabelStyle: { fontSize: 15, color: '#ffffff' }
                }} />

            <Tab.Screen name='TutorRequest' component={Request}
                options={{
                    tabBarLabel: 'Requests',
                    tabBarLabelStyle: { fontSize: 15, color: '#ffffff' }
                }} />

            {/* <Tab.Screen name='TutorClasses' component={Classes}
                options={{
                    tabBarLabel: 'Classes',
                    tabBarLabelStyle: { fontSize: 15, color: '#ffffff' }
                }} /> */}
            <Tab.Screen name='TutorHistory' component={History}
                options={{
                    tabBarLabel: 'History',
                    tabBarLabelStyle: { fontSize: 15, color: '#ffffff' }
                }} />



        </Tab.Navigator>
    )
}