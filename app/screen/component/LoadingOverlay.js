import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingOverlay = ({ loading }) => {
  return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          
        </View>
    
      
  );
};

const styles = StyleSheet.create({
 
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '60%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
  },
});

export default LoadingOverlay;
