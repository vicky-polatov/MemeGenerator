
function highlightLine() {
    if (gIsDownloadable) return
    const line = getLine()
    const txt = line.txt
    const textWidth = gCtx.measureText(txt).width
    gCtx.beginPath()
    const x = line.x - textWidth
    const y = line.y - line.size * 1.25
    const width = textWidth * 2
    const height = line.size * 2
    console.log(line.x);
    console.log(line.y);


    line.coords = {
        x,
        y,
        xEnd: width,
        yEnd: height
    }

    // line.coords = {
    //     x: line.x - textWidth / 2 - 10,
    //     y: line.y - line.size / 2 - 10,
    //     xEnd: line.x + textWidth / 4,
    //     yEnd: line.y + line.size / 4 - 10
    // }

    // gCtx.rect(line.x - textWidth / 2 - 10, line.y - line.size / 2 - 10, line.x + textWidth / 8, line.y + line.size)
    gCtx.rect(x, y, width, height)
    gCtx.strokeStyle = 'white'
    gCtx.lineWidth = 2
    gCtx.stroke()
}

///////////////////////////////////////////////////
function onDown(ev) {
    const pos = getEvPos(ev)
    console.log(pos, 'position');
    let selectedIdx = gMeme.lines.findIndex(line => {
        console.log(line.coords);
        return (pos.x > line.coords.x &&
            pos.x < line.coords.xEnd &&
            pos.y > line.coords.y &&
            pos.y < line.coords.yEnd)
    })
    console.log(selectedIdx);
    if (selectedIdx !== -1) {
        setLineDrag(true)
        gMeme.selectedLineIdx = selectedIdx
        renderMeme()
        gStartPos = pos
        document.querySelector('#main-canvas').style.cursor = 'grabbing'
    }
}


// function onDown(ev) {
//     const pos = getEvPos(ev)
//     if (!isLineClicked(pos)) return
//     setLineDrag(true);
//     gStartPos = pos
//     document.querySelector('#main-canvas').style.cursor = 'grabbing'
// }

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
    // setLineDrag(false);
    ////////////////////////////////////
    gMeme.lines[gMeme.selectedLineIdx].isDrag = false
    document.querySelector('#main-canvas').style.cursor = 'grab'
}


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


function isLineClicked(clickedPos) {
    const currLine = getLine()

    const textWidth = gCtx.measureText(currLine.txt).width
    const x = currLine.x - textWidth / 2
    const xEnd = currLine.x + textWidth * 2
    const y = currLine.y - currLine.size / 1.25
    const yEnd = currLine.y + currLine.size * 1.25

    return (clickedPos.x > x && clickedPos.x < xEnd && clickedPos.y > y && clickedPos.y < yEnd)

    // const distance = Math.sqrt((currLine.x - clickedPos.x) ** 2 + (currLine.y - clickedPos.y) ** (-2))
    // return distance <= currLine.size
}