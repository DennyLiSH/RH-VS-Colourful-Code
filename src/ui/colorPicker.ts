import * as vscode from 'vscode';

interface ColorPickItem extends vscode.QuickPickItem {
  colorHex: string;
  isCustom?: boolean;
}

export class ColorPicker {
  // 预设颜色网格（色系分组，组内按亮度从深到浅排序）
  private static PRESET_COLORS: ColorPickItem[] = [
    // 🔴 红色系 (Dark → Light)
    { label: 'Maroon', colorHex: '#550027', description: '#550027' },
    { label: 'Dark Red', colorHex: '#8b1538', description: '#8b1538' },
    { label: 'Ruby', colorHex: '#9b111e', description: '#9b111e' },
    { label: 'Crimson', colorHex: '#c0392b', description: '#c0392b' },
    { label: 'Red', colorHex: '#e74c3c', description: '#e74c3c' },
    { label: 'Coral', colorHex: '#ff6b6b', description: '#ff6b6b' },
    { label: 'Soft Coral', colorHex: '#ff8a80', description: '#ff8a80' },

    // 🟠 橙色系 (Dark → Light)
    { label: 'Rust', colorHex: '#8b4513', description: '#8b4513' },
    { label: 'Burnt Orange', colorHex: '#cc5500', description: '#cc5500' },
    { label: 'Amber', colorHex: '#d35400', description: '#d35400' },
    { label: 'Orange', colorHex: '#e67e22', description: '#e67e22' },

    // 🟡 黄色系 (Dark → Light)
    { label: 'Mustard', colorHex: '#8b8000', description: '#8b8000' },
    { label: 'Gold', colorHex: '#9a7b0a', description: '#9a7b0a' },
    { label: 'Yellow', colorHex: '#f1c40f', description: '#f1c40f' },

    // 🟢 绿色系 (Dark → Light)
    { label: 'Forest', colorHex: '#1a4d1a', description: '#1a4d1a' },
    { label: 'Pine', colorHex: '#1b4d3e', description: '#1b4d3e' },
    { label: 'Emerald', colorHex: '#00a86b', description: '#00a86b' },
    { label: 'Green', colorHex: '#27ae60', description: '#27ae60' },
    { label: 'Lime', colorHex: '#32cd32', description: '#32cd32' },
    { label: 'Soft Mint', colorHex: '#b9f6ca', description: '#b9f6ca' },

    // 🩵 青色系 (Dark → Light)
    { label: 'Teal', colorHex: '#0d5c5c', description: '#0d5c5c' },
    { label: 'Cyan', colorHex: '#00bcd4', description: '#00bcd4' },
    { label: 'Electric Blue', colorHex: '#00d4ff', description: '#00d4ff' },
    { label: 'Soft Sky', colorHex: '#81d4fa', description: '#81d4fa' },

    // 🔵 蓝色系 (Dark → Light)
    { label: 'Navy', colorHex: '#1a252f', description: '#1a252f' },
    { label: 'Midnight', colorHex: '#191970', description: '#191970' },
    { label: 'Ocean', colorHex: '#1e3a5f', description: '#1e3a5f' },
    { label: 'Steel Blue', colorHex: '#4682b4', description: '#4682b4' },
    { label: 'Blue', colorHex: '#3498db', description: '#3498db' },

    // 🟣 紫色系 (Dark → Light)
    { label: 'Indigo', colorHex: '#4b0082', description: '#4b0082' },
    { label: 'Purple', colorHex: '#4a1a6b', description: '#4a1a6b' },
    { label: 'Grape', colorHex: '#6f2da8', description: '#6f2da8' },
    { label: 'Magenta', colorHex: '#8e44ad', description: '#8e44ad' },
    { label: 'Violet', colorHex: '#9b59b6', description: '#9b59b6' },
    { label: 'Lavender', colorHex: '#9683ec', description: '#9683ec' },

    // 🩷 粉色系 (Dark → Light)
    { label: 'Pink', colorHex: '#e91e63', description: '#e91e63' },
    { label: 'Hot Pink', colorHex: '#ff69b4', description: '#ff69b4' },

    // ⬜ 灰色系 (Dark → Light)
    { label: 'Charcoal', colorHex: '#36454f', description: '#36454f' },
    { label: 'Slate', colorHex: '#34495e', description: '#34495e' },
    { label: 'Gray', colorHex: '#7f8c8d', description: '#7f8c8d' },
  ];

  /**
   * 为颜色创建 SVG 图标
   */
  private static createColorIcon(colorHex: string): vscode.Uri {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${colorHex}" stroke="#666666" stroke-width="1"/>
    </svg>`;
    return vscode.Uri.parse(`data:image/svg+xml,${encodeURIComponent(svg)}`);
  }

  /**
   * 显示颜色选择器
   * @returns 选中的颜色 hex 值，或 undefined（用户取消）
   */
  static async show(): Promise<string | undefined> {
    const items: ColorPickItem[] = [
      ...this.PRESET_COLORS.map(c => ({
        ...c,
        label: c.label,
        detail: c.colorHex,
        iconPath: this.createColorIcon(c.colorHex)
      })),
      { label: '$(pencil) Enter Custom Hex...', colorHex: '', isCustom: true }
    ];

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Choose a colour for your workspace',
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (!selected) {
      return undefined;
    }

    if (selected.isCustom) {
      // 回退到输入框
      return await this.showHexInput();
    }

    return selected.colorHex;
  }

  /**
   * 显示 hex 颜色输入框
   */
  private static async showHexInput(): Promise<string | undefined> {
    return await vscode.window.showInputBox({
      prompt: 'Enter colour hex code',
      placeHolder: '#1e3a5f',
      validateInput: (value) => {
        if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
          return 'Please enter a valid hex colour (e.g., #1e3a5f)';
        }
        return undefined;
      }
    });
  }
}
