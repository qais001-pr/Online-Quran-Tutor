/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Checkbox, Portal, Provider } from 'react-native-paper';
import { Base_URL } from '../../../IpConfig';
import { useAuth } from '../../context/auth';
import { styles } from '../../styles/Authentication/LoginScreenStyle'
import Loader from '../../components/Loader';
export default function LoginScreen({ navigation }) {
  const { login, loginUserwithoutremember } = useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const [rememberme, setRememberme] = useState(false);


  const onlogin = async () => {
    if (!email || !password) {
      Platform.OS === "android" &&
        ToastAndroid.show("Please fill all the fields!", 4000);
      return;
    }

    try {
      setloading(true);

      const response = await fetch(
        `${Base_URL}auth/login?email=${email}&password=${password}`,
        { method: "POST" }
      );
      console.log(response);
      const json = await response.json();

      if (!response.ok || json?.statusCode === 401) {
        Platform.OS === "android" &&
          ToastAndroid.show(
            json.message || "Invalid Email or Password!",
            4000
          );
        return;
      }

      const userdata = json?.user;

      if (!userdata) {
        ToastAndroid.show("Login failed!", 4000);
        return;
      }

      Platform.OS === "android" &&
        ToastAndroid.show("Login successful.", 4000);

      if (rememberme) {
        await login(userdata);
      } else {
        loginUserwithoutremember(userdata);
      }

      const route =
        userdata.userType === "Child" || userdata.userType === "Student"
          ? "StudentDashboard"
          : `${userdata.userType}Dashboard`;

      navigation.replace(route);
    } catch (error) {
      console.log("Login error:", error);
      ToastAndroid.show("Server Error!", 4000);
    } finally {
      setloading(false);
    }
  };

  return (
    <Provider>

      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/splash.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#000"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#000"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15, justifyContent: 'flex-start' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox status={rememberme ? 'checked' : 'unchecked'}
                    onPress={() => setRememberme(!rememberme)}
                    color='#03693f'
                    uncheckedColor='#ddd'
                  />
                  <Text style={{ fontSize: 15, fontWeight: '400', color: '#ddd' }}>Remember Me</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onlogin}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ValidateEmail')}>
                <Text style={[styles.infoText, { color: 'white' }]}>Forgot your Password?</Text>
              </TouchableOpacity>

              <Text style={styles.infoText}>Don't have an account?</Text>

              <View style={styles.divider} />

              <View>
                <Text style={styles.signupText}>Sign Up</Text>
              </View>

              {/* Role Selection */}
              <View style={styles.roleContainer}>
                <TouchableOpacity style={styles.roleButton} onPress={() => navigation.navigate('StudentSignup')}>
                  <Text style={styles.roleText}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.roleButton} onPress={() => navigation.navigate('TutorSignup')}>
                  <Text style={styles.roleText}>Tutor</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Portal>
          <Modal transparent visible={loading} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Loader message='Loading ...' />
          </Modal>
        </Portal>
      </View>
    </Provider >

  );
}