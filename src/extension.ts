import * as vscode from 'vscode';
import { scanText, debounce } from './analysis/scanner';
import { highRiskDecoration, weakKeyDecoration } from './ui/decorations';
import { vaultSecret } from './system/vault';

export function activate(context: vscode.ExtensionContext) {
    console.log('🛡️ Entropy Sentinel: Production System Active');

    // 1. Create the Diagnostic Collection (The "Problem" List)
    // This adds the "Red Squiggly" line under secrets.
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('entropy-sentinel');
    context.subscriptions.push(diagnosticCollection);

    let activeEditor = vscode.window.activeTextEditor;

    // 2. The Core Scan Logic
    function triggerUpdate() {
        if (!activeEditor) { return; }

        const doc = activeEditor.document;
        const filename = doc.fileName;

        // PRIVACY & PERFORMANCE GUARD
        // Don't scan git folders, env files, or huge minified files
        if (filename.includes('.git') || filename.includes('.env') || filename.endsWith('.min.js')) {
            return;
        }

        const text = doc.getText();
        const results = scanText(text);

        const highRiskRanges: vscode.DecorationOptions[] = [];
        const weakKeyRanges: vscode.DecorationOptions[] = [];
        const diagnostics: vscode.Diagnostic[] = [];

        results.forEach(result => {
            const startPos = doc.positionAt(result.range[0]);
            const endPos = doc.positionAt(result.range[1]);
            const range = new vscode.Range(startPos, endPos);

            // A. Visuals (The Red/Yellow Box)
            const decoration = { range, hoverMessage: result.message };
            
            if (result.type === 'HIGH_ENTROPY') {
                highRiskRanges.push(decoration);
                
                // B. Diagnostics (The Squiggly Line + Lightbulb Trigger)
                // We only create diagnostics for High Entropy secrets we want to vault
                const diagnostic = new vscode.Diagnostic(
                    range, 
                    result.message, 
                    vscode.DiagnosticSeverity.Error
                );
                diagnostic.source = 'Entropy Sentinel';
                diagnostic.code = 'HIGH_ENTROPY_SECRET';
                diagnostics.push(diagnostic);

            } else {
                weakKeyRanges.push(decoration);
            }
        });

        // Apply Visual Paint
        activeEditor.setDecorations(highRiskDecoration, highRiskRanges);
        activeEditor.setDecorations(weakKeyDecoration, weakKeyRanges);

        // Apply Problems (This summons the Lightbulb!)
        diagnosticCollection.set(doc.uri, diagnostics);
    }

    // 3. Performance: Create a Debounced Version
    // Wait 500ms after the last keystroke before scanning
    const debouncedScan = debounce(triggerUpdate, 500);

    if (activeEditor) { triggerUpdate(); }

    // --- EVENT LISTENERS ---

    // A. Switch Tabs -> Scan Immediately (No delay needed)
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) { triggerUpdate(); }
    }, null, context.subscriptions);

    // B. Type Code -> Scan with Debounce (Wait 500ms)
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            debouncedScan();
        }
    }, null, context.subscriptions);

    // --- COMMANDS ---
    context.subscriptions.push(
        vscode.commands.registerCommand('entropy-sentinel.vaultSecret', async (document: vscode.TextDocument, range: vscode.Range) => {
            await vaultSecret(document, range);
        })
    );

    // --- ACTION PROVIDER ---
    // Registers the Lightbulb logic for JS and TS files
    const supportedLangs = [
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', language: 'typescript' },
        { scheme: 'file', language: 'javascriptreact' }, // JSX
        { scheme: 'file', language: 'typescriptreact' }  // TSX
    ];

    supportedLangs.forEach(selector => {
        context.subscriptions.push(
            vscode.languages.registerCodeActionsProvider(
                selector,
                new SecretVaultActionProvider(),
                { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
            )
        );
    });
}

// THE FIXER CLASS
// Tells VS Code: "If you see a High Entropy error, offer to Vault it."
export class SecretVaultActionProvider implements vscode.CodeActionProvider {
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext
    ): vscode.CodeAction[] {
        
        // Filter for ONLY our specific diagnostics
        const entropyDiagnostics = context.diagnostics.filter(d => d.source === 'Entropy Sentinel');

        if (entropyDiagnostics.length === 0) { return []; }

        const actions: vscode.CodeAction[] = [];

        for (const diagnostic of entropyDiagnostics) {
            // Create the "Quick Fix" button
            const action = new vscode.CodeAction('🔒 Move to .env (Secure Vault)', vscode.CodeActionKind.QuickFix);
            
            // Critical: Link the action to the diagnostic so VS Code knows they are related
            action.diagnostics = [diagnostic];
            action.isPreferred = true; // Makes it the default (Blue Star) action

            action.command = {
                command: 'entropy-sentinel.vaultSecret',
                title: 'Move to .env',
                arguments: [document, diagnostic.range] // Pass the exact location
            };

            actions.push(action);
        }

        return actions;
    }
}

export function deactivate() {}