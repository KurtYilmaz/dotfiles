'use strict';
var vscode = require('vscode');
var clipboardy = require('clipboardy');
var config = vscode.workspace.getConfiguration('indentOnPaste');
var clipboardPasteActionCommand = null;
var extension = null;
var pasting = false;
var indentOnPaste = function () {
    if (pasting)
        return;
    pasting = true;
    try {
        //get the clipboard contents...
        var clipboard_1 = getClipboard();
        var originalClipboard_1 = clipboard_1;
        var lines = clipboard_1.split("\n");
        //let clipboardEndsWithReturn:boolean = lines[lines.length - 1].search(/\S/) == -1;
        //get the line we will be pasting on...
        var editor_1 = vscode.window.activeTextEditor;
        var pasteOnLineNumber = editor_1.selection.start.line;
        var pasteOnLine = editor_1.document.lineAt(pasteOnLineNumber).text;
        var beforePastePosition = pasteOnLine.substr(0, editor_1.selection.start.character);
        var pasteOnBlankLine_1 = (beforePastePosition.search(/\S/) == -1);
        //find the next line that is not blank, which we will inspect to determine how much indentation is needed...
        var inspectLine = "";
        for (var i = editor_1.selection.end.line + 1; i < editor_1.document.lineCount; i++) {
            if (editor_1.document.lineAt(i).text.search(/\S/) > -1) {
                inspectLine = editor_1.document.lineAt(i).text;
                break;
            }
        }
        //count the indentations on the inspection line...
        var indentationsNeeded = countIndents(inspectLine);
        //if the inspection line is an ending block, increase the indentation by 1...
        var inspection_1 = inspectLine.toLowerCase().replace(/\s/g, ''); //lowercase and remove all whitespace
        var isEndingBlock_1 = false;
        config.get('endingBlocks').forEach(function (endingBlock) {
            if (inspection_1.startsWith(endingBlock.toLowerCase())) {
                isEndingBlock_1 = true;
            }
        });
        if (isEndingBlock_1)
            indentationsNeeded++;
        //just abort if there's nothing on the clipboard...
        if (lines.length == 0)
            return;
        //only re-indent the clipboard if it has multiple lines or we're pasting to a blank line...
        var x = 0;
        if (lines.length > 1 || pasteOnBlankLine_1) {
            //determine the desired indentation level by finding the least indented non-blank line
            //(skip the first line, which could have been copied without its indentation)...
            var currentLineIndents = 0;
            var desiredIndentation = 99999;
            for (x = 1; x < lines.length; x++) {
                if (lines[x].search(/\S/) > -1) {
                    currentLineIndents = countIndents(lines[x]);
                    if (currentLineIndents < desiredIndentation)
                        desiredIndentation = currentLineIndents;
                }
            }
            //if the first line is not blank (and we're pasting to a blank line), let's assume its indentation should match the desired indentation...
            if (lines[0].search(/\S/) > -1 && pasteOnBlankLine_1) {
                lines[0] = setIndents(lines[0], desiredIndentation);
            }
            //redo the indentations...
            clipboard_1 = "";
            for (x = 0; x < lines.length; x++) {
                if (x > 0)
                    clipboard_1 += "\n";
                //don't re-indent the first line if we're pasting on a non-empty line...
                if (pasteOnBlankLine_1 || x > 0) {
                    //don't re-indent blank lines...
                    if (lines[x].search(/\S/) > -1) {
                        lines[x] = setIndents(lines[x], (countIndents(lines[x]) - desiredIndentation) + indentationsNeeded);
                    }
                }
                clipboard_1 += lines[x];
            }
        }
        if (config.get('pasteMethod') == "workaround") {
            //replace whatever's currently selected with the modified clipboard contents...
            editor_1.edit(function (textInserter) {
                //if we're pasting on a blank line, start replacing at the very beginning of the line (replace current indentation)...
                if (pasteOnBlankLine_1)
                    textInserter.replace(new vscode.Selection(editor_1.selection.start.line, 0, editor_1.selection.end.line, editor_1.selection.end.character), clipboard_1);
                else
                    textInserter.replace(editor_1.selection, clipboard_1);
            }).then(function () {
                //unselect selection...
                editor_1.selection = new vscode.Selection(editor_1.selection.end.line, editor_1.selection.end.character, editor_1.selection.end.line, editor_1.selection.end.character);
                pasting = false;
            }, function () { pasting = false; });
        }
        else {
            //replace the clipboard contents with the modified version...
            clipboardy.write(clipboard_1).then(function () {
                //if we're pasting onto a blank line, be sure to extend the selection to the very beginning of the blank line (to replace any existing indentation)...
                if (pasteOnBlankLine_1)
                    editor_1.selection = new vscode.Selection(editor_1.selection.start.line, 0, editor_1.selection.end.line, editor_1.selection.end.character);
                //after the clipboard has been updated, call VS Code's native paste command.
                //We need to remove our event handler for this first so we don't cause infinite recursion, and then add it back in afterwards...
                clipboardPasteActionCommand.dispose();
                vscode.commands.executeCommand('editor.action.clipboardPasteAction').then(function () {
                    clipboardPasteActionCommand = vscode.commands.registerTextEditorCommand('editor.action.clipboardPasteAction', indentOnPaste);
                    extension.subscriptions.push(clipboardPasteActionCommand);
                    //restore the unmodified version of the clipboard...
                    clipboardy.writeSync(originalClipboard_1);
                    pasting = false;
                }, function () { pasting = false; });
            }, function () { pasting = false; });
        }
    }
    catch (e) {
        pasting = false;
        console.log("Error pasting...", e);
    }
};
function getClipboard() {
    return clipboardy.readSync();
}
exports.getClipboard = getClipboard;
function countIndents(str) {
    var editor = vscode.window.activeTextEditor;
    var indents = 0;
    var spaces = 0;
    for (var x = 0; x < str.length; x++) {
        if (str.charAt(x).search(/\S/) > -1)
            break;
        if (str.charAt(x) == " ") {
            spaces++;
            if (spaces >= editor.options.tabSize) {
                indents++;
                spaces = 0;
            }
        }
        else if (str.charAt(x) == "\t") {
            indents++;
            spaces = 0;
        }
    }
    return indents;
}
exports.countIndents = countIndents;
function setIndents(str, indents) {
    var editor = vscode.window.activeTextEditor;
    var indent = "\t";
    if (editor.options.insertSpaces) {
        indent = "";
        for (var x = 0; x < editor.options.tabSize; x++)
            indent += " ";
    }
    str = str.replace(/^\s+/g, ''); //trim leading whitespace
    for (var x = 0; x < indents; x++)
        str = indent + str;
    return str;
}
exports.setIndents = setIndents;
function activate(context) {
    extension = context;
    clipboardPasteActionCommand = vscode.commands.registerTextEditorCommand('editor.action.clipboardPasteAction', indentOnPaste);
    extension.subscriptions.push(clipboardPasteActionCommand);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map