'use strict'

let gMeme
let gStartPos


function initMeme(selectedImgId = 0) {
    gMeme = {
        selectedImgId,
        selectedLineIdx: null,
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

function addLine(txt, size) {
    gMeme.lines.push(_createLine(txt, size))
}

function nextLine() {
    if (!getLines().length) return
    const oldLine = getLine()
    if (oldLine) oldLine.isSelected = false
    let currIdx = gMeme.selectedLineIdx
    gMeme.selectedLineIdx = (currIdx < gMeme.lines.length - 1) ? ++currIdx : 0
    const newLine = getLine()
    newLine.isSelected = true
}

function deleteLine() {
    if (!gMeme.selectedLineIdx && gMeme.selectedLineIdx !== 0) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (getLines().length === 0) gMeme.selectedLineIdx = null
    console.log(gMeme)
}

function setFontSize(diff) {
    if (!gMeme.selectedLineIdx && gMeme.selectedLineIdx !== 0) return
    getLine().size += diff
}

function setFontFamily(fontFamily) {
    if (!gMeme.selectedLineIdx && gMeme.selectedLineIdx !== 0) return
    getLine().fontFamily = fontFamily
}

function setColor(color, elChangeComponent) {
    if (!gMeme.selectedLineIdx && gMeme.selectedLineIdx !== 0) return
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
    if (!gMeme.selectedLineIdx && gMeme.selectedLineIdx !== 0) return
    getLine().isDrag = isDrag
}

function moveLine(dx, dy) {
    if (!gMeme.selectedLineIdx && gMeme.selectedLineIdx !== 0) return
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


