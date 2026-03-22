import * as vscode from 'vscode';
import { ConfigManager } from '../services/configManager';
import { ThemeService } from '../services/themeService';

export class ListFolderThemesCommand {
  constructor(
    private configManager: ConfigManager,
    private themeService: ThemeService
  ) {}

  async execute(): Promise<void> {
    const mappings = this.configManager.getFolderMappings();

    if (mappings.length === 0) {
      vscode.window.showInformationMessage('No folder theme mappings configured.');
      return;
    }

    const presets = this.configManager.getPresetSchemes();

    const items = mappings.map(m => {
      const primaryColor = m.colorScheme.decorations['titleBar.activeBackground'] || '';

      // 检查是否匹配预设方案
      const matchedPreset = presets.find(p =>
        p.colorScheme.decorations['titleBar.activeBackground'] === primaryColor
      );

      // 构建描述：Hex + 预设名称（如果匹配）
      const description = matchedPreset
        ? `${primaryColor} ${matchedPreset.name}`
        : primaryColor;

      return {
        label: `${m.enabled ? '$(check)' : '$(circle-slash)'} ${m.folderName}`,
        description,
        detail: m.folderPath,
        mapping: m
      };
    });

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Configured folder theme mappings',
      matchOnDescription: true,
      matchOnDetail: true
    });

    if (selected) {
      // 提供操作选项
      const actions = [
        { label: '$(play) Apply Now', action: 'apply' },
        { label: selected.mapping.enabled ? '$(circle-slash) Disable' : '$(check) Enable', action: 'toggle' },
        { label: '$(trash) Remove', action: 'remove' }
      ];

      const action = await vscode.window.showQuickPick(actions, {
        placeHolder: `Actions for "${selected.mapping.folderName}"`
      });

      if (action) {
        switch (action.action) {
          case 'toggle':
            await this.configManager.toggleFolderMapping(
              selected.mapping.folderPath,
              !selected.mapping.enabled
            );
            vscode.window.showInformationMessage(
              `${selected.mapping.folderName} ${selected.mapping.enabled ? 'disabled' : 'enabled'}`
            );
            break;
          case 'remove':
            const confirm = await vscode.window.showWarningMessage(
              `Remove color scheme for "${selected.mapping.folderName}"?`,
              'Yes', 'No'
            );
            if (confirm === 'Yes') {
              await this.configManager.removeFolderMapping(selected.mapping.folderPath);
              vscode.window.showInformationMessage(
                `Color scheme removed for "${selected.mapping.folderName}"`
              );
            }
            break;
          case 'apply':
            await this.themeService.applyColorScheme(selected.mapping.colorScheme, true);
            vscode.window.showInformationMessage(
              `Applied color scheme for "${selected.mapping.folderName}"`
            );
            break;
        }
      }
    }
  }
}
