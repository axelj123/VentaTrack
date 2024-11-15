import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const VentaFooter = ({ total, onCancelarVenta, onRegistrarVenta, subtotal, igv }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [animatedHeight] = useState(new Animated.Value(90)); // Cambiamos a useState para el valor inicial

    // Altura del footer cuando está expandido (ajusta según necesites)
    const EXPANDED_HEIGHT = 580;
    const COLLAPSED_HEIGHT = 80;

    useEffect(() => {
        Animated.spring(animatedHeight, {
            toValue: isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
            friction: 10,
            tension: 50,
            useNativeDriver: false,
        }).start();
    }, [isExpanded]);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
            <LinearGradient
                colors={['#1a1f36', '#2d1744']}
                style={styles.gradient}
            >
                {/* Barra de arrastre */}
                <Pressable onPress={toggleExpand} style={styles.dragBar}>
                    <View style={styles.dragIndicator} />
                </Pressable>

                {/* Vista Colapsada - Siempre visible */}
                <View style={styles.collapsedView}>
                    <View style={styles.collapsedTotal}>
                        <Text style={styles.collapsedTotalLabel}>Total:</Text>
                        <Text style={styles.collapsedTotalAmount}>S/ {total.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.collapsedButton}
                        onPress={onRegistrarVenta}
                    >
                        <Text style={styles.collapsedButtonText}>PAGAR</Text>
                    </TouchableOpacity>
                </View>

                {/* Vista Expandida */}
                <Animated.View 
                    style={[
                        styles.expandedContent,
                        { opacity: animatedHeight.interpolate({
                            inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
                            outputRange: [0, 1]
                        })}
                    ]}
                >
                    <View style={styles.totalWrapper}>
                        <Text style={styles.summaryTitle}>Resumen de Pago</Text>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Subtotal</Text>
                            <Text style={styles.detailValue}>S/ {subtotal || (total * 0.82).toFixed(2)}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>IGV (18%)</Text>
                            <Text style={styles.detailValue}>S/ {igv || (total * 0.18).toFixed(2)}</Text>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total a pagar:</Text>
                            <Text style={styles.totalAmount}>S/ {total.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={onRegistrarVenta}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="check-circle" size={24} color="#FFF" />
                            <Text style={styles.buttonText}>CONFIRMAR PAGO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancelarVenta}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="cancel" size={24} color="#FFF" />
                            <Text style={styles.buttonText}>CANCELAR</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.securityNote}>
                        <MaterialIcons name="security" size={16} color="#a0a0a0" />
                        <Text style={styles.securityText}>
                            Transacción segura y encriptada
                        </Text>
                    </View>
                </Animated.View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex:100000,
    },
    gradient: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    dragBar: {
        width: '100%',
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
    },
    collapsedView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    collapsedTotal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    collapsedTotalLabel: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    collapsedTotalAmount: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    collapsedButton: {
        backgroundColor: '#2ec4b6',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
    },
    collapsedButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    expandedContent: {
        padding: 20,
    },
    totalWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    summaryTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        color: '#e0e0e0',
        fontSize: 15,
    },
    detailValue: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginVertical: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    totalAmount: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
    buttonContainer: {
        gap: 12,
    },
    registerButton: {
        backgroundColor: '#2ec4b6',
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    cancelButton: {
        backgroundColor: '#e71d36',
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.8,
    },
    securityNote: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
    },
    securityText: {
        color: '#a0a0a0',
        fontSize: 13,
    },
});

export default VentaFooter;