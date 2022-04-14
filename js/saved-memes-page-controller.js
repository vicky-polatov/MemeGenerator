'use strict'

function initSavedMemes() {
    renderMemes()
}

function renderMemes() {
    const memes = getSavedMemes()
    if (!memes) return
    let strHTMLs = memes.map(meme => {
        return `<img src="${meme}">`
    })
    document.querySelector('.memes-container').innerHTML = strHTMLs.join('')
}

function onOpenMemes() {
    initSavedMemes()
    setActivePage(document.querySelector('header .memes'))
    document.querySelector('.saved-memes').classList.remove('hidden')
    document.querySelector('.meme-editor').classList.add('hidden')
    document.querySelector('.gallery-page').classList.add('hidden')
}