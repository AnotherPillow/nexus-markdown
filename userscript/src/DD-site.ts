
const EDITOR_DIALOG_INNER = `
    <div id="markdown-editor-dialog-inner">
        <wc-monaco-editor language="markdown"></wc-monaco-editor>
    </div>
`

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
        
`)