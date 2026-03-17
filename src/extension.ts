import * as vscode from 'vscode';
import { ConfigManager } from './services/configManager';
import { ThemeService } from './services/themeService';
import { FolderDetectionService } from './services/folderDetectionService';
import { SetFolderThemeCommand } from './commands/setFolderTheme';
import { RemoveFolderThemeCommand } from './commands/removeFolderTheme';
import { ListFolderThemesCommand } from './commands/listFolderThemes';

export async function activate(context: vscode.ExtensionContext) {
  console.log('ColourfulCode extension is activating...');

  // 初始化服务
  const configManager = new ConfigManager(context);
  const themeService = ThemeService.getInstance();
  themeService.saveOriginalTheme();  // 保存用户原始主题
  const folderDetectionService = new FolderDetectionService(configManager, themeService);

  // 初始化命令
  const setFolderThemeCmd = new SetFolderThemeCommand(configManager, themeService);
  const removeFolderThemeCmd = new RemoveFolderThemeCommand(configManager, themeService);
  const listFolderThemesCmd = new ListFolderThemesCommand(configManager, themeService);

  // 注册命令
  const commands: vscode.Disposable[] = [
    vscode.commands.registerCommand(
      'colourfulCode.setFolderTheme',
      () => setFolderThemeCmd.execute()
    ),
    vscode.commands.registerCommand(
      'colourfulCode.removeFolderTheme',
      () => removeFolderThemeCmd.execute()
    ),
    vscode.commands.registerCommand(
      'colourfulCode.listFolderThemes',
      () => listFolderThemesCmd.execute()
    ),
    vscode.commands.registerCommand(
      'colourfulCode.resetTheme',
      async () => {
        await themeService.resetToDefault();
        vscode.window.showInformationMessage('Theme reset to default');
      }
    ),
    vscode.commands.registerCommand(
      'colourfulCode.toggleAutoSwitch',
      async () => {
        const settings = configManager.getSettings();
        await configManager.updateSettings({ autoSwitch: !settings.autoSwitch });
        vscode.window.showInformationMessage(
          `Auto-switch ${!settings.autoSwitch ? 'enabled' : 'disabled'}`
        );
      }
    )
  ];

  // 启动文件夹检测服务
  folderDetectionService.initialize();

  // 添加到订阅
  context.subscriptions.push(...commands, folderDetectionService);

  // 首次使用引导：如果没有配置任何文件夹映射，提示用户配置
  const mappings = configManager.getFolderMappings();
  if (mappings.length === 0 && vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    const result = await vscode.window.showInformationMessage(
      'ColourfulCode: Would you like to set a color for this workspace to distinguish it from others?',
      'Set Color',
      'Later'
    );
    if (result === 'Set Color') {
      vscode.commands.executeCommand('colourfulCode.setFolderTheme');
    }
  }

  console.log('ColourfulCode extension activated successfully!');
}

export async function deactivate(): Promise<void> {
  console.log('ColourfulCode extension deactivating...');

  // 重置颜色配置（恢复到用户原始主题）
  await ThemeService.getInstance().resetToDefault();

  // 清除单例
  ThemeService.resetInstance();

  console.log('ColourfulCode extension deactivated');
}
