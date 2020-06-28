// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { open } from 'fs';
import path = require('path');
// import jsonfile = require('jsonfile');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');
    // const fileDirectory = context.globalStoragePath;
    // const fullPath = path.join(fileDirectory, 'question_map.json');
    // let questions = [
    //     {
    //        display_name: "What time is it with python",
    //        link:  "https://www.google.com/search?q=What time is it with python",
    //        keywords: [
    //            "time", 
    //            "question"
    //        ]
    //     }];
    // fs.readFileSync(fullPath, function (err: any, fileData: any) {
    //     console.log("reading file");
    //     if (err) {console.error(err);}
    //     questions = fileData.split('\r\n');
    //     console.log(questions);
    //     // questions = obj;
    //     // console.log(obj);
    //     // console.dir(obj);
    // });

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

    const stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'];


    function remove_stopwords(str: String) {
        const res = [];
        const words = str.split(' ');
        for(var i = 0; i < words.length; i++) {
           const word_clean = words[i].split(".").join("");
           if(!stopwords.includes(word_clean)) {
               res.push(word_clean);
           }
        }
        return(res);
    }  

    function updateJSON(question: any, url: any){

        const fullPath = path.join(fileDir, 'question_map.json');

        let newQuestion = {
            display_name: question,
            link:  url,
            keywords: remove_stopwords(question)
        };

        let newData = JSON.stringify(newQuestion);
        let fullData;
        
        
        // fs.appendFile(fullPath, newData , function (err: any) {
        //     if (err) {throw err;}
        //     console.log('The new data was appended to file!');
        //  });


        // fs.readFile(fullPath, function (err: any, data: string) {
        //     console.log("going into readfile");
        //     var json = JSON.parse(data);
        //     json.push(newData);    
        //     fs.writeFile(fullPath, JSON.stringify(json), function(err: any){
        //       console.log("going into write file");
        //       if (err) {throw err;}
        //       console.log('The data was appended to file!');
        //     });
        // });

        const jsonfile = require('jsonfile');
        jsonfile.writeFileSync(fullPath, newQuestion, { EOL:'\r\n', flag: 'a' });


        // fs.readFile(fullPath, function (err: any, data: string) {
        //     console.log("got into readfile");
        //     if (err){ 
        //         console.log("did not find file");
        //         fullData = newData;
        //     }
        //     else {
        //         console.log("Found file");
        //         var json = JSON.parse(data);
        //         json.push(newData);
        //         fullData = JSON.stringify(json);

        //     // fs.writeFile("results.json", JSON.stringify(json))
        //     }
        //     console.log(fullData);
        //     fs.writeFile(fullPath, fullData, function(err: any) {
        //         if(err) {
        //             console.log(err);
        //         } else {
        //             console.log("The file was saved!");
        //         }
        //     });
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
            completion.kind = vscode.CompletionItemKind.Event;
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
            const jsonfile = require('jsonfile');
            const fullPath = path.join(fileDir, 'question_map.json');
            let questions = [
                    {
                       display_name: "What time is it with python",
                       link:  "https://www.google.com/search?q=What time is it with python",
                       keywords: [
                           "time", 
                           "question"
                       ]
                    }];
            fs.readFileSync(fullPath, function (err: any, fileData: any) {
                console.log("reading file");
                if (err) {console.error(err);}
                questions = fileData.split('\r\n');
                console.log(questions);
                // questions = obj;
                // console.log(obj);
                // console.dir(obj);
              });

            let INFO = { //TODO: find the right questions
                description: "This contains all questions and their respective links",
                all_questions: questions
                // all_questions: [
                //     {
                //        display_name: "What time is it with python",
                //        link:  "https://www.google.com/search?q=What time is it with python",
                //        keywords: [
                //            "time", 
                //            "question"
                //        ]
                //     },
                //     {
                //         display_name: "How much is 2 plus 2?",
                //         link: "https://www.google.com/search?q=How much is 2 plus 2",
                //         keywords:[
                //             "add",
                //             "sum",
                //             "+",
                //             "2+2"
                //         ]
                //     }
                // ]
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
