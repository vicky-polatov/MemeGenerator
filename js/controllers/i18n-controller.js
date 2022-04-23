'use strict'

function renderTrans() {
    const elements = document.querySelectorAll('[data-trans]')
    elements.forEach(el => {
        const transKey = el.dataset.trans
        if (el.nodeName === "INPUT") el.placeholder = getTrans(transKey)
        else el.innerText = getTrans(transKey)
    })
}

function onSetLang(elBtn) {
    const currLang = getCurrLang()
    if (currLang === 'en') elBtn.innerText = 'עברית'
    else if (currLang === 'es') elBtn.innerText = 'English'
    else elBtn.innerText = 'Español'
    setLang()
    renderTrans()
}

