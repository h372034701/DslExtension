/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import * as fs from 'fs';


import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;
let snippets;

export function activate(context: ExtensionContext) {
	const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();
	const value = config.get("typescript.tsc.autoDetect");
	// const snippetsPath : string = config.get("skill_dsl_snippets_path");
	const snippetsPath = "F:\\work\\vscode-extension-samples\\dslExtension\\client\\src\\xx.json";
	if (snippetsPath != undefined && snippetsPath != null && fs.existsSync(snippetsPath))
	{
		snippets = JSON.parse(fs.readFileSync(snippetsPath, "utf-8"));
		if (snippets.xx != undefined)
			console.log(snippets["xx"]);
	}
	console.log(value);
	vscode.languages.registerHoverProvider("plaintext", {
		provideHover(document, position, token) {
			console.log(document.fileName);
			const word = document.getText(document.getWordRangeAtPosition(position));
			console.log(word);
			return new vscode.Hover('I am a hover!');
		}
	});
	vscode.languages.registerCompletionItemProvider("plaintext", {
		provideCompletionItems(document: vscode.TextDocument, position, token, context) {
			const word = document.getText(document.getWordRangeAtPosition(position));
			if (word)
			{
				console.log(word);
			}
			const xx = new vscode.CompletionItem("findmovetotarget", vscode.CompletionItemKind.Method);
			xx.insertText = "findmovetotarget($1,$2)";
			xx.documentation = "doc \n doc";
			return [
				xx,
			];
		}
	});

	vscode.workspace.asRelativePath;

	context.subscriptions.push(vscode.commands.registerCommand('dsl.update', () => {
		vscode.window.showInformationMessage("fff");
	}));

	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'plaintext' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
