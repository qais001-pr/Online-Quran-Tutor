import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function StudentReviewModal({ visible, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleStarPress = (index) => {
        setRating(index + 1);
    };

    const handleSubmit = () => {
        if (rating === 0) {
            return;
        }
        onSubmit({ rating, comment });
        setRating(0); // Reset for next time
        setComment('');
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header & Close Button */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Rate Student Performance</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Star Rating Section */}
                    <View style={styles.starSection}>
                        {[...Array(5)].map((_, index) => (
                            <Pressable key={index} onPress={() => handleStarPress(index)}>
                                <Icon
                                    name={index < rating ? 'star' : 'star-border'}
                                    size={40}
                                    color={index < rating ? '#FFD700' : '#BDC3C7'}
                                />
                            </Pressable>
                        ))}
                        <Text style={styles.ratingLabel}>{rating} / 5 Stars</Text>
                    </View>

                    {/* Review Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Write a comment (optional)..."
                        multiline
                        numberOfLines={4}
                        value={comment}
                        onChangeText={setComment}
                    />

                    {/* Action Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.discardButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.discardText}>Discard</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.submitButton]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitText}>Submit Review</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    starSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    ratingLabel: {
        width: '100%',
        textAlign: 'center',
        marginTop: 10,
        color: '#7f8c8d',
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
        color: '#333',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    discardButton: {
        backgroundColor: '#f2f2f2',
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        marginLeft: 10,
    },
    discardText: {
        color: '#666',
        fontWeight: 'bold',
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
    },
});