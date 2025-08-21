import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ToolPreference {
  id: string;
  isOwned: boolean;
  isWishlisted: boolean;
  addedToWishlistAt?: Date;
  markedAsOwnedAt?: Date;
  notes?: string;
}

export interface MaterialPreference {
  id: string;
  isOwned: boolean;
  isWishlisted: boolean;
  addedToWishlistAt?: Date;
  markedAsOwnedAt?: Date;
  notes?: string;
  quantity?: number;
  unit?: string;
}

class ToolMaterialService {
  private readonly TOOL_PREFERENCES_KEY = 'tool_preferences';
  private readonly MATERIAL_PREFERENCES_KEY = 'material_preferences';

  // Tool preferences
  async getToolPreferences(): Promise<ToolPreference[]> {
    try {
      const data = await AsyncStorage.getItem(this.TOOL_PREFERENCES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tool preferences:', error);
      return [];
    }
  }

  async saveToolPreferences(preferences: ToolPreference[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TOOL_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving tool preferences:', error);
    }
  }

  async updateToolPreference(toolId: string, updates: Partial<ToolPreference>): Promise<void> {
    try {
      const preferences = await this.getToolPreferences();
      const existingIndex = preferences.findIndex(p => p.id === toolId);
      
      if (existingIndex >= 0) {
        preferences[existingIndex] = { ...preferences[existingIndex], ...updates };
      } else {
        preferences.push({
          id: toolId,
          isOwned: false,
          isWishlisted: false,
          ...updates
        });
      }
      
      await this.saveToolPreferences(preferences);
    } catch (error) {
      console.error('Error updating tool preference:', error);
    }
  }

  async toggleToolOwned(toolId: string): Promise<boolean> {
    try {
      const preferences = await this.getToolPreferences();
      const existing = preferences.find(p => p.id === toolId);
      const isOwned = existing ? !existing.isOwned : true;
      
      await this.updateToolPreference(toolId, {
        isOwned,
        markedAsOwnedAt: isOwned ? new Date() : undefined
      });
      
      return isOwned;
    } catch (error) {
      console.error('Error toggling tool owned status:', error);
      return false;
    }
  }

  async toggleToolWishlist(toolId: string): Promise<boolean> {
    try {
      const preferences = await this.getToolPreferences();
      const existing = preferences.find(p => p.id === toolId);
      const isWishlisted = existing ? !existing.isWishlisted : true;
      
      await this.updateToolPreference(toolId, {
        isWishlisted,
        addedToWishlistAt: isWishlisted ? new Date() : undefined
      });
      
      return isWishlisted;
    } catch (error) {
      console.error('Error toggling tool wishlist status:', error);
      return false;
    }
  }

  // Material preferences
  async getMaterialPreferences(): Promise<MaterialPreference[]> {
    try {
      const data = await AsyncStorage.getItem(this.MATERIAL_PREFERENCES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading material preferences:', error);
      return [];
    }
  }

  async saveMaterialPreferences(preferences: MaterialPreference[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.MATERIAL_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving material preferences:', error);
    }
  }

  async updateMaterialPreference(materialId: string, updates: Partial<MaterialPreference>): Promise<void> {
    try {
      const preferences = await this.getMaterialPreferences();
      const existingIndex = preferences.findIndex(p => p.id === materialId);
      
      if (existingIndex >= 0) {
        preferences[existingIndex] = { ...preferences[existingIndex], ...updates };
      } else {
        preferences.push({
          id: materialId,
          isOwned: false,
          isWishlisted: false,
          ...updates
        });
      }
      
      await this.saveMaterialPreferences(preferences);
    } catch (error) {
      console.error('Error updating material preference:', error);
    }
  }

  async toggleMaterialOwned(materialId: string): Promise<boolean> {
    try {
      const preferences = await this.getMaterialPreferences();
      const existing = preferences.find(p => p.id === materialId);
      const isOwned = existing ? !existing.isOwned : true;
      
      await this.updateMaterialPreference(materialId, {
        isOwned,
        markedAsOwnedAt: isOwned ? new Date() : undefined
      });
      
      return isOwned;
    } catch (error) {
      console.error('Error toggling material owned status:', error);
      return false;
    }
  }

  async toggleMaterialWishlist(materialId: string): Promise<boolean> {
    try {
      const preferences = await this.getMaterialPreferences();
      const existing = preferences.find(p => p.id === materialId);
      const isWishlisted = existing ? !existing.isWishlisted : true;
      
      await this.updateMaterialPreference(materialId, {
        isWishlisted,
        addedToWishlistAt: isWishlisted ? new Date() : undefined
      });
      
      return isWishlisted;
    } catch (error) {
      console.error('Error toggling material wishlist status:', error);
      return false;
    }
  }

  // Utility methods
  async getOwnedTools(): Promise<string[]> {
    const preferences = await this.getToolPreferences();
    return preferences.filter(p => p.isOwned).map(p => p.id);
  }

  async getWishlistedTools(): Promise<string[]> {
    const preferences = await this.getToolPreferences();
    return preferences.filter(p => p.isWishlisted).map(p => p.id);
  }

  async getOwnedMaterials(): Promise<string[]> {
    const preferences = await this.getMaterialPreferences();
    return preferences.filter(p => p.isOwned).map(p => p.id);
  }

  async getWishlistedMaterials(): Promise<string[]> {
    const preferences = await this.getMaterialPreferences();
    return preferences.filter(p => p.isWishlisted).map(p => p.id);
  }

  // Clear all preferences (useful for testing or reset)
  async clearAllPreferences(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.TOOL_PREFERENCES_KEY,
        this.MATERIAL_PREFERENCES_KEY
      ]);
    } catch (error) {
      console.error('Error clearing preferences:', error);
    }
  }
}

export const toolMaterialService = new ToolMaterialService();
