/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Image,
    Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../../theme/Colors';
import Loader from '../../../components/Loader';
import { useChildrens } from '../../../context/Childrens';
import { Image_URL } from '../../../../IpConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../../styles/Guardian/Stack/ChildrenAccountStyles';
export default function ChildAccounts({ navigation }) {
    const { childrenList, setSelectedChildID, setChildData } = useChildrens();
    const [loading, setLoading] = useState(false);

    const renderHeader = () => (
        <View style={styles.header}>
            <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
                <Icon name="chevron-back" size={28} color="#FFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Family Accounts</Text>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>No accounts added yet</Text>
            <Text style={styles.emptySubText}>Add your children to manage their activities.</Text>
        </View>
    );
    let navigateToGuardian = (item) => {
        console.log(item);
        setChildData(item);
        setSelectedChildID(item?.childrenID);
        navigation.replace('GuardianHomeDashboard')
    }

    const renderChildItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.card}
            onPress={() => { navigateToGuardian(item) }}
        >
            <View style={styles.cardContent}>
                <Image
                    source={{ uri: `${Image_URL}${item?.profile}` }}
                    style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.childName}>{item?.name || 'Unknown'}</Text>
                    <Text style={styles.childEmail} numberOfLines={1}>{item?.email}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#BBB" />
            </View>
        </TouchableOpacity>
    );

    if (loading) return <Loader message="Setting things up..." />;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.header} />
            {renderHeader()}

            <FlatList
                data={childrenList}
                renderItem={renderChildItem}
                keyExtractor={(item) => item.id?.toString() || item.email}
                contentContainerStyle={styles.listPadding}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => {
                        setLoading(true);
                        navigation.navigate('ChildSignUp');
                        setLoading(false);
                    }}
                    style={styles.primaryButton}
                >
                    <Icon name="add-circle" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Add Child Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
