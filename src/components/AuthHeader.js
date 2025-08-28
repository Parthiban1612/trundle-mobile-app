import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AuthHeader = ({ title, subtitle }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    color: '#f3eaff',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default AuthHeader; 