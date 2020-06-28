// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { open } from 'fs';
import path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello VS Code from another extension again!');
    // });
    let showBox = vscode.commands.registerCommand("helloworld.showBox", ()=>{
        showMessageBox();
    });

    const fileDir = context.globalStoragePath;
    console.log(fileDir);

    var fs = require('fs');
    if (!fs.existsSync(fileDir)){
    fs.mkdirSync(fileDir);
    }

    function updateJSON(question: any, url: any){
        const fullPath = path.join(fileDir, 'question_map.json');

        let newQuestion = {
            display_name: "What time is it with python",
            link:  "https://www.google.com/search?q=What time is it with python",
            keywords: [
                "time", 
                "question"
            ]
        };

        let newData = JSON.stringify(newQuestion);

        fs.readFile(fullPath, function (err: any, data: string) {
            console.log("got into readfile");
            if (err){ 
                console.log("did not find file");
                let fullData = newData;
                console.log(fullData);
                fs.writeFile(fullPath, fullData, function(err: any) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("The new file was saved!");
                    }
            }); 
            }
            else {
                var json = JSON.parse(data);
                json.push(newData);
                let fullData = JSON.stringify(json);
                console.log(fullData);
                fs.writeFile(fullPath, fullData, function(err: any) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("The file was appended to and saved!");
                    }
            });
            // fs.writeFile("results.json", JSON.stringify(json))
            }
        });
        
        // let student = { 
        //     name: 'Mike',
        //     age: 23, 
        //     gender: 'Male',
        //     department: 'English',
        //     car: 'Honda' 
        // };
         
        // let data = JSON.stringify(student);

        // fs.writeFile(fullPath, newData, function(err: any) {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log("The file was saved!");
        //     }
        // });
        console.log("Should have written to globalStorage");
        return true;
    }

    function showMessageBox(){
        let questionInputBox = vscode.window.createInputBox();
        questionInputBox.busy = true;
        questionInputBox.placeholder = "Put it here!";
        questionInputBox.title = "What question do you want to add?";
        questionInputBox.onDidAccept(()=>{
            let question = questionInputBox.value;
            questionInputBox.hide();

            let linkInputBox= vscode.window.createInputBox();
            linkInputBox.title = "What was the link you used?";
            linkInputBox.placeholder = "Put it also here!";
            linkInputBox.onDidAccept(()=>{
                console.log("question: "  + question);
                console.log("link used: " + linkInputBox.value);
                updateJSON(question, linkInputBox.value);
                linkInputBox.hide();
            });
            linkInputBox.ignoreFocusOut = true; //so that when it goes 
            linkInputBox.show();
        });
        questionInputBox.ignoreFocusOut = true;
        questionInputBox.show();
    }
    // vscode.commands.
    let openBrowser = vscode.commands.registerCommand("helloworld.openBrowser", (url)=>{
        // vscode.window.showInformationMessage("openeeed");
        // vscode.env.openExternal(Uri.parse(url));
        console.log("vscode:"+ vscode.Uri.parse(url));
        vscode.env.openExternal(vscode.Uri.parse(url));
        
        showMessageBox();
    });
    function getQuestion(question: string, link: string){ //TODO: maybe point to stackoverflow instead? 
        let browserCompleter = new vscode.CompletionItem(question);
        browserCompleter.kind = vscode.CompletionItemKind.Event;
        browserCompleter.command = {
            command: "helloworld.openBrowser",
            arguments: [link],
            title: "See it on the web...again?" // probably useless idk
        };
        return browserCompleter;
    }
    const hack = vscode.languages.registerCompletionItemProvider('plaintext', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            let completion = new vscode.CompletionItem("Add a question!");
            completion.kind = vscode.CompletionItemKind.Event
            completion.command = {
                command: "helloworld.showBox",
                // arguments: [link],
                title: "See it on the web...again?" // probably useless idk
            };
            completion.insertText = ""; //dont insert any text
            return [completion];
        }
        }, "+");
    const searcher = vscode.languages.registerCompletionItemProvider('plaintext', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            let INFO = { //TODO: find the right questions
                description: "This contains all questions and their respective links",
                all_questions: [
                    {
                       display_name: "What time is it with python",
                       link:  "https://www.google.com/search?q=What time is it with python",
                       keywords: [
                           "time", 
                           "question"
                       ]
                    },
                    {
                        display_name: "How much is 2 plus 2?",
                        link: "https://www.google.com/search?q=How much is 2 plus 2",
                        keywords:[
                            "add",
                            "sum",
                            "+",
                            "2+2"
                        ]
                    }
                ]
            };
            return INFO.all_questions.map(
                question => getQuestion(question.display_name, question.link)
                );
		}
    }, "#");
    // vscode.commands.registerCommand
    const finder = vscode.commands.registerCommand("helloworld.helloWorld",
    ()=>{
        vscode.window.showInformationMessage("You are now using helpme extension!");
        // console.log("ahhh");
        // let value = vscode.window.showInputBox();
        // console.log("This is what was inputted:" + value);
    });
	context.subscriptions.push(finder, searcher, openBrowser, hack, showBox);
}

// this method is called when your extension is deactivated
export function deactivate() {}
