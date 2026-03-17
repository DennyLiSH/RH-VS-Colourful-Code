/**
 * 颜色装饰配置
 * 用于 workbench.colorCustomizations
 */
export interface ColorDecorations {
  // 标题栏颜色
  'titleBar.activeBackground'?: string;
  'titleBar.activeForeground'?: string;
  'titleBar.inactiveBackground'?: string;
  'titleBar.inactiveForeground'?: string;

  // 活动栏颜色
  'activityBar.background'?: string;
  'activityBar.foreground'?: string;
  'activityBar.activeBorder'?: string;

  // 侧边栏颜色
  'sideBar.background'?: string;
  'sideBar.foreground'?: string;
  'sideBarTitle.foreground'?: string;

  // 状态栏颜色
  'statusBar.background'?: string;
  'statusBar.foreground'?: string;

  // 标签页颜色
  'tab.activeBackground'?: string;
  'tab.activeForeground'?: string;
  'tab.inactiveBackground'?: string;
  'tab.inactiveForeground'?: string;
  'tab.border'?: string;

  // 编辑器边框
  'editorGroup.border'?: string;
  'editorGroupHeader.tabsBackground'?: string;

  // 允许其他自定义颜色
  [key: string]: string | undefined;
}

/**
 * 完整的颜色方案
 */
export interface ColorScheme {
  /** 整体颜色主题 ID (如 "Default Dark+", "One Dark Pro") */
  colorTheme: string;

  /** 装饰色配置 */
  decorations: ColorDecorations;

  /** 方案名称 */
  name?: string;

  /** 创建时间 */
  createdAt?: number;

  /** 最后修改时间 */
  updatedAt?: number;
}

/**
 * 工作区文件夹的颜色方案映射
 */
export interface FolderThemeMapping {
  /** 文件夹路径（作为唯一标识） */
  folderPath: string;

  /** 文件夹名称（便于识别） */
  folderName: string;

  /** 关联的颜色方案 */
  colorScheme: ColorScheme;

  /** 是否启用 */
  enabled: boolean;

  /** 创建时间 */
  createdAt: number;

  /** 最后修改时间 */
  updatedAt: number;
}

/**
 * 全局配置存储结构
 */
export interface ExtensionConfig {
  /** 版本号，用于配置迁移 */
  version: string;

  /** 文件夹 -> 颜色方案的映射 */
  folderMappings: FolderThemeMapping[];

  /** 预设的颜色方案 */
  presetSchemes: PresetScheme[];

  /** 全局设置 */
  settings: ExtensionSettings;
}

/**
 * 预设方案
 */
export interface PresetScheme {
  id: string;
  name: string;
  colorScheme: ColorScheme;
}

/**
 * 扩展设置
 */
export interface ExtensionSettings {
  /** 是否启用自动切换 */
  autoSwitch: boolean;
}

/**
 * 可用的颜色主题信息
 */
export interface ThemeInfo {
  id: string;
  label: string;
  type: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
}
