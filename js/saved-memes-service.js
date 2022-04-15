'use strict'

function editMeme(memeId) {
    const savedMemes = getSavedMemes()
    const meme = savedMemes.find(meme => meme.id === memeId)
    gMeme = meme.memeDB
    onOpenEditor()
    onEditorInit()
}