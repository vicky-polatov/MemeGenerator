'use strict'

const SAVED_MEMES_KEY = 'SAVED_MEMES'

let gMeme
let gSavedMemes
let gStartPos


function initMeme(selectedImgId = 0) {
    gMeme = {
        selectedImgId,
        selectedLineIdx: 0,
        lines: []
    }
}

function getLines() {
    return gMeme.lines
}

function getLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getMeme() {
    return gMeme
}

function setGMeme(memeDB) {
    gMeme = memeDB
}

function saveMeme(memeDataUrl) {
    if (!gSavedMemes) gSavedMemes = []
    gSavedMemes.push({ dataUrl: memeDataUrl, id: makeId(), memeDB: gMeme })
    saveToStorage(SAVED_MEMES_KEY, gSavedMemes)
}

function getSavedMemes() {
    gSavedMemes = loadFromStorage(SAVED_MEMES_KEY)
    return gSavedMemes
}

function addLine(txt, size) {
    gMeme.lines.push(_createLine(txt, size))
}

function nextLine() {
    if (!gMeme.lines.length) return
    const oldLine = getLine()
    if (oldLine) oldLine.isSelected = false
    let currIdx = gMeme.selectedLineIdx
    gMeme.selectedLineIdx = (currIdx < gMeme.lines.length - 1) ? ++currIdx : 0
    const newLine = getLine()
    newLine.isSelected = true
}

function deleteLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}

function setFontSize(diff) {
    if (!gMeme.lines.length) return
    const line = getLine()
    line.size += diff
}

function setFontFamily(elOption) {
    const fontFamily = elOption.value
    const currLine = getLine()
    currLine.fontFamily = fontFamily
}

function setColor(color, elChangeComponent) {
    if (!gMeme.lines.length) return
    const currLine = getLine()
    if (elChangeComponent === 'font') currLine.fontColor = color
    else currLine.strokeColor = color
}

function isLineClicked(clickedPos) {
    const oldIdx = gMeme.selectedLineIdx
    let selectedLine
    selectedLine = gMeme.lines.findIndex(line => {
        const textWidth = gCtx.measureText(line.txt)
        const halfWidth = textWidth.width / 2
        const height = textWidth.fontBoundingBoxAscent + textWidth.fontBoundingBoxDescent
        return (
            clickedPos.y < line.y &&
            clickedPos.y > line.y - height &&
            clickedPos.x > line.x - halfWidth &&
            clickedPos.x < line.x + halfWidth
        )
    })
    if (selectedLine !== -1 && selectedLine !== oldIdx) {
        gMeme.lines[oldIdx].isSelected = false
        gMeme.selectedLineIdx = selectedLine
        getLine().isSelected = true
    }
}

function setLineDrag(isDrag) {
    getLine().isDrag = isDrag
}

function moveLine(dx, dy) {
    const currLine = getLine()
    currLine.x += dx
    currLine.y += dy
}

function _createLine(txt = '', size, fontFamily = 'Impact',
    align = 'center', fontColor = 'white', strokeColor = 'black') {
    return {
        txt,
        size,
        fontFamily,
        align,
        fontColor,
        strokeColor,
        isSelected: true
    }
}


