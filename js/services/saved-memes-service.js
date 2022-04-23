'use strict'

const SAVED_MEMES_KEY = 'SAVED_MEMES'
let gSavedMemes = loadFromStorage(SAVED_MEMES_KEY) || []

function getSavedMemes() {
    return gSavedMemes
}

function saveMeme(memeDataUrl) {
    gSavedMemes.push({ dataUrl: memeDataUrl, id: makeId(), memeDB: gMeme })
    saveToStorage(SAVED_MEMES_KEY, gSavedMemes)
}

function findMeme(memeId) {
    const meme = gSavedMemes.find(meme => meme.id === memeId)
    setGMeme(meme.memeDB) // editor-service
}