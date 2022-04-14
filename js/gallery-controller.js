'use strict'

function onGalleryInit() {
    renderImgs()
    renderSearchWords()
}

function renderImgs() {
    const imgs = getImgsForDisplay()
    let strHTMLs = imgs.map(img => {
        return `<img class="meme-img" class="img-${img.id}" src="${img.url}" onclick="onSetImg(${img.id})">`
    })
    document.querySelector('.images-container').innerHTML = strHTMLs.join('')
}

function renderSearchWords() {
    const keyWordMap = getKeyWords()
    const keyWords = Object.keys(keyWordMap)

    let strHTML = keyWords.map(keyWord => {
        const fontSize = keyWordMap[keyWord] + 14
        return `<li class="search-line flex align-center" style="font-size: ${fontSize}px" onclick="onFilter(null, '${keyWord}')"> ${keyWord}</li>`
    })
    document.querySelector('.search-words').innerHTML = strHTML.join('')
}

function onFilter(elInp, value) {
    if (elInp) {
        elInp.value = ''
        elInp.placeholder = 'Search'
    }
    setFilter(value)
    onGalleryInit()
}

function onSetImg(imgId) {
    onOpenEditor()
    initMeme(imgId)
    onEditorInit()
}

function onOpenGallery() {
    setActivePage(document.querySelector('header .gallery'))
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.meme-editor').classList.add('hidden')
    document.querySelector('.gallery-page').classList.remove('hidden')
}

function setActivePage(activePage) {
    const links = document.querySelectorAll('header nav a.active')
    links.forEach(link => {
        link.classList.remove('active')
    })
    if (activePage) activePage.classList.add('active')
}