import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

const ModalConfirm = ({ visible, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalDeleteButton}
              onPress={onConfirm}
            >
              <Text style={styles.modalDeleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: 'black',
  },
  modalDeleteButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#B90909',
  },
  modalDeleteText: {
    fontSize: 16,
    color: 'white',
  },
};

export default ModalConfirm;
