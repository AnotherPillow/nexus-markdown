// ==UserScript==
// @name        Nexus Markdown
// @namespace   anotherpillow
// @description A userscript to allow for usage of markdown in Nexus Mods descriptions!
// @match       https://www.nexusmods.com/*
// @grant       none
// @version     1.0.1
// @author      AnotherPillow
// @license     MPL-2.0
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://raw.githubusercontent.com/thdoan/strftime/master/strftime.js
// @require     https://unpkg.com/showdown/dist/showdown.min.js
// @grant       GM_addStyle
// ==/UserScript==
// https://www.svgrepo.com/svg/306375/markdown
let MARKDOWN_SVG='<svg fill="#000000" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" width="24px"><title>Markdown icon</title><path d="M22.269 19.385H1.731a1.73 1.73 0 0 1-1.73-1.73V6.345a1.73 1.73 0 0 1 1.73-1.73h20.538a1.73 1.73 0 0 1 1.73 1.73v11.308a1.73 1.73 0 0 1-1.73 1.731zm-16.5-3.462v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z"></path></svg>',EDITOR_DIALOG_INNER=`
    <div id="markdown-editor-dialog-inner">
        <wc-monaco-editor language="markdown"></wc-monaco-editor>

    </div>
`;
// https://stackoverflow.com/a/61511955
function waitForElm(t){return new Promise(e=>{if(document.querySelector(t))return e(document.querySelector(t));let i=new MutationObserver(o=>{document.querySelector(t)&&(i.disconnect(),e(document.querySelector(t)))});
// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
i.observe(document.body,{childList:!0,subtree:!0})})}GM_addStyle(`
    #markdown-editor-dialog {
        width: 100vw;
        position: absolute;
        inset: 0;
        margin: none;
        height: 100vh;
        outline: none;
        margin: none;
        scrollbar-width: none;
        display: grid;
        place-items: center;

        background-color: #aaaaaaaa;
    }`),GM_addStyle(`
    #markdown-editor-dialog-inner {
        width: 80vw;
        height: 80vh;
        border: 5px solid black;
        border-radius: 5px;
    }
`);let sleep=(e=1e3)=>new Promise(o=>setTimeout(o,e));!window.location.pathname.endsWith("/mods/edit/")&&"/mods/add"!=window.location.pathname||function(){var o=document.createElement("script");o.type="module",o.src="https://cdn.jsdelivr.net/gh/vanillawc/wc-monaco-editor@1/index.js",document.head.appendChild(o),waitForElm(".wysibb").then(o=>{var o=o.querySelector(".wysibb-toolbar"),e=document.createElement("div"),i=(e.classList.add("wysibb-toolbar-btn"),e.innerHTML=MARKDOWN_SVG,document.createElement("div"));i.classList.add("wysibb-toolbar-container"),i.appendChild(e),e.addEventListener("click",async()=>{
//@ts-ignore
let e=new window.showdown.Converter;var o=$(".wys-panel").htmlcode(),o=e.makeMarkdown(o);let i=document.createElement("dialog"),t=(i.innerHTML=EDITOR_DIALOG_INNER,i.id="markdown-editor-dialog",document.body.appendChild(i),i.querySelector("wc-monaco-editor"));console.log(t,t.editor),t.editor.setValue(o),t.editor.getModel().onDidChangeContent(()=>{var o=t.editor.getValue(),o=e.makeHtml(o);// but we want the full content
$(".wys-panel").htmlcode(o)}),i.addEventListener("click",o=>{o.target?.id==i.id&&document.body.removeChild(i)}),i.showModal()}),o.appendChild(i)})}();
