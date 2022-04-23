'use strict'

function findMeme(memeId) {
    const savedMemes = getSavedMemes()
    const meme = savedMemes.find(meme => meme.id === memeId)
    setGMeme(meme.memeDB)
}