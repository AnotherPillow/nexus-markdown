

(window.location.pathname.endsWith("/mods/edit/") || window.location.pathname == '/mods/add') ? (function () {
    const wcmonaco = document.createElement('script')
    wcmonaco.type = 'module'
    wcmonaco.src = 'https://cdn.jsdelivr.net/gh/vanillawc/wc-monaco-editor@1/index.js'
    document.head.appendChild(wcmonaco)
    
    waitForElm('.wysibb').then((editor: HTMLElement) => {
        const toolbar = editor.querySelector('.wysibb-toolbar')!

        const newItem2 = document.createElement('div')
        newItem2.classList.add('wysibb-toolbar-btn')
        newItem2.innerHTML = MARKDOWN_SVG
        const newItem1 = document.createElement('div')
        newItem1.classList.add('wysibb-toolbar-container')
        newItem1.appendChild(newItem2)

        newItem2.addEventListener('click' , async () => {
            //@ts-ignore
            const converter = new window.showdown.Converter()
            
            const bbAsHTML = ($(".wys-panel") as any).htmlcode()
            const initial_markdown = converter.makeMarkdown(bbAsHTML)

            const dialog = document.createElement('dialog')
            dialog.innerHTML = EDITOR_DIALOG_INNER
            dialog.id = 'markdown-editor-dialog'
            
            document.body.appendChild(dialog)

            const monaco = dialog.querySelector('wc-monaco-editor') as any;
            console.log(monaco, monaco.editor)
            monaco.editor.setValue(initial_markdown)

            monaco.editor.getModel().onDidChangeContent(() => { // this provides the change itself
                const content = monaco.editor.getValue() // but we want the full content
                
                const html = converter.makeHtml(content);
                ($(".wys-panel") as any).htmlcode(html)
            })

            dialog.addEventListener('click', (event: MouseEvent) => {
                if ((event.target as HTMLElement)?.id == dialog.id)
                    document.body.removeChild(dialog)
            })
            dialog.showModal()
            // dialog.close()

        })

        toolbar.appendChild(newItem1)
    })
})() : undefined