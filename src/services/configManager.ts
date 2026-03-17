import * as vscode from 'vscode';
import { ExtensionConfig, FolderThemeMapping, PresetScheme, ExtensionSettings, ColorScheme } from '../models/types';

const CONFIG_KEY = 'colourfulCode.config';
const CURRENT_VERSION = '1.0.0';

// 默认预设方案
const DEFAULT_PRESETS: PresetScheme[] = [
  {
    id: 'preset-blue',
    name: 'Ocean Blue',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#1e3a5f',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#1e3a5f',
        'sideBar.background': '#152238',
        'statusBar.background': '#1e3a5f',
        'tab.activeBackground': '#2a4a6f',
        'tab.inactiveBackground': '#1e3a5f',
        'editorGroup.border': '#3a6a9f'
      }
    }
  },
  {
    id: 'preset-green',
    name: 'Forest Green',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#1a4d1a',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#1a4d1a',
        'sideBar.background': '#0f2e0f',
        'statusBar.background': '#1a4d1a',
        'tab.activeBackground': '#2a6d2a',
        'tab.inactiveBackground': '#1a4d1a',
        'editorGroup.border': '#3a8d3a'
      }
    }
  },
  {
    id: 'preset-purple',
    name: 'Royal Purple',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#4a1a6b',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#4a1a6b',
        'sideBar.background': '#2a0f3b',
        'statusBar.background': '#4a1a6b',
        'tab.activeBackground': '#6a3a8b',
        'tab.inactiveBackground': '#4a1a6b',
        'editorGroup.border': '#8a5aab'
      }
    }
  },
  {
    id: 'preset-orange',
    name: 'Sunset Orange',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#b35900',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#b35900',
        'sideBar.background': '#6b3500',
        'statusBar.background': '#b35900',
        'tab.activeBackground': '#d37a20',
        'tab.inactiveBackground': '#b35900',
        'editorGroup.border': '#f39c40'
      }
    }
  },
  {
    id: 'preset-red',
    name: 'Crimson Red',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#8b1538',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#8b1538',
        'sideBar.background': '#5a0d25',
        'statusBar.background': '#8b1538',
        'tab.activeBackground': '#a82850',
        'tab.inactiveBackground': '#8b1538',
        'editorGroup.border': '#c84068'
      }
    }
  },
  {
    id: 'preset-amber',
    name: 'Golden Amber',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#9a7b0a',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#9a7b0a',
        'sideBar.background': '#604d06',
        'statusBar.background': '#9a7b0a',
        'tab.activeBackground': '#b89a20',
        'tab.inactiveBackground': '#9a7b0a',
        'editorGroup.border': '#d4b840'
      }
    }
  },
  {
    id: 'preset-teal',
    name: 'Deep Teal',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#0d5c5c',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#0d5c5c',
        'sideBar.background': '#083838',
        'statusBar.background': '#0d5c5c',
        'tab.activeBackground': '#1a7a7a',
        'tab.inactiveBackground': '#0d5c5c',
        'editorGroup.border': '#2a9a9a'
      }
    }
  },
  {
    id: 'preset-slate',
    name: 'Slate Gray',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#36454f',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#36454f',
        'sideBar.background': '#2a353d',
        'statusBar.background': '#36454f',
        'tab.activeBackground': '#4a5a6a',
        'tab.inactiveBackground': '#36454f',
        'editorGroup.border': '#5a6a7a'
      }
    }
  },
  {
    id: 'preset-midnight',
    name: 'Midnight Blue',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#191970',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#191970',
        'sideBar.background': '#0f0f4a',
        'statusBar.background': '#191970',
        'tab.activeBackground': '#292990',
        'tab.inactiveBackground': '#191970',
        'editorGroup.border': '#3939a0'
      }
    }
  },
  {
    id: 'preset-jade',
    name: 'Jade Garden',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#00563f',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#00563f',
        'sideBar.background': '#003527',
        'statusBar.background': '#00563f',
        'tab.activeBackground': '#00765a',
        'tab.inactiveBackground': '#00563f',
        'editorGroup.border': '#009670'
      }
    }
  },
  {
    id: 'preset-grape',
    name: 'Grape Vine',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#6f2da8',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#6f2da8',
        'sideBar.background': '#4a1e72',
        'statusBar.background': '#6f2da8',
        'tab.activeBackground': '#8f4dc0',
        'tab.inactiveBackground': '#6f2da8',
        'editorGroup.border': '#af6de0'
      }
    }
  },
  {
    id: 'preset-ruby',
    name: 'Ruby Red',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#9b111e',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#9b111e',
        'sideBar.background': '#6a0b15',
        'statusBar.background': '#9b111e',
        'tab.activeBackground': '#bb3140',
        'tab.inactiveBackground': '#9b111e',
        'editorGroup.border': '#db5160'
      }
    }
  },
  {
    id: 'preset-burnt-sienna',
    name: 'Burnt Sienna',
    colorScheme: {
      colorTheme: 'Default Dark+',
      decorations: {
        'titleBar.activeBackground': '#cc5500',
        'titleBar.activeForeground': '#ffffff',
        'activityBar.background': '#cc5500',
        'sideBar.background': '#8a3a00',
        'statusBar.background': '#cc5500',
        'tab.activeBackground': '#e67520',
        'tab.inactiveBackground': '#cc5500',
        'editorGroup.border': '#ff9540'
      }
    }
  }
];

const DEFAULT_SETTINGS: ExtensionSettings = {
  autoSwitch: true
};

export class ConfigManager {
  private readonly context: vscode.ExtensionContext;
  private config: ExtensionConfig;
  private readonly onConfigChangeEmitter = new vscode.EventEmitter<ExtensionConfig>();

  public readonly onConfigChange = this.onConfigChangeEmitter.event;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.config = this.loadConfig();
  }

  /**
   * 加载配置
   */
  private loadConfig(): ExtensionConfig {
    const stored = this.context.globalState.get<ExtensionConfig>(CONFIG_KEY);

    if (!stored) {
      // 初始化默认配置
      const defaultConfig: ExtensionConfig = {
        version: CURRENT_VERSION,
        folderMappings: [],
        presetSchemes: DEFAULT_PRESETS,
        settings: DEFAULT_SETTINGS
      };
      this.saveConfig(defaultConfig);
      return defaultConfig;
    }

    // 合并新的预置颜色（不覆盖用户自定义）
    const existingIds = stored.presetSchemes.map(p => p.id);
    const newPresets = DEFAULT_PRESETS.filter(p => !existingIds.includes(p.id));

    if (newPresets.length > 0) {
      stored.presetSchemes = [...stored.presetSchemes, ...newPresets];
      this.saveConfig(stored);
    }

    // 检查是否需要迁移
    if (stored.version !== CURRENT_VERSION) {
      return this.migrateConfig(stored);
    }

    return stored;
  }

  /**
   * 保存配置
   */
  private async saveConfig(config: ExtensionConfig): Promise<void> {
    await this.context.globalState.update(CONFIG_KEY, config);
    this.config = config;
    this.onConfigChangeEmitter.fire(config);
  }

  /**
   * 配置迁移
   */
  private migrateConfig(oldConfig: ExtensionConfig): ExtensionConfig {
    const newConfig: ExtensionConfig = {
      ...oldConfig,
      version: CURRENT_VERSION
    };
    this.saveConfig(newConfig);
    return newConfig;
  }

  /**
   * 获取当前配置
   */
  getConfig(): ExtensionConfig {
    return this.config;
  }

  /**
   * 获取设置
   */
  getSettings(): ExtensionSettings {
    return this.config.settings;
  }

  /**
   * 更新设置
   */
  async updateSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    this.config.settings = { ...this.config.settings, ...settings };
    await this.saveConfig(this.config);
  }

  /**
   * 获取所有文件夹映射
   */
  getFolderMappings(): FolderThemeMapping[] {
    return this.config.folderMappings;
  }

  /**
   * 根据文件夹路径获取映射
   */
  getFolderMapping(folderPath: string): FolderThemeMapping | undefined {
    return this.config.folderMappings.find(m => m.folderPath === folderPath);
  }

  /**
   * 添加或更新文件夹映射
   */
  async setFolderMapping(mapping: Omit<FolderThemeMapping, 'createdAt' | 'updatedAt'>): Promise<void> {
    const now = Date.now();
    const existingIndex = this.config.folderMappings.findIndex(
      m => m.folderPath === mapping.folderPath
    );

    if (existingIndex >= 0) {
      // 更新现有映射
      this.config.folderMappings[existingIndex] = {
        ...this.config.folderMappings[existingIndex],
        ...mapping,
        updatedAt: now
      };
    } else {
      // 添加新映射
      this.config.folderMappings.push({
        ...mapping,
        createdAt: now,
        updatedAt: now
      });
    }

    await this.saveConfig(this.config);
  }

  /**
   * 移除文件夹映射
   */
  async removeFolderMapping(folderPath: string): Promise<boolean> {
    const initialLength = this.config.folderMappings.length;
    this.config.folderMappings = this.config.folderMappings.filter(
      m => m.folderPath !== folderPath
    );

    if (this.config.folderMappings.length < initialLength) {
      await this.saveConfig(this.config);
      return true;
    }
    return false;
  }

  /**
   * 获取预设方案
   */
  getPresetSchemes(): PresetScheme[] {
    return this.config.presetSchemes;
  }

  /**
   * 添加预设方案
   */
  async addPresetScheme(preset: PresetScheme): Promise<void> {
    this.config.presetSchemes.push(preset);
    await this.saveConfig(this.config);
  }

  /**
   * 启用/禁用文件夹映射
   */
  async toggleFolderMapping(folderPath: string, enabled: boolean): Promise<void> {
    const mapping = this.getFolderMapping(folderPath);
    if (mapping) {
      mapping.enabled = enabled;
      mapping.updatedAt = Date.now();
      await this.saveConfig(this.config);
    }
  }
}
