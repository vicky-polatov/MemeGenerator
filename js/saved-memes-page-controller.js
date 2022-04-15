'use strict'

function initSavedMemes() {
    renderMemes()
}

function renderMemes() {
    const memes = getSavedMemes()
    if (!memes) return
    let strHTMLs = memes.map(meme => {
        return `<img src="${meme.dataUrl}" class="meme-img" onclick="editMeme('${meme.id}')">`
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

/// MOVE TO SERVICE
function editMeme(memeId) {
    const savedMemes = getSavedMemes()
    const meme = savedMemes.find(meme => meme.id === memeId)
    gMeme = meme.memeDB
    onOpenEditor()
    onEditorInit()
}