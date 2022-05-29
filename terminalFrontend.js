const terminalPrefix = "[root@localhost]:";

const motd = [
    "           __________                         _   _   __          __      _   ______                       ",
    "         .'----------`.                      | \\ | | /_/         /_/     (_) |  ____|                      ",
    "         | .--------. |                      |  \\| | __ _ _ __   __ _ ___ _  | |__ ___ _ __ ___ _ __   ___ ",
    "         | |########| |       __________     |   ` |/ _` | '_ \\ / _` / __| | |  __/ _ \\ '__/ _ \\ '_ \\ / __|",
    "         | |########| |      /__________\\    | |\\  | (_| | | | | (_| \\__ \\ | | | |  __/ | |  __/ | | | (__ ",
    ".--------| `--------' |------|    --=-- |--. |_| \\_|\\__,_|_| |_|\\__,_|___/_| |_|  \\___|_|  \\___|_| |_|\\___|",
    "|        `----,-.-----'      |o ======  |  | --------------------------------------------------------------",
    "|       ______|_|_______     |__________|  | Terminal blog frontend                                       |",
    "|      /  %%%%%%%%%%%%  \\                  |                                                              |",
    "|     /  %%%%%%%%%%%%%%  \\                 |                                                              |",
    "|     ^^^^^^^^^^^^^^^^^^^^                 | --------------------------------------------------------------",
    "+------------------------------------------+",
];
const helpText = [
    "whoami",
    "    Info about me.",
    "articles id:optional",
    "    Loads articles or if id provided the specified article (TODO)",
    "projects",
    "    My public projects",
    "clear",
    "    Clears the screen",
    "motd",
    "    Renders message of the day",
    "contact",
    "   How to contact me, socials like Github, LinkedIn, E-mail...",
    "help or ?",
    "    Renders this help",
];

const contactText = [
    "Github:",
    "   <a href='https://github.com/husudosu' target='_blank'>https://github.com/husudosu</a>",
    "LinkedIn:",
    "   <a href='https://www.linkedin.com/in/ferenc-n%C3%A1n%C3%A1si-b0a0aba5/' target='_blank'>https://www.linkedin.com/in/ferenc-n%C3%A1n%C3%A1si-b0a0aba5/</a>",
    "E-mail:",
    "   <a href='mailto:husudosu94@gmail.com'>husudosu94@gmail.com</a>",
];

const projects = [
    {
        id: 1,
        title: "MPV remote (App)",
        summary: "Android application for controlling MPV mediaplayer",
        githubURL: "https://github.com/husudosu/mpv-remote-app",
        screenshots: [],
    },
    {
        id: 2,
        title: "MPV remote (Node.JS)",
        summary: "Remote web API plugin for MPV mediaplayer",
        githubURL: "https://github.com/husudosu/mpv-remote-node",
    },
    {
        id: 3,
        title: "Üzemszünetek (Hungarian)",
        githubURL: "https://github.com/husudosu/uzemszunet",
        summary: "Üzemszünetek lekérdezése Opus-Titász szolgáltatól",
    },
];

let terminalHistory = [];
let textBuffer = "";
let cursorPos = 0;

$(document).ready(() => {
    $("#promptPrefix").html(terminalPrefix);
    $("#promptDiv").html("<span class='promptCursor'></span>");
    renderMOTD();
    $(document).keydown((ev) => {
        var key = ev.keyCode || ev.charCode;
        // Backspace or del
        if (ev.ctrlKey && key == 76) {
            // CTRL+L to clear screen
            ev.preventDefault();
            clearScreen();
            return;
        } else if (ev.ctrlKey && key == 65) {
            // CTRL+A to go start of prompt
            ev.preventDefault();
            cursorPos = 0;
            setCursorPos();
            return;
        } else if (ev.ctrlKey && key == 69) {
            // CTRL+E to go to end of prompt
            ev.preventDefault();
            cursorPos = textBuffer.length;
            setCursorPos();
            return;
        } else if (ev.ctrlKey && key == 75) {
            // CTRL+K remove buffer after cursor
            ev.preventDefault();
            textBuffer = textBuffer.substring(0, cursorPos);
            setCursorPos();
            return;
        } else if (key == 37 && cursorPos > 0) {
            // Left  cursor navigation
            cursorPos--;
            setCursorPos();
            return;
        } else if (key == 39 && cursorPos < textBuffer.length) {
            // Right cursor navigation
            cursorPos++;
            setCursorPos();
            return;
        } else if (cursorPos > 0 && (key == 8 || key == 46)) {
            removeTextBufferChar();
        } else if (key === 13) {
            terminalHistory.push(textBuffer);
            renderLine(textBuffer, true);
            mainParser(textBuffer);
            clearTextBuffer();
            window.scrollTo(0, document.body.scrollHeight);
        } else if (ev.key.length == 1) {
            // Only alphanumeric allowed here!
            window.scrollTo(0, document.body.scrollHeight);
            renderTextBufferChar(ev.key);
        }
    });
});

const clearTextBuffer = () => {
    textBuffer = "";
    cursorPos = 0;
    setCursorPos();
};

const setCursorPos = () => {
    let textBufferHTML = [
        textBuffer.substring(0, cursorPos),
        cursorPos < textBuffer.length - 1
            ? `<span class='promptCursor'>${textBuffer.charAt(
                  cursorPos
              )}</span>`
            : "",
        textBuffer.substring(cursorPos + 1),
        cursorPos >= textBuffer.length - 1
            ? `<span class='promptCursor'>${textBuffer.charAt(
                  cursorPos
              )}</span>`
            : "",
    ];

    $("#promptDiv").html(textBufferHTML);
};

const renderTextBufferChar = (charachter) => {
    textBuffer = [
        textBuffer.substring(0, cursorPos),
        charachter,
        textBuffer.substring(cursorPos),
    ].join("");
    cursorPos++;
    setCursorPos();
};

const removeTextBufferChar = () => {
    textBuffer =
        textBuffer.substring(0, cursorPos - 1) +
        textBuffer.substring(cursorPos);
    cursorPos--;
    setCursorPos();
};

const renderMOTD = () => {
    motd.forEach((element) => {
        renderLine(element);
    });
};

const renderHelp = () => {
    helpText.forEach((element) => {
        renderLine(element);
    });
};

const renderContact = () => {
    contactText.forEach((element) => {
        renderLine(element);
    });
};

const clearScreen = () => {
    $("#terminalWindow").html("");
};

const renderLine = (line, useTerminalPrefix = false) => {
    $("#terminalWindow").append(
        (useTerminalPrefix ? terminalPrefix : "") + line + "\n"
    );
};

const renderProjects = (projectId = null) => {
    if (!projectId)
        projects.forEach((el) => {
            renderLine(el.title);
            renderLine(`    ${el.summary}`);
            renderLine(`        More info: projects ${el.id}`);
        });
    else {
        const project = projects.find((el) => el.id == projectId);
        if (project) {
            renderLine(project.title);
            renderLine(`    ${project.summary}`);
        } else {
            renderLine("Project not exists.");
        }
    }
};

const mainParser = (command) => {
    const spl = command.trim().split(" ");
    switch (spl[0]) {
        case "whoami":
            break;
        case "articles":
            break;
        case "projects":
            renderProjects(spl[1]);
            break;
        case "contact":
            renderContact();
            break;
        case "clear":
            clearScreen();
            break;
        case "motd":
            clearScreen();
            renderMOTD();
            break;
        case "test":
            fetch("https://jsonplaceholder.typicode.com/todos/1")
                .then((response) => response.json())
                .then((json) => {
                    renderLine(json.title);
                    renderLine(json.id);
                });
            break;
        case "help":
        case "?":
            renderHelp();
            break;
        default:
            if (spl[0].trim().length > 0)
                renderLine(`Command not found: ${command}`);
            break;
    }
};
