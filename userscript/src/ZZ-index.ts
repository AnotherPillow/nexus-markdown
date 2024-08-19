

(window.location.pathname.endsWith("/mods/edit/") || window.location.pathname.endsWith('/mods/add')) ? (function () {
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
                
                const html = converter.makeHtml(content)
                    // fix headers
                    .replace(/<h1 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h1>/g, `<font size="6">$1</font>`)
                    .replace(/<h2 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h2>/g, `<font size="5">$1</font>`)
                    .replace(/<h3 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h3>/g, `<font size="4">$1</font>`)
                    .replace(/<h4 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h4>/g, `<font size="3">$1</font>`)
                    .replace(/<h5 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h5>/g, `<font size="2">$1</font>`)
                    .replace(/<h6 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h6>/g, `<font size="1">$1</font>`)
                ;($(".wys-panel") as any).htmlcode(html)
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