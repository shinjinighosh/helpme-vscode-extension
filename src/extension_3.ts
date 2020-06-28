// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { open } from 'fs';
import path = require('path');
import { type } from 'os';
// this method is called when your extension is activated

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');
    let showBox = vscode.commands.registerCommand("helloworld.showBox", ()=>{
        showMessageBox();
    });

    const fileDir = context.globalStoragePath;
    console.log("filedir: "+ fileDir);

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
        console.log("Trying to update JSON...")

        const fullPath = path.join(fileDir, 'question_map.json');

        let newQuestion = {
            display_name: question,
            link:  url,
            keywords: remove_stopwords(question)
        };
        let fullData;
        console.log("json file defined, starting to write")
        // jsonfile.writeFileSync(fullPath, newQuestion, { EOL:'\r\n', flag: 'a' });
        // require(fullPath)
        console.log("finished writing!")

        fs.readFile(fullPath, function (err: any, data: string) {
            console.log("got into readfile");
            if (err){ 
                let important_json = {
                    description: "Here we store the questions needed with their respective links!",
                    questions: [
                        newQuestion
                    ]
                }
                console.log("did not find file");
                fullData = important_json;
            }
            else {
                console.log("Found file");
                console.log("data: "+data);
                let json = JSON.parse(data);
                json.questions.push(newQuestion);
                fullData = json //JSON.stringify(json); //cannot stringify

            }
            let formatted_data = JSON.stringify(fullData, null, 3); //to be more readable
            fs.writeFile(fullPath, formatted_data, function(err: any) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                }
            });
        });
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
    let openBrowser = vscode.commands.registerCommand("helloworld.openBrowser", (url)=>{
        console.log("vscode:"+ vscode.Uri.parse(url));
        vscode.env.openExternal(vscode.Uri.parse(url));
    });
    function getQuestion(question: string, link: string){ //TODO: maybe point to stackoverflow instead? 
        let browserCompleter = new vscode.CompletionItem(question);
        browserCompleter.kind = vscode.CompletionItemKind.Event;
        browserCompleter.command = {
            command: "helloworld.openBrowser",
            arguments: [link],
            title: "See it on the web...again?" // probably useless idk
        };
        browserCompleter.insertText ="";
        browserCompleter.documentation = "Go to "+link;
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
	    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            const jsonfile = require('jsonfile');
            const fullPath = path.join(fileDir, 'question_map.json');
            let all_questions = JSON.parse(fs.readFileSync(fullPath)); //has to be synced because the values should load before being shown
            // console.log("all questions are: "+ all_questions.questions);
            return all_questions.questions.map(
                question => getQuestion(question.display_name, question.link)
            )
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
// interface json_out{
//     questions: Array<Question>
// }
// interface Question{
//     display_name: string,
//     link: string
// }
// this method is called when your extension is deactivated
export function deactivate() {}
