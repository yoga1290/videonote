import Styles from '../views/style';
export default Components(Styles);

function Components(style) {

    const {
        CSS_CLASS_PANEL,
        CSS_INFO_BUTTON,
        CSS_CLASS_PANEL_CARD,
        CSS_CLASS_PANEL_TEXT,
        CSS_CLASS_PANEL_CARD_TIME,
        CSS_CLASS_PANEL_DELETE_BUTTON,
        CSS_CLASS_PANEL_PLAY_BUTTON,
        CSS_CLASS_MENU,
        CSS_CLASS_MENU_BUTTON,
        CSS_CLASS_MENU_BUTTON_BOOKMARK_START,
        CSS_CLASS_MENU_BUTTON_BOOKMARK_OK,
        CSS_CLASS_MENU_BUTTON_IMPORT,
        CSS_CLASS_MENU_BUTTON_EXPORT,
        CSS_CLASS_BOOKMARK_BUTTON,
        CSS_CLASS_BOOKMARK_BUTTON_CONTAINER,
    } = style;

   return {
   	createProgressBarClip,
   	createPanel,
    createPanelCard,
    createBookmarkButton
   };

    function createProgressBarClip(clipStart, clipEnd, clipColor) {

        const progressBarClipStyle = `
            border: 5px solid ${clipColor};
            position: absolute;
            top: 0rem;
            left: ${clipStart};
            width: calc(${clipEnd} - ${clipStart});
        `.replace(/\ \ /g,'').split('\n').join('');

        const progressBarClipHTML = `
            <div style="${progressBarClipStyle}">
            </div>
        `.replace(/\ \ /g,'');

        var elDiv = document.createElement("div");
        elDiv.innerHTML = progressBarClipHTML;
        return elDiv;
    }

    function createPanel(
            onImportClick,
            onExportClick,
            onInfoClick,
            panelCards,
            ) {

        let panelHTML = `
            <div class="${CSS_CLASS_MENU}">
                <div class="${CSS_CLASS_MENU_BUTTON} ${CSS_CLASS_MENU_BUTTON_IMPORT}">
                    <span class="material-symbols-outlined">upload</span>
                    Import </div>
                <div class="${CSS_CLASS_MENU_BUTTON} ${CSS_CLASS_MENU_BUTTON_EXPORT}">
                    <span class="material-symbols-outlined">download</span>
                    Export </div>
                <div class="${CSS_INFO_BUTTON}">
                    <span class="material-symbols-outlined">info</span>
                    </div>
            </div>

            <div
                class="${CSS_CLASS_PANEL}">
                </div>`.replace(/\ \ /g,'');

        var elDiv = document.createElement("div");
        elDiv.innerHTML = panelHTML;
        elDiv.querySelector('.' + CSS_CLASS_MENU_BUTTON_IMPORT).addEventListener('click', onImportClick);
        elDiv.querySelector('.' + CSS_CLASS_MENU_BUTTON_EXPORT).addEventListener('click', onExportClick);
        elDiv.querySelector('.' + CSS_INFO_BUTTON).addEventListener('click', onInfoClick);
        panelCards.map(pCard => ( elDiv.lastChild.appendChild(pCard) ));
        return elDiv;
    }


    function createPanelCard(
                    cardText,
                    startTime='',
                    endTime='',
                    backgroundColor='#583535',
                    playURL='#',
                    deleteCallback=()=>{},
                    onTextChange=()=>{}) {

        let cardHTML = `
            <div class="${CSS_CLASS_PANEL_CARD_TIME}"> ${startTime} </div>
            <div class="${CSS_CLASS_PANEL_CARD_TIME}"> ${endTime} </div>
            
            <textarea class="${CSS_CLASS_PANEL_TEXT}">${cardText}</textarea>
            
            <div style="display: inline-block; max-width: 100%;">

                <button class="${CSS_CLASS_PANEL_DELETE_BUTTON}">
                    <span style="font-size:2rem" class="material-symbols-outlined">delete</span>
                </button>
            
                <a class="${CSS_CLASS_PANEL_PLAY_BUTTON}" href=${playURL}>
                    <span style="font-size:2rem" class="material-symbols-outlined">play_arrow</span>
                </a>
            
            </div>`.replace(/\ \ /g,'');

        var elDiv = document.createElement("div");
        elDiv.className = CSS_CLASS_PANEL_CARD;
        elDiv.style.backgroundColor = backgroundColor;
        elDiv.innerHTML = cardHTML;
        elDiv.querySelector(`.${CSS_CLASS_PANEL_DELETE_BUTTON}`).addEventListener('click', deleteCallback);
        elDiv.querySelector(`.${CSS_CLASS_PANEL_TEXT}`).addEventListener('keyup', onTextChange);
        return elDiv;
    }

    function createBookmarkButton(onClick) {
        const quoteButtonHTML = `
            <div class="${CSS_CLASS_BOOKMARK_BUTTON} ${CSS_CLASS_MENU_BUTTON} ${CSS_CLASS_MENU_BUTTON_BOOKMARK_START}">
                <span style="font-size:2rem" class="material-symbols-outlined">bookmark_add</span>
                Bookmark </div>
            <div class="${CSS_CLASS_BOOKMARK_BUTTON} ${CSS_CLASS_MENU_BUTTON} ${CSS_CLASS_MENU_BUTTON_BOOKMARK_OK}">
                <span style="font-size:2rem" class="material-symbols-outlined">bookmark_added</span>
                OK </div>
        `;
        const elDiv = document.createElement('div');
        elDiv.innerHTML = quoteButtonHTML;
        elDiv.className = CSS_CLASS_BOOKMARK_BUTTON_CONTAINER;
        const bookmarkStartButton = elDiv.querySelector('.'+CSS_CLASS_MENU_BUTTON_BOOKMARK_START);
        const bookmarkEndButton = elDiv.querySelector('.'+CSS_CLASS_MENU_BUTTON_BOOKMARK_OK);

        bookmarkEndButton.style.display = 'none';
        bookmarkStartButton.addEventListener('click', () => {
            bookmarkStartButton.style.display = 'none';
            bookmarkEndButton.style.display = '';
        });
        bookmarkEndButton.addEventListener('click', () => {
            bookmarkStartButton.style.display = '';
            bookmarkEndButton.style.display = 'none';
        });
        elDiv.querySelectorAll('.'+CSS_CLASS_BOOKMARK_BUTTON).forEach(el=>( el.addEventListener('click', onClick) ));
        
        return elDiv;
    }

};