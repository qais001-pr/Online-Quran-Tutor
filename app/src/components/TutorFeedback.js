/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-element-dropdown';

export default function TutorFeedBack({ visible, onClose, onSubmit, lessonData }) {
    const [assignmentText, setAssignmentText] = useState('');
    const [correction, setCorrection] = useState('No Mistakes');
    const [startIndex, setStartIndex] = useState(null);
    const [endIndex, setEndIndex] = useState(null);
    const [badge, setBadge] = useState('Amazing');
    const [score, setScore] = useState(4);

    const handleSubmit = () => {
        if (!correction) {
            ToastAndroid.show('Correction is required', ToastAndroid.SHORT);
            return;
        }
        if (endIndex < startIndex) {
            ToastAndroid.show('', 4000)
            return
        }

        onSubmit({
            assignmentText,
            correction,
            startIndex,
            endIndex,
            badge,
            score
        });

        setAssignmentText('');
        setCorrection('');
        setStartIndex(null);
        setEndIndex(null);

        onClose();
    };

    const handleDiscard = () => {
        setAssignmentText('');
        setCorrection('');
        setStartIndex(null);
        setEndIndex(null);
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Class Summary</Text>
                            <TouchableOpacity onPress={handleDiscard}>
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Assignment */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Assignment (Optional)</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Revise Surah Al-Fatiha ayats 1-5"
                                multiline
                                value={assignmentText}
                                onChangeText={setAssignmentText}
                            />
                        </View>
                        {/* Correction */}
                        {/* <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Correction</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter mistakes count (e.g. 10)"
                                keyboardType="numeric"
                                value={correction}
                                onChangeText={setCorrection}
                            />
                        </View> */}
                        <View style={{ padding: 5, }}>

                            <Text style={{ fontSize: 15, fontWeight: '800' }}>Select Badge</Text>

                        </View>
                        <View style={{ flexDirection: 'row', margin: 3, justifyContent: 'space-between' }}>

                            <TouchableOpacity
                                onPress={() => {
                                    setScore(4)
                                    setBadge('Amazing')
                                    setCorrection('No Mistakes')
                                }}
                                style={{
                                    backgroundColor:
                                        badge === 'Amazing' ? '#c2b7b7' : '#088a53', padding: 9, borderRadius: 3
                                }}
                            >
                                <Text style={{ fontSize: 13, color: 'white' }}>Amazing</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setScore(3)
                                    setBadge('Good')
                                    setCorrection('Mistakes Below 5')
                                }}
                                style={{
                                    backgroundColor:
                                        badge === 'Good' ? '#c2b7b7' : '#088a53', padding: 9, borderRadius: 3
                                }}
                            >
                                <Text style={{ fontSize: 13, color: 'white' }}>Good</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setScore(2)
                                    setBadge('Satisfactory')
                                    setCorrection('Mistakes Between 5 and 10')
                                }}
                                style={{
                                    backgroundColor:
                                        badge === 'Satisfactory' ? '#c2b7b7' : '#088a53', padding: 9, borderRadius: 3
                                }}
                            >
                                <Text style={{ fontSize: 13, color: 'white' }}>Satisfactory</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => {
                                    setScore(1)
                                    setBadge('Need Improvement')
                                    setCorrection('Mistakes Above 10')
                                }}
                                style={{
                                    backgroundColor:
                                        badge === 'Need Improvement' ? '#c2b7b7' : '#088a53', padding: 9, borderRadius: 3
                                }}
                            >
                                <Text style={{ fontSize: 13, color: 'white' }}>Improvement</Text>
                            </TouchableOpacity>


                        </View>

                        {/* Ayat Range */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Select Ayat Range</Text>

                            <Dropdown
                                style={styles.dropdown}
                                data={lessonData}
                                placeholder="Start Ayat"
                                labelField="AyahText"
                                valueField="VerseID"
                                value={startIndex}
                                onChange={(item) => setStartIndex(item.VerseID)}
                                maxHeight={300}
                            />

                            <Dropdown
                                style={styles.dropdown}
                                data={lessonData}
                                placeholder="End Ayat"
                                labelField="AyahText"
                                valueField="VerseID"
                                value={endIndex}
                                onChange={(item) => setEndIndex(item.VerseID)}
                                maxHeight={300}
                            />
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.btn, styles.discardBtn]}
                                onPress={handleDiscard}
                            >
                                <Text style={styles.discardText}>Discard</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btn, styles.submitBtn]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    section: {
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#334155',
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 14,
        backgroundColor: '#F9FAFB',
    },
    textArea: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 12,
        textAlignVertical: 'top',
        backgroundColor: '#F9FAFB',
    },
    dropdown: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 8,
        backgroundColor: '#F9FAFB',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
    },
    btn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    discardBtn: {
        backgroundColor: '#E5E7EB',
        marginRight: 8,
    },
    submitBtn: {
        backgroundColor: '#2563EB',
        marginLeft: 8,
    },
    discardText: {
        color: '#374151',
        fontWeight: '600',
    },
    submitText: {
        color: '#FFF',
        fontWeight: '600',
    },
});