'use strict'

let gElCanvas = document.querySelector('#main-canvas')
let gCtx = gElCanvas.getContext('2d')
let gIsDownloadable = false

function onEditorInit() {
    gIsDownloadable = false;
    addResizeEventListener()
    addMouseEventListeners()
    addTouchEventListeners()
    resizeCanvas()
    renderMeme()
    handleTextInp()
    doTrans()
}

function onOpenEditor() {
    document.querySelector('.meme-editor').classList.remove('hidden')
    document.querySelector('.gallery-page').classList.add('hidden')
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.trans-btn-container').classList.add('hidden')
    setActivePage()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = 0
    gElCanvas.height = 0
    gElCanvas.width = elContainer.offsetWidth - 10
    gElCanvas.height = elContainer.offsetHeight - 10
}

function renderMeme() {
    // clearCanvas()
    const meme = getMeme()
    const img = new Image()

    if (!meme.selectedImgId) {
        if (!gUserImg) return
        img.src = gUserImg.src
    } else {
        img.src = `img/meme-imgs-square/${meme.selectedImgId}.jpg`
    }

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawLines()
    }

}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onAddLine() {
    const lang = getLang()
    let txt
    if (lang === 'he') txt = 'הטקסט שלך'
    else if (lang === 'es') txt = 'Tu texto'
    else txt = 'your text'

    const elInp = document.querySelector('[name="text"]')
    addLine(txt, gElCanvas.width / 10)
    const lines = getLines()
    if (lines.length === 1) lines[0].y = 80
    else if (lines.length === 2) lines[1].y = gElCanvas.height - 80
    selectLine()
    elInp.disabled = false
    elInp.value = ''
    doTrans()
    renderMeme()
}

function handleTextInp() {
    const elInp = document.querySelector('[name="text"]')
    if (getMeme().lines.length === 0) {
        elInp.disabled = true
        elInp.value = ''
    }
    else {
        elInp.disabled = false
        elInp.value = elInp.value = gMeme.lines[gMeme.selectedLineIdx].txt
    }
}

function drawLines() {
    const lines = getLines()
    if (!lines || lines.length === 0) return
    lines.forEach(function (line, idx) {
        drawLine(line, idx)
    })
}

function drawLine(line) {
    gCtx.font = `${line.size}px ${line.fontFamily}` //
    gCtx.lineWidth = 2 //
    gCtx.strokeStyle = line.strokeColor // 
    gCtx.fillStyle = line.fontColor // 
    gCtx.textAlign = line.align //

    if (!line.x) line.x = gElCanvas.width / 2
    if (!line.y) line.y = gElCanvas.height / 2

    gCtx.beginPath()
    gCtx.fillText(line.txt, line.x, line.y)
    gCtx.strokeText(line.txt, line.x, line.y)
    gCtx.closePath()
    if (line.isSelected) highlightLine()
}

function highlightLine() {
    if (gIsDownloadable) return
    const line = getLine()
    const textWidth = gCtx.measureText(line.txt)
    gCtx.beginPath()
    const x = line.x - (textWidth.width / 2) - 5
    const y = line.y - parseInt(line.size) + 1
    const width = textWidth.width + 10
    const height = textWidth.fontBoundingBoxAscent + textWidth.fontBoundingBoxDescent
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
}

function onColorChange(elColor, isFill) {
    const color = elColor.value
    const elChangeComponent = isFill ? 'font' : 'stroke'
    setColor(color, elChangeComponent)
    renderMeme()
}

function onSaveMeme(elLink, ev) {
    if (gIsDownloadable) return gIsDownloadable = false
    ev.preventDefault()
    gIsDownloadable = true
    renderMeme()
    setTimeout(function () {
        const memeDataUrl = gElCanvas.toDataURL('image/jpeg', 0.5)
        getSavedMemes()
        saveMeme(memeDataUrl)
        renderMemes()
        onOpenMemes()
        elLink.click()
        // renderMeme()
    }, 0)
}

function onDownloadMeme(elLink, ev) {
    if (gIsDownloadable) return gIsDownloadable = false
    ev.preventDefault()
    gIsDownloadable = true
    renderMeme()
    setTimeout(function () {
        const imgContent = gElCanvas.toDataURL('image/jpeg', 0.5)
        elLink.href = imgContent
        elLink.click()
        renderMeme()
    }, 0)
}

function onShareMeme(elLink, ev) {
    if (gIsDownloadable) return gIsDownloadable = false
    ev.preventDefault()
    gIsDownloadable = true
    renderMeme()
    setTimeout(function () {
        share()
        elLink.click()
        renderMeme()
    }, 0)
}

function share() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        console.log('uploadedImgUrl', uploadedImgUrl);

        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)

        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`)

    }

    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {
    var formData = new FormData();
    formData.append("img", imgDataUrl)

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
    ev.preventDefault
    const pos = getEvPos(ev)
    isLineClicked(pos)
    if (gMeme.selectedLineIdx !== -1) {
        setLineDrag(true)
        document.querySelector('#main-canvas').style.cursor = 'grabbing'
    }
    gStartPos = pos
}

function onMove(ev) {
    ev.preventDefault()
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

