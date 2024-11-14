import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Modal, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const FilterTabs = ({ onFilterChange,filteredSalesCount,totalSalesAmount }) => {
  const [selectedFilter, setSelectedFilter] = useState('Día');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [tempDateRange, setTempDateRange] = useState({ start: new Date(), end: new Date() });
  const [isStartDate, setIsStartDate] = useState(true);
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  const filters = [
    { id: 'Día', label: 'Hoy', subtitle: 'Últimas 24h' },
    { id: 'Semana', label: 'Semana', subtitle: '7 días' },
    { id: 'Mes', label: 'Mes', subtitle: '30 días' },
    { id: 'Personalizado', label: 'Rango', subtitle: 'Personalizado' }
  ];

  const handleFilterSelect = (filter, index) => {
    if (filter === 'Personalizado') {
      setShowDatePicker(true);
      setTempDateRange({ start: new Date(), end: new Date() });
    } else {
      Animated.spring(slideAnimation, {
        toValue: index * (windowWidth - 48) / 4,
        useNativeDriver: true,
        tension: 68,
        friction: 12
      }).start();

      setSelectedFilter(filter);
      onFilterChange(filter);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowAndroidPicker(false);
      return;
    }

    if (selectedDate) {
      if (isStartDate) {
        setTempDateRange(prev => ({ ...prev, start: selectedDate }));
        if (Platform.OS === 'android') {
          setIsStartDate(false);
          setShowAndroidPicker(false);
          // Pequeño delay antes de mostrar el selector de fecha final
          setTimeout(() => setShowAndroidPicker(true), 300);
        }
      } else {
        setTempDateRange(prev => ({ ...prev, end: selectedDate }));
        if (Platform.OS === 'android') {
          setShowAndroidPicker(false);
        }
      }
    }
  };

  const handleAndroidDateSelect = () => {
    setIsStartDate(true);
    setShowAndroidPicker(true);
  };

  const handleConfirm = () => {
    setDateRange(tempDateRange);
    setShowDatePicker(false);
    setShowAndroidPicker(false);
    setSelectedFilter('Personalizado');
    onFilterChange('Personalizado', { 
      startDate: tempDateRange.start, 
      endDate: tempDateRange.end 
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getSubtitle = (filter) => {
    if (filter === 'Personalizado' && dateRange.start && dateRange.end) {
      return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
    }
    return filters.find(f => f.id === filter)?.subtitle;
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'android') {
      return showAndroidPicker ? (
        <DateTimePicker
          value={isStartDate ? tempDateRange.start : tempDateRange.end}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={isStartDate ? undefined : tempDateRange.start}
        />
      ) : null;
    }

    return (
      <>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>Fecha inicial:</Text>
          <DateTimePicker
            value={tempDateRange.start}
            mode="date"
            display="inline"
            onChange={handleDateChange}
            maximumDate={new Date()}
            style={styles.datePicker}
          />
        </View>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>Fecha final:</Text>
          <DateTimePicker
            value={tempDateRange.end}
            mode="date"
            display="inline"
            onChange={handleDateChange}
            minimumDate={tempDateRange.start}
            maximumDate={new Date()}
            style={styles.datePicker}
          />
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Período</Text>
        <Text style={styles.salesCount}>{filteredSalesCount}</Text>
      </View>

      <View style={styles.filterContainer}>
        <Animated.View
          style={[
            styles.slider,
            {
              width: (windowWidth - 56) / 4,
              transform: [{ translateX: slideAnimation }],
            },
          ]}
        />
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              { width: (windowWidth - 48) / 4 }
            ]}
            onPress={() => handleFilterSelect(filter.id, index)}
          >
            <Text
              style={[
                styles.filterLabel,
                selectedFilter === filter.id && styles.activeFilterLabel,
              ]}
            >
              {filter.label}
            </Text>
            <Text style={styles.filterSubtitle}>
              {getSubtitle(filter.id)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowDatePicker(false);
          setShowAndroidPicker(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar rango de fechas</Text>
            
            {Platform.OS === 'ios' ? renderDatePicker() : (
              <View style={styles.androidDateDisplay}>
                <Text style={styles.dateDisplayText}>
                  Desde: {formatDate(tempDateRange.start)}
                </Text>
                <Text style={styles.dateDisplayText}>
                  Hasta: {formatDate(tempDateRange.end)}
                </Text>
                <TouchableOpacity
                  style={styles.androidDateButton}
                  onPress={handleAndroidDateSelect}
                >
                  <Text style={styles.androidDateButtonText}>Seleccionar fechas</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowDatePicker(false);
                  setShowAndroidPicker(false);
                }}
              >
                <Text style={[styles.buttonText, { color: '#666' }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {renderDatePicker()}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  salesCount: {
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    position: 'relative',
    height: 64,
  },
  slider: {
    position: 'absolute',
    height: 56,
    backgroundColor: 'white',
    borderRadius: 10,
    top: 4,
    left: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  activeFilterLabel: {
    color: '#6200EE',
  },
  filterSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#6200EE',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  datePicker: {
    backgroundColor: 'white',
    height: 120,
  },
  androidDateDisplay: {
    padding: 20,
    alignItems: 'center',
  },
  dateDisplayText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  androidDateButton: {
    backgroundColor: '#6200EE',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  androidDateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterTabs;
