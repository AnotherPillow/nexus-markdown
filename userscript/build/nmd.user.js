"use strict";
// ==UserScript==
// @name        Nexus Markdown
// @namespace   anotherpillow
// @description A userscript to allow for usage of markdown in Nexus Mods descriptions!
// @match       https://www.nexusmods.com/*
// @grant       none
// @version     1.3.0
// @author      AnotherPillow
// @license     MPL-2.0
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://raw.githubusercontent.com/thdoan/strftime/master/strftime.js
// @require     https://unpkg.com/showdown/dist/showdown.min.js
// @grant       GM_addStyle
// ==/UserScript==
// https://www.svgrepo.com/svg/306375/markdown
const MARKDOWN_SVG = `<svg class="btn-inner modesw" fill="#000000" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" width="24px"><title>Markdown icon</title><path d="M22.269 19.385H1.731a1.73 1.73 0 0 1-1.73-1.73V6.345a1.73 1.73 0 0 1 1.73-1.73h20.538a1.73 1.73 0 0 1 1.73 1.73v11.308a1.73 1.73 0 0 1-1.73 1.731zm-16.5-3.462v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z"></path></svg>`;
const NMD_NOTE = `
<!-- 
NMD NOTE:
If you are using a code block or quotes, press the BBCode button *before* going back to the WYSIWYG/Preview mode.
-->
`;
const EDITOR_DIALOG_INNER = `
    <div id="markdown-editor-dialog-inner">
        <wc-monaco-editor language="markdown"></wc-monaco-editor>
    </div>
`;
GM_addStyle(`
    #markdown-editor-dialog {
        width: 100%;
        position: absolute;
        inset: 0;
        margin: none;
        height: 100%;
        outline: none;
        margin: none;
        scrollbar-width: none;
        display: grid;
        place-items: center;

        background-color: #aaaaaaaa;
    }
    #markdown-editor-dialog-inner {
        width: 80%;
        height: 80%;
        border: 5px solid black;
        border-radius: 5px;
    }
    #markdown-button-container {
        max-width: 30px;
        border-right: 1px solid #ddd;
    }
    #markdown-button {
        width: 28px;
        max-width: 28px;
    }
        
`);
// https://stackoverflow.com/a/61511955
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });
        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
const sleep = (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
(window.location.pathname.endsWith("/mods/edit/") || window.location.pathname.endsWith('/mods/add')) ? (function () {
    const wcmonaco = document.createElement('script');
    wcmonaco.type = 'module';
    wcmonaco.src = 'https://cdn.jsdelivr.net/gh/vanillawc/wc-monaco-editor@1/index.js';
    document.head.appendChild(wcmonaco);
    waitForElm('.wysibb').then((editor) => {
        const toolbar = editor.querySelector('.wysibb-toolbar');
        const bbCodeButton = toolbar.querySelector('.wysibb-toolbar-container.modeSwitch>.wysibb-toolbar-btn.mswitch:not(#markdown-button-container)');
        const textHolder = editor.querySelector('.wysibb-text');
        const mdEditor = document.createElement('div');
        mdEditor.id = "nmd-markdown-editor-container";
        mdEditor.setAttribute('style', document.querySelector('.wysibb-text-editor')?.getAttribute('style') ?? '');
        mdEditor.style.display = 'none';
        mdEditor.style.height = mdEditor.style.maxHeight;
        mdEditor.innerHTML = EDITOR_DIALOG_INNER;
        textHolder.appendChild(mdEditor);
        const domMdEditor = document.querySelector('#nmd-markdown-editor-container');
        const mdButton = document.createElement('div');
        mdButton.id = 'markdown-button';
        mdButton.classList.add('wysibb-toolbar-btn', 'mswitch');
        mdButton.innerHTML = MARKDOWN_SVG;
        const mdButtonContainer = document.createElement('div');
        mdButtonContainer.id = 'markdown-button-container';
        mdButtonContainer.classList.add('wysibb-toolbar-container', 'modeSwitch');
        mdButtonContainer.appendChild(mdButton);
        mdButtonContainer.style.right = ((bbCodeButton?.getBoundingClientRect().width ?? 75) - 3).toString() + 'px'; // these things are most horrific
        bbCodeButton?.addEventListener('click', () => {
            domMdEditor.style.display = 'none';
        });
        mdButton.addEventListener('click', async () => {
            // Hide all of the various formats (using jQuery, it's convenient)
            const isMdHiddenAtStart = domMdEditor.style.display != 'block';
            // console.log(`markdown button clicked, editor is currently ${isMdHiddenAtStart ? 'hidden' : 'visible'} (${isMdHiddenAtStart})`)
            if (isMdHiddenAtStart) {
                // Array.from(textHolder.children).filter(e => e.id != 'nmd-markdown-editor-container').forEach(child => (child as HTMLElement).style.display = 'hidden')
                // for some reason iterating through the children doesn't work so have to use jQuery
                $('.wysibb-text').children().hide();
                domMdEditor.style.display = 'block';
            }
            else {
                // for some reason iterating through the children doesn't work so have to use jQuery
                $('.wysibb-text').children().hide();
                document.querySelector('.wysibb-body').style.display = 'block';
            }
            //@ts-ignore
            const converter = new window.showdown.Converter();
            const bbAsHTML = $(".wys-panel").htmlcode();
            const initial_markdown = converter.makeMarkdown(bbAsHTML)
                .replace(/<font size="(\d+)">(.*?)<\/font>/g, (_, size, text) => {
                return `${'#'.repeat(parseInt(size))} ${text}`;
            })
                .replaceAll('\n', '')
                .replaceAll('<br>', '\n');
            const monaco = domMdEditor.querySelector('wc-monaco-editor');
            // console.log(monaco, monaco.editor)
            if (initial_markdown.includes('NMD NOTE:'))
                monaco.editor.setValue(initial_markdown);
            else
                monaco.editor.setValue(initial_markdown + NMD_NOTE);
            monaco.editor.getModel().onDidChangeContent(() => {
                const content = monaco.editor.getValue(); // but we want the full content
                const html = converter.makeHtml(content)
                    // fix headers
                    .replace(/<h1 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h1>/g, `<font size="6">$1</font>`)
                    .replace(/<h2 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h2>/g, `<font size="5">$1</font>`)
                    .replace(/<h3 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h3>/g, `<font size="4">$1</font>`)
                    .replace(/<h4 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h4>/g, `<font size="3">$1</font>`)
                    .replace(/<h5 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h5>/g, `<font size="2">$1</font>`)
                    .replace(/<h6 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h6>/g, `<font size="1">$1</font>`)
                    .replace(/\n/g, '<br>');
                $(".wys-panel").htmlcode(html);
            });
            // dialog.close()
        });
        toolbar.appendChild(mdButtonContainer);
    });
})() : undefined;
