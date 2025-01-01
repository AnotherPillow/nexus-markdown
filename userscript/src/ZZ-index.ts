

(window.location.pathname.endsWith("/mods/edit/") || window.location.pathname.endsWith('/mods/add')) ? (function () {
    const wcmonaco = document.createElement('script')
    wcmonaco.type = 'module'
    wcmonaco.src = 'https://cdn.jsdelivr.net/gh/vanillawc/wc-monaco-editor@1/index.js'
    document.head.appendChild(wcmonaco)
    
    waitForElm('.wysibb').then((editor: HTMLElement) => {
        const toolbar = editor.querySelector('.wysibb-toolbar')!
        const bbCodeButton = toolbar.querySelector('.wysibb-toolbar-container.modeSwitch>.wysibb-toolbar-btn.mswitch:not(#markdown-button-container)')
        const textHolder = editor.querySelector('.wysibb-text')!
        
        const mdEditor = document.createElement('div')
        mdEditor.id="nmd-markdown-editor-container"
        mdEditor.setAttribute('style', document.querySelector('.wysibb-text-editor')?.getAttribute('style') ?? '')
        mdEditor.style.display = 'none'
        mdEditor.style.height = mdEditor.style.maxHeight
        mdEditor.innerHTML = EDITOR_DIALOG_INNER
        textHolder.appendChild(mdEditor)

        const domMdEditor = document.querySelector('#nmd-markdown-editor-container') as HTMLDivElement

        const mdButton = document.createElement('div')
        mdButton.id = 'markdown-button'
        mdButton.classList.add('wysibb-toolbar-btn', 'mswitch')
        mdButton.innerHTML = MARKDOWN_SVG

        const mdButtonContainer = document.createElement('div')
        mdButtonContainer.id = 'markdown-button-container'
        mdButtonContainer.classList.add('wysibb-toolbar-container', 'modeSwitch')
        mdButtonContainer.appendChild(mdButton)
        mdButtonContainer.style.right = ((bbCodeButton?.getBoundingClientRect().width ?? 75) - 3).toString() + 'px' // these things are most horrific

        bbCodeButton?.addEventListener('click', () => {
            domMdEditor.style.display = 'none'
        })

        mdButton.addEventListener('click' , async () => {
            // Hide all of the various formats (using jQuery, it's convenient)
            const isMdHiddenAtStart = domMdEditor.style.display != 'block'
            // console.log(`markdown button clicked, editor is currently ${isMdHiddenAtStart ? 'hidden' : 'visible'} (${isMdHiddenAtStart})`)
            
            if (isMdHiddenAtStart) {
                // Array.from(textHolder.children).filter(e => e.id != 'nmd-markdown-editor-container').forEach(child => (child as HTMLElement).style.display = 'hidden')
                // for some reason iterating through the children doesn't work so have to use jQuery
                $('.wysibb-text').children().hide()

                domMdEditor.style.display = 'block'
            } else {
                // for some reason iterating through the children doesn't work so have to use jQuery
                $('.wysibb-text').children().hide()


                // show the WYSIWYG editor
                ;(document.querySelector('.wysibb-body') as HTMLDivElement).style.display = 'block'
            }
            
            //@ts-ignore
            const converter = new window.showdown.Converter()
            
            const bbAsHTML = ($(".wys-panel") as any).htmlcode()
            const initial_markdown = (converter.makeMarkdown(bbAsHTML) as string)
                .replace(/<font size="(\d+)">(.*?)<\/font>/g, (_, size, text) => { // convert the font elements to hashes
                    return `${'#'.repeat(parseInt(size))} ${text}`;
                })
                .replaceAll('\n', '')
                .replaceAll('<br>', '\n')


            const monaco = domMdEditor.querySelector('wc-monaco-editor') as any;
            // console.log(monaco, monaco.editor)
            
            if (initial_markdown.includes('NMD NOTE:'))
                monaco.editor.setValue(initial_markdown)
            else monaco.editor.setValue(initial_markdown + NMD_NOTE)

            monaco.editor.getModel().onDidChangeContent(() => { // this provides the change itself
                const content = monaco.editor.getValue() // but we want the full content
                
                const html = (converter.makeHtml(content) as string)
                    // fix headers
                    .replace(/<h1 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h1>/g, `<font size="6">$1</font>`)
                    .replace(/<h2 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h2>/g, `<font size="5">$1</font>`)
                    .replace(/<h3 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h3>/g, `<font size="4">$1</font>`)
                    .replace(/<h4 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h4>/g, `<font size="3">$1</font>`)
                    .replace(/<h5 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h5>/g, `<font size="2">$1</font>`)
                    .replace(/<h6 ?(?:[a-z\-0-9_]+=?(?:['"][^"]+['"])?)?>(.*?)<\/h6>/g, `<font size="1">$1</font>`)
                    .replace(/\n/g, '<br>')

                ;($(".wys-panel") as any).htmlcode(html)
            })
            // dialog.close()

        })

        toolbar.appendChild(mdButtonContainer)
    })
})() : undefined