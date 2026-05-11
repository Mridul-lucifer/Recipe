import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const SettingRow = ({ label, value, onValueChange, isSwitch = true }: any) => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingVertical: 15, 
      borderBottomWidth: 1, 
      borderBottomColor: '#f0f0f0' 
    }}>
      <Text style={{ fontSize: 16, color: '#333' }}>{label}</Text>
      {isSwitch ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ false: '#ddd', true: '#4ecdc4' }}
        />
      ) : (
        <Text style={{ color: '#888' }}>v1.0.0</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Preferences</Text>
      
      <View style={{ backgroundColor: '#fdfdfd', borderRadius: 12, paddingHorizontal: 15 }}>
        <SettingRow 
          label="Dark Mode" 
          value={isDarkMode} 
          onValueChange={setIsDarkMode} 
        />
        <SettingRow 
          label="Push Notifications" 
          value={notifications} 
          onValueChange={setNotifications} 
        />
        <SettingRow label="App Version" isSwitch={false} />
      </View>

      <TouchableOpacity 
        style={{ 
          marginTop: 40, 
          padding: 15, 
          backgroundColor: '#f8f8f8', 
          borderRadius: 10, 
          alignItems: 'center' 
        }}
      >
        <Text style={{ color: '#ff6b6b', fontWeight: 'bold' }}>Clear Cache</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}