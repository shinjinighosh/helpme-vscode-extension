// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { open } from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code from another extension again!');
    });
    let openBrowser = vscode.commands.registerCommand("helloworld.openBrowser", (url)=>{
        // vscode.window.showInformationMessage("openeeed!");
        // vscode.env.openExternal(Uri.parse(url));
        console.log("vscode:"+ vscode.Uri.parse(url));
        vscode.env.openExternal(vscode.Uri.parse(url));
    })
    function getQuestion(question: string){ //TODO: maybe point to stackoverflow instead? 
        let browserCompleter = new vscode.CompletionItem(question);
        browserCompleter.kind = vscode.CompletionItemKind.Event
        browserCompleter.command = {
            command: "helloworld.openBrowser",
            arguments: ["https://www.google.com/search?q="+question],
            title: "See it on the web...again?" // probably useless idk
        }
        return browserCompleter;
    }
    const provider1 = vscode.languages.registerCompletionItemProvider('plaintext', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            let all_questions = [ //TODO: find the right questions
                "What time is it?",
                "I am tired",
                "How much is 2+2?",
                "lol"
            ]
            return all_questions.map(question=>getQuestion(question))
		}
	}, "#");

	context.subscriptions.push(disposable, provider1, openBrowser);
}

// this method is called when your extension is deactivated
export function deactivate() {}
