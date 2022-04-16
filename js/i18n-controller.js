'use strict'

const gTrans = {
    gallery: {
        en: 'Gallery',
        es: 'galería',
        he: 'גלריה',
    },
    memes: {
        en: 'Memes',
        es: 'Memés',
        he: 'ממים',
    },
    'search-all': {
        en: 'all',
        es: 'todos',
        he: 'הכל',
    },
    'search-baby': {
        en: 'baby',
        es: 'Bebés',
        he: 'תינוקות',
    },
    'search-animals': {
        en: 'animals',
        es: 'animales',
        he: 'בעלי חיים'
    },
    'search-cute': {
        en: 'cute',
        es: 'encantadores',
        he: 'מתוקים'
    },
    'search-celebs': {
        en: 'celebs',
        es: 'famosos',
        he: 'מפורסמים',
    },
    search: {
        en: 'search',
        es: 'buscar',
        he: 'חיפוש',
    },
    text: {
        en: 'Type your text here',
        es: 'Escriba aquí',
        he: 'הקלד כאן',
    },
    share: {
        en: 'Share',
        es: 'Compartir',
        he: 'שיתוף',
    },
    download: {
        en: 'Download',
        es: 'Descargar',
        he: 'הורדה',
    },
    save: {
        en: 'Save',
        es: 'Guardar',
        he: 'שמור',
    },
    "saved-memes-msg": {
        en: 'NO MEME HAS BEEN SAVED YET',
        es: 'No hay memés guardados',
        he: 'לא קיימים ממים שמורים',
    }
}

let gCurrLang = 'en'


function getTrans(transKey) {
    const key = gTrans[transKey]
    if (!key) return 'UNKNOWN'
    const translate = key[gCurrLang]
    if (!translate) return key['en']
    return translate
}


function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    console.log(els);

    els.forEach(el => {
        const transKey = el.dataset.trans

        if (el.nodeName === "INPUT") {
            el.placeholder = getTrans(transKey)
        } else {
            el.innerText = getTrans(transKey)
        }
    })
}


function setLang(elBtn) {
    if (gCurrLang === 'en') {
        gCurrLang = 'es'
        elBtn.innerText = 'עברית'
    } else if (gCurrLang === 'es') {
        gCurrLang = 'he'
        document.body.classList.add('rtl')
        elBtn.innerText = 'English'
    } else {
        gCurrLang = 'en'
        document.body.classList.remove('rtl')
        elBtn.innerText = 'Español'
    }

    doTrans()
}

function getLang() {
    return gCurrLang
}

