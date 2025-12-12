import * as vscode from 'vscode';

// 🔴 High Risk Style: Red Border + Glow
export const highRiskDecoration = vscode.window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'solid',
  overviewRulerColor: 'red',
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  light: {
    // Light Mode Theme
    borderColor: 'rgba(255, 0, 0, 1)',
    backgroundColor: 'rgba(255, 0, 0, 0.1)'
  },
  dark: {
    // Dark Mode Theme
    borderColor: 'rgba(255, 50, 50, 1)',
    backgroundColor: 'rgba(255, 0, 0, 0.2)'
  }
});

// 🟡 Low Risk Style: Yellow Warning
export const weakKeyDecoration = vscode.window.createTextEditorDecorationType({
  borderWidth: '1px',
  borderStyle: 'dashed', // Dashed border for warnings
  overviewRulerColor: 'yellow',
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  light: {
    borderColor: 'rgba(255, 165, 0, 1)',
    backgroundColor: 'rgba(255, 165, 0, 0.1)'
  },
  dark: {
    borderColor: 'rgba(255, 200, 0, 1)',
    backgroundColor: 'rgba(255, 200, 0, 0.2)'
  }
});