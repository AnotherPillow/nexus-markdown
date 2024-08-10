
const EDITOR_DIALOG_INNER = `
    <div id="markdown-editor-dialog-inner">
        <wc-monaco-editor language="markdown"></wc-monaco-editor>

    </div>
`

GM_addStyle(`
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
    }`)
GM_addStyle(`
    #markdown-editor-dialog-inner {
        width: 80vw;
        height: 80vh;
        border: 5px solid black;
        border-radius: 5px;
    }
`)