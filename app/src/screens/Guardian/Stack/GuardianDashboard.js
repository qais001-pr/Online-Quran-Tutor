/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../Tab/HomeScreen'
import Tutor from '../../Guardian/Tab/Tutor';
import Schedule from '../../Guardian/Tab/Schedule';
// import Classes from '../Tab/Classes'
import History from '../../Guardian/Tab/History';

import Colors from '../../../theme/Colors'
import { useChildrens } from '../../../context/Childrens';
import Loader from '../../../components/Loader';
const Tab = createBottomTabNavigator()
export default function GuardianDashboard() {
    const { fetchChildrens } = useChildrens()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchChildrens(setLoading)
    }, [fetchChildrens])

    if (loading) {
        return (
            <Loader message='Loading...' />
        )
    }
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.backgroundColor,
                    borderRadius: 10,
                    height: 80,
                    justifyContent: 'center',
                },

                tabBarActiveTintColor: '#00da41dd',
                tabBarInactiveTintColor: '#ffffffaa',

                tabBarLabelStyle: {
                    fontSize: 13,
                    marginBottom: 5
                },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline'
                    }
                    else if (route.name === 'AvailableTutorsScreen') {
                        iconName = focused ? 'people' : 'people-outline'
                    }
                    else if (route.name === 'Schedule') {
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    }
                    else if (route.name === 'HistoryChildren') {
                        iconName = focused ? 'time' : 'time-outline'
                    }
                    // else if (route.name === 'Classes') {
                    //     iconName = focused ? 'book' : 'book-outline'
                    // }

                    return (
                        <Icon
                            name={iconName}
                            size={focused ? 26 : 22}
                            color={color}
                        />
                    )
                }
            })}
        >

            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home'
                }}
            />

            <Tab.Screen
                name="Schedule"
                component={Schedule}
                options={{
                    tabBarLabel: 'Schedule'
                }}
            />
            <Tab.Screen
                name="AvailableTutorsScreen"
                component={Tutor}
                options={{
                    tabBarLabel: 'Tutors'
                }}
            />
            {/* <Tab.Screen
                name="Classes"
                component={Classes}
                options={{
                    tabBarLabel: 'Classes'
                }}
            /> */}

            <Tab.Screen
                name="HistoryChildren"
                component={History}
                options={{
                    tabBarLabel: 'History'
                }}
            />
        </Tab.Navigator>
    )
}