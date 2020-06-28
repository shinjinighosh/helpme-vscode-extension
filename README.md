# helpme README

This is the README for our extension "helpme".

## Features

Tired of retyping the same errors into Google and StackOverflow? Can't remember the one amazing link you once used for an elegant one-liner?
Helpme is here to save the day!

To add a question, simply type `+` and enter the question details and link:

|  Triggering question add | Adding question details | Adding question URL |
| :-----------------------------------: | :------------------------------------------------: | :------------------------------------------------: |
| ![1](https://i.imgur.com/N81PYJT.png) |        ![2](https://i.imgur.com/cUEg6zp.png)       | ![3](https://i.imgur.com/jM3GGqv.png)|
<!-- ![Adding a question](https://i.imgur.com/N81PYJT.png)|(https://i.imgur.com/cUEg6zp.png)|(https://i.imgur.com/jM3GGqv.png) -->

To search added questions, type `#` and choose from the autocomplete dropdown.
|  Triggering question search | Searching questions list |
| :-----------------------------------: | :------------------------------------------------: |
| ![1](https://i.imgur.com/OH24Pty.png) |        ![2](https://i.imgur.com/S9lnWqE.png)       | 

## Requirements

The project dependencies include 
```
"jsonfile": "^6.0.1",
"path": "^0.12.7"
```

and can be installed by running `npm install .` after cloning the extension repo.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

- Loading the question mappings takes a long time.

## Release Notes

Will be updated!

### 1.0.0

Initial release of helpme!

