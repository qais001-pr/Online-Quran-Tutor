import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


// Screens
import SplashScreen from '../Splash/SplashScreen';

// Authentication
import ChildSignUpScreen from '../Authentication/ChildSignUpScreen';
import SignupScreenStudent from '../Authentication/StudentSignupScreen'
import SignupScreenTutor from '../Authentication/TutorSignupScreen'
import LoginScreen from "../Authentication/LoginScreen";
import StudentDashboard from "../Student/Stack/StudentDashboard";
import ValidateEmail from "../Authentication/ValidateEmail";
import UpdatePassword from "../Authentication/UpdatePassword";

// Student Portal
import ProfileScreen from '../Student/Stack/ProfileScreen';
import PersonalInfoStudent from '../Student/Stack/PersonalInfo';
import TutorProfile from '../Student/Stack/TutorProfile'

// Tutor Portal
import TutorDashboard from "../Tutor/Stack/TutorDashboard";

// Guardian Portal
import GuardianDashboard from '../Guardian/Stack/GuardianDashboard';
import ChildAccounts from '../Guardian/Stack/ChildAccounts'

// Quran
import Juz from '../Quran/Juz';
import JuzDisplay from '../Quran/JuzDisplay'
import Surahs from '../Quran/Surahs'
import Qurans from '../Quran/Qurans'
import SurahsDisplay from '../Quran/SurahsDisplay'
// Classes 
import Class from '../Class/Class';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createStackNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
            >
                {/* Authentication Screens */}
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="ChildSignUp" component={ChildSignUpScreen} />
                <Stack.Screen name="StudentSignup" component={SignupScreenStudent} />
                <Stack.Screen name="TutorSignup" component={SignupScreenTutor} />
                <Stack.Screen name="ValidateEmail" component={ValidateEmail} />
                <Stack.Screen name="UpdatePassword" component={UpdatePassword} />

                {/* Tab Screen Dashboard */}
                <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
                <Stack.Screen name="TutorDashboard" component={TutorDashboard} />


                {/* Student Screen */}
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="PersonalInfo" component={PersonalInfoStudent} />
                <Stack.Screen name="TutorProfile" component={TutorProfile} />
                {/* Guardian Dashboard */}
                <Stack.Screen name="GuardianDashboard" component={GuardianDashboard} />
                <Stack.Screen name="ChildrenAccounts" component={ChildAccounts} />


                {/* Quran */}
                <Stack.Screen name="Juz" component={Juz} />
                <Stack.Screen name="JuzDisplay" component={JuzDisplay} />
                <Stack.Screen name="Surahs" component={Surahs} />
                <Stack.Screen name="Qurans" component={Qurans} />
                <Stack.Screen name="SurahsDisplay" component={SurahsDisplay} />

                {/* Classes */}
                <Stack.Screen name="Class" component={Class} />


            </Stack.Navigator>
        </NavigationContainer>
    );
}


