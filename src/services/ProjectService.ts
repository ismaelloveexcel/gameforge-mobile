import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, ProjectData } from '../types';
import { generateId } from '../utils/helpers';

/**
 * Project Management Service
 * Handles CRUD operations for game projects
 */
class ProjectService {
  private readonly STORAGE_KEY = 'gameforge_projects';

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<Project[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  /**
   * Get project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    const projects = await this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }

  /**
   * Create new project
   */
  async createProject(
    name: string,
    description: string,
    type: Project['type'],
    engine: Project['engine'],
    templateId?: string,
    artStyle?: Project['artStyle']
  ): Promise<Project> {
    const project: Project = {
      id: generateId(),
      name,
      description,
      type,
      engine,
      template: templateId,
      artStyle,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: this.getDefaultProjectData(),
    };

    const projects = await this.getAllProjects();
    projects.push(project);
    await this.saveProjects(projects);

    return project;
  }

  /**
   * Update project
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const projects = await this.getAllProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveProjects(projects);
    return projects[index];
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<boolean> {
    const projects = await this.getAllProjects();
    const filtered = projects.filter(p => p.id !== id);

    if (filtered.length === projects.length) return false;

    await this.saveProjects(filtered);
    return true;
  }

  /**
   * Duplicate project
   */
  async duplicateProject(id: string): Promise<Project | null> {
    const original = await this.getProject(id);
    if (!original) return null;

    const duplicate: Project = {
      ...original,
      id: generateId(),
      name: `${original.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const projects = await this.getAllProjects();
    projects.push(duplicate);
    await this.saveProjects(projects);

    return duplicate;
  }

  /**
   * Search projects
   */
  async searchProjects(query: string): Promise<Project[]> {
    const projects = await this.getAllProjects();
    const lowerQuery = query.toLowerCase();

    return projects.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get projects by type
   */
  async getProjectsByType(type: Project['type']): Promise<Project[]> {
    const projects = await this.getAllProjects();
    return projects.filter(p => p.type === type);
  }

  /**
   * Get recent projects
   */
  async getRecentProjects(limit: number = 5): Promise<Project[]> {
    const projects = await this.getAllProjects();
    return projects
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Export project as JSON
   */
  async exportProject(id: string): Promise<string | null> {
    const project = await this.getProject(id);
    if (!project) return null;

    return JSON.stringify(project, null, 2);
  }

  /**
   * Import project from JSON
   */
  async importProject(jsonData: string): Promise<Project | null> {
    try {
      const project: Project = JSON.parse(jsonData);
      project.id = generateId(); // Generate new ID
      project.createdAt = new Date();
      project.updatedAt = new Date();

      const projects = await this.getAllProjects();
      projects.push(project);
      await this.saveProjects(projects);

      return project;
    } catch (error) {
      console.error('Error importing project:', error);
      return null;
    }
  }

  /**
   * Get project statistics
   */
  async getStatistics() {
    const projects = await this.getAllProjects();

    return {
      total: projects.length,
      byType: {
        game: projects.filter(p => p.type === 'game').length,
        vr: projects.filter(p => p.type === 'vr').length,
        educational: projects.filter(p => p.type === 'educational').length,
      },
      byEngine: {
        pixi: projects.filter(p => p.engine === 'pixi').length,
        babylon: projects.filter(p => p.engine === 'babylon').length,
        aframe: projects.filter(p => p.engine === 'aframe').length,
      },
      recentlyModified: projects
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 5),
    };
  }

  /**
   * Save projects to storage
   */
  private async saveProjects(projects: Project[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
      throw error;
    }
  }

  /**
   * Get default project data structure
   */
  private getDefaultProjectData(): ProjectData {
    return {
      scenes: [{
        id: 'main',
        name: 'Main Scene',
        type: '2d',
        objects: [],
        background: '#1a1a2e',
      }],
      assets: [],
      scripts: [],
      settings: {
        resolution: { width: 1280, height: 720 },
        orientation: 'landscape',
      },
    };
  }

  /**
   * Clear all projects (use with caution)
   */
  async clearAllProjects(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }
}

export const projectService = new ProjectService();
