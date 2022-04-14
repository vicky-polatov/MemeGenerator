'use strict'

let gElCanvas = document.querySelector('#main-canvas')
let gCtx = gElCanvas.getContext('2d')

function onEditorInit() {
    gIsImgReady = false;
    addResizeEventListener()
    addMouseEventListeners()
    addTouchEventListeners()
    resizeCanvas()
    renderMeme()
}

function onOpenEditor() {
    document.querySelector('.meme-editor').classList.remove('hidden')
    document.querySelector('.gallery-page').classList.add('hidden')
    document.querySelector('.saved-memes').classList.add('hidden')
    setActivePage()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth - 150
    gElCanvas.height = elContainer.offsetWidth - 150
    elContainer.style.height = `${gElCanvas.height + 20}px`
}

function renderMeme() {
    // clearCanvas()
    const meme = getMeme()
    const img = new Image()
    img.src = `../img/meme-imgs (square)/${meme.selectedImgId}.jpg`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawLines()
    }
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onAddLine(txt = 'your text') {
    const elInp = document.querySelector('[name="text"]')
    addLine(txt, gElCanvas.width / 10)
    const lines = getLines()
    if (lines.length === 1) lines[0].y = 80
    else if (lines.length === 2) lines[1].y = gElCanvas.height - 80
    selectLine()
    elInp.disabled = false
    elInp.value = ''
    elInp.placeholder = 'Type your text here'
    renderMeme()
}

function drawLines() {
    const lines = getLines()
    if (!lines || lines.length === 0) return
    lines.forEach(function (line, idx) {
        drawLine(line, idx)
    })
}

function drawLine(line) {
    const txt = line.txt
    gCtx.font = `${line.size}px ${line.fontFamily}`
    gCtx.lineWidth = 2
    gCtx.strokeStyle = line.strokeColor
    gCtx.fillStyle = line.fontColor
    gCtx.textAlign = line.align
    if (!line.x) line.x = gElCanvas.width / 2
    if (!line.y) line.y = gElCanvas.height / 2
    gCtx.fillText(txt, line.x, line.y)
    gCtx.strokeText(txt, line.x, line.y)
    if (line.isSelected) highlightLine()
}

function highlightLine() {
    const isReady = isImageReady()
    console.log(isReady);
    if (isReady) return
    const line = getLine()
    const txt = line.txt
    console.log(txt)
    const textWidth = gCtx.measureText(txt).width
    console.log(textWidth)
    gCtx.beginPath()
    const x = line.x - textWidth
    const y = line.y - line.size * 1.25
    const width = textWidth * 2
    const height = line.size * 2
    gCtx.rect(x, y, width, height)
    gCtx.strokeStyle = 'white'
    gCtx.lineWidth = 2
    gCtx.stroke()
}

function onEditText(elInp) {
    const line = getLine()
    if (!line) return
    const txt = elInp.value
    line.txt = txt
    renderMeme()
}

function onSwitchLine() {
    const elEditLine = document.querySelector('[name="text"]')
    selectLine()
    elEditLine.value = getLine().txt
    renderMeme()
}

function onDeleteLine() {
    const elInp = document.querySelector('[name="text"]')
    deleteLine()
    const lines = getLines()
    elInp.value = ''
    if (!lines || lines.length === 0) elInp.disabled = true
    else elInp.placeholder = 'Type your text here'
    renderMeme()
}

function onSetFontSize(diffSize) {
    setFontSize(diffSize)
    renderMeme()
}

function alignText(alignTo) {
    console.log(alignTo);
    const currLine = getLine()
    currLine.align = alignTo
    renderMeme()
}

function onSetFontFamily(fontFamily) {
    setFontFamily(fontFamily)
    renderMeme()
}

function onColorChange(elColor, isFill) {
    const color = elColor.value
    const elChangeComponent = isFill ? 'font' : 'stroke'
    setColor(color, elChangeComponent)
    renderMeme()
}

function onSaveMeme() {
    readyCanvas()
    const memeDataUrl = gElCanvas.toDataURL('image/jpeg', 0.5)
    getSavedMemes()
    saveMeme(memeDataUrl)
    renderMemes()
    onOpenMemes()
}

/////// לתקן את הבאג מחר או בשבת
function onDownloadMeme(elLink) {
    readyCanvas()
    const imgContent = gElCanvas.toDataURL('image/jpeg', 0.5)
    elLink.href = imgContent
}

function onShareMeme(elForm, ev) {
    readyCanvas()
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        console.log('uploadedImgUrl', uploadedImgUrl);

        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)

        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`)

    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);

    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (response) {
            return response.text()
        })
        .then(onSuccess)
        .catch(function (error) {
            console.error(error)
        })
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return
    setLineDrag(true);
    gStartPos = pos
    document.querySelector('#main-canvas').style.cursor = 'grabbing'
}

function onMove(ev) {
    const line = getLine()
    if (!line) return
    if (line.isDrag) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveLine(dx, dy)
        gStartPos = pos
        renderMeme()
    }
}

function onUp() {
    setLineDrag(false);
    document.querySelector('#main-canvas').style.cursor = 'grab'
}

function addResizeEventListener() {
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
}

function addMouseEventListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchEventListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}
