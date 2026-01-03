import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Project } from '../types';

export default function ProjectListScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [projects] = useState<Project[]>([]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>My Projects</Text>
      {projects.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="folder-open-outline" size={64} color={theme.colors.text + '40'} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No projects yet
          </Text>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Templates')}
          >
            <Text style={styles.createButtonText}>Create Your First Project</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.projectCard, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.projectName, { color: theme.colors.text }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, marginTop: 16, marginBottom: 24 },
  createButton: { padding: 16, borderRadius: 8 },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  projectCard: { padding: 16, borderRadius: 8, marginBottom: 12 },
  projectName: { fontSize: 16, fontWeight: '600' },
});
