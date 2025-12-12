import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function vaultSecret(document: vscode.TextDocument, range: vscode.Range) {
    // 1. Get the Raw Secret Text (e.g. sk_live_123)
    const secretValue = document.getText(range);
    
    // 2. Find the Variable Name (Reverse Search)
    const lineText = document.lineAt(range.start.line).text;
    const match = lineText.match(/(?:const|let|var|api_key|token|secret)\s+([a-zA-Z0-9_]+)\s*[:=]\s*/);
    
    if (!match) {
        vscode.window.showErrorMessage("Could not detect variable name. Please select the full assignment.");
        return;
    }

    const varName = match[1];
    const envKey = varName.toUpperCase(); // Convert "apiKey" -> "API_KEY"

    // 3. Locate the .env file
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) { 
        vscode.window.showErrorMessage("Please open a folder (Workspace) to use the Vault.");
        return; 
    }
    
    const rootPath = workspaceFolders[0].uri.fsPath;
    const envPath = path.join(rootPath, '.env');

    // 4. Read or Create .env
    let envContent = "";
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    } else {
        fs.writeFileSync(envPath, "# Security Vault created by Entropy Sentinel\n");
    }

    // 5. Check for Duplicates
    if (envContent.includes(`${envKey}=`)) {
        const answer = await vscode.window.showWarningMessage(
            `Key '${envKey}' already exists in .env. Do you want to overwrite it?`,
            "Overwrite", "Cancel"
        );
        if (answer !== "Overwrite") { return; }
    }

    // 6. Append to .env (New Line)
    const newEntry = `\n${envKey}="${secretValue}"`;
    fs.appendFileSync(envPath, newEntry);

    // 7. Refactor the Code (The Magic Trick)
    const edit = new vscode.WorkspaceEdit();
    
    // Expand range to capture quotes around the string
    const quoteRange = new vscode.Range(
        range.start.translate(0, -1),
        range.end.translate(0, 1)
    );
    
    edit.replace(document.uri, quoteRange, `process.env.${envKey}`);
    
    await vscode.workspace.applyEdit(edit);
    
    // Success Toast
    vscode.window.showInformationMessage(`🔒 Vaulted ${envKey} to .env!`);
}