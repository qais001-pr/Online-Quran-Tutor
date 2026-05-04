/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '../context/auth'
import Colors from '../theme/Colors'
import { Image_URL } from '../../IpConfig'
import { useChildrens } from '../context/Childrens'
import { Dropdown } from 'react-native-element-dropdown'
import { useNavigation } from '@react-navigation/native'
export default function ChildrenHeader() {
    const navigation = useNavigation()
    const { user } = useAuth()
    const { childrenList, setChildData, selectedChildID, setSelectedChildID } = useChildrens()
    const selectedChild = childrenList?.find(
        c => c.childrenID === selectedChildID
    )

    return (
        <View style={{
            paddingHorizontal: 15,
            height: 60,
            backgroundColor: Colors.header,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>

            <View style={{ width: 200, marginRight: 10 }}>
                <Dropdown
                    data={childrenList}
                    labelField="name"
                    valueField="childrenID"
                    value={selectedChildID}
                    placeholder="Select Child"

                    style={{
                        borderRadius: 12,
                        paddingHorizontal: 10,
                        height: 50,

                    }}

                    selectedTextStyle={{
                        color: 'white',
                        fontSize: 14
                    }}

                    placeholderStyle={{
                        color: '#999'
                    }}

                    onChange={(item) => {
                        setSelectedChildID(item.childrenID)
                        setChildData(item)
                    }}

                    renderItem={(item) => (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 12
                        }}>
                            <Image
                                source={{ uri: `${Image_URL}${item.profile}` }}
                                style={{
                                    width: 35,
                                    height: 35,
                                    borderRadius: 18,
                                    marginRight: 10
                                }}
                            />
                            <Text style={{ fontSize: 14 }}>{item.name}</Text>
                        </View>
                    )}

                    renderLeftIcon={() => {
                        if (!selectedChild) return null;

                        return (
                            <Image
                                source={{ uri: `${Image_URL}${selectedChild.profile}` }}
                                style={{
                                    width: 35,
                                    height: 35,
                                    borderRadius: 18,
                                    marginRight: 8
                                }}
                            />
                        )
                    }}
                />
            </View>
            <Pressable style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                overflow: 'hidden',
                backgroundColor: Colors.border,
                justifyContent: 'center',
                alignItems: 'center'
            }}
                onPress={() => navigation.navigate('Profile')}
            >
                {
                    user?.profile ? (
                        <Image
                            source={{ uri: `${Image_URL}${user.profile}` }}
                            style={{ width: '100%', height: '100%', borderColor: Colors.secondary, borderWidth: 3, borderRadius: 100 }}

                        />
                    ) : (
                        <Text style={{ fontSize: 12 }}>No Image</Text>
                    )
                }
            </Pressable>

        </View>
    )
}