import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface AddReviewModalProps {
  visible: boolean;
  onClose: () => void;
  placeId: string; 
  userId: string;  
  onSubmitSuccess: () => void;
}

export default function AddReviewModal({
  visible,
  onClose,
  placeId,
  userId,
  onSubmitSuccess,
}: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleStarPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    
    if (!rating || comment.trim() === '') {
      console.warn('Please provide both a rating and a comment.');
      return;
    }

    try {
      
      const payload = {
        userId: userId,   
        placeId: placeId, 
        rating,
        comment,
      };
      
      await axios.post(`http://${process.env.EXPO_PUBLIC_IPV4}:5000/api/reviews`, payload);
      
      setRating(0);
      setComment('');
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to add review:', err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
       
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>BACK</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Add Review</Text>

      
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity key={num} onPress={() => handleStarPress(num)}>
                <Ionicons
                  name={num <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color="tomato"
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

         
          <Text style={styles.label}>Add Comment:</Text>
          <TextInput
            style={styles.commentInput}
            multiline
            numberOfLines={4}
            placeholder="Type your review here..."
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
          />

        
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent backdrop
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  closeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#cfc3eb',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#704ecb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
