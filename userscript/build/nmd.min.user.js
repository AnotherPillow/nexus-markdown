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
let MARKDOWN_SVG='<svg class="btn-inner modesw" fill="#000000" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" height="24px" width="24px"><title>Markdown icon</title><path d="M22.269 19.385H1.731a1.73 1.73 0 0 1-1.73-1.73V6.345a1.73 1.73 0 0 1 1.73-1.73h20.538a1.73 1.73 0 0 1 1.73 1.73v11.308a1.73 1.73 0 0 1-1.73 1.731zm-16.5-3.462v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z"></path></svg>',NMD_NOTE=`
<!-- 
NMD NOTE:
If you are using a code block or quotes, press the BBCode button *before* going back to the WYSIWYG/Preview mode.
-->
`,EDITOR_DIALOG_INNER=`
    <div id="markdown-editor-dialog-inner">
        <wc-monaco-editor language="markdown"></wc-monaco-editor>
    </div>
`;
// https://stackoverflow.com/a/61511955
function waitForElm(e){return new Promise(t=>{if(document.querySelector(e))return t(document.querySelector(e));let n=new MutationObserver(o=>{document.querySelector(e)&&(n.disconnect(),t(document.querySelector(e)))});
// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
n.observe(document.body,{childList:!0,subtree:!0})})}GM_addStyle(`
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
        
`);let sleep=(t=1e3)=>new Promise(o=>setTimeout(o,t));(window.location.pathname.endsWith("/mods/edit/")||window.location.pathname.endsWith("/mods/add"))&&function(){var o=document.createElement("script");o.type="module",o.src="https://cdn.jsdelivr.net/gh/vanillawc/wc-monaco-editor@1/index.js",document.head.appendChild(o),waitForElm(".wysibb").then(o=>{var t=o.querySelector(".wysibb-toolbar"),n=t.querySelector(".wysibb-toolbar-container.modeSwitch>.wysibb-toolbar-btn.mswitch:not(#markdown-button-container)"),o=o.querySelector(".wysibb-text"),e=document.createElement("div");e.id="nmd-markdown-editor-container",e.setAttribute("style",document.querySelector(".wysibb-text-editor")?.getAttribute("style")??""),e.style.display="none",e.style.height=e.style.maxHeight,e.innerHTML=EDITOR_DIALOG_INNER,o.appendChild(e);let i=document.querySelector("#nmd-markdown-editor-container");o=document.createElement("div"),o.id="markdown-button",o.classList.add("wysibb-toolbar-btn","mswitch"),o.innerHTML=MARKDOWN_SVG,e=document.createElement("div");e.id="markdown-button-container",e.classList.add("wysibb-toolbar-container","modeSwitch"),e.appendChild(o),e.style.right=((n?.getBoundingClientRect().width??75)-3).toString()+"px",// these things are most horrific
n?.addEventListener("click",()=>{i.style.display="none"}),o.addEventListener("click",async()=>{
// console.log(`markdown button clicked, editor is currently ${isMdHiddenAtStart ? 'hidden' : 'visible'} (${isMdHiddenAtStart})`)
"block"!=i.style.display?(
// Array.from(textHolder.children).filter(e => e.id != 'nmd-markdown-editor-container').forEach(child => (child as HTMLElement).style.display = 'hidden')
// for some reason iterating through the children doesn't work so have to use jQuery
$(".wysibb-text").children().hide(),i.style.display="block"):(
// for some reason iterating through the children doesn't work so have to use jQuery
$(".wysibb-text").children().hide(),document.querySelector(".wysibb-body").style.display="block");
//@ts-ignore
let t=new window.showdown.Converter;var o=$(".wys-panel").htmlcode(),o=t.makeMarkdown(o).replace(/<font size="(\d+)">(.*?)<\/font>/g,(o,t,n)=>"#".repeat(parseInt(t))+" "+n).replaceAll("\n","").replaceAll("<br>","\n");let n=i.querySelector("wc-monaco-editor");
// console.log(monaco, monaco.editor)
o.includes("NMD NOTE:")?n.editor.setValue(o):n.editor.setValue(o+NMD_NOTE),n.editor.getModel().onDidChangeContent(()=>{var o=n.editor.getValue(),o=t.makeHtml(o).replace(/<h1 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h1>/g,'<font size="6">$1</font>').replace(/<h2 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h2>/g,'<font size="5">$1</font>').replace(/<h3 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h3>/g,'<font size="4">$1</font>').replace(/<h4 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h4>/g,'<font size="3">$1</font>').replace(/<h5 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h5>/g,'<font size="2">$1</font>').replace(/<h6 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h6>/g,'<font size="1">$1</font>').replace(/\n/g,"<br>");// but we want the full content
$(".wys-panel").htmlcode(o)})}),t.appendChild(e)})}();
