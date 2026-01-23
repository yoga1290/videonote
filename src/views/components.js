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
        const elDiv = document.createElement('div');
        elDiv.style.border = `5px solid ${clipColor}`;
        elDiv.style.position = 'absolute';
        elDiv.style.top = '0rem';
        elDiv.style.left = clipStart;
        elDiv.style.width = `calc(${clipEnd} - ${clipStart})`;
        return elDiv;
    }

    function createPanel(
            onImportClick,
            onExportClick,
            onInfoClick,
            panelCards,
            ) {

        const importButton = el(
                                `${CSS_CLASS_MENU_BUTTON} ${CSS_CLASS_MENU_BUTTON_IMPORT}`, [
                                    elGMIcon('upload'),
                                    el('', [], 'Import')
                                ]);
        importButton.addEventListener('click', onImportClick);

        const exportButton = el(
                                `${CSS_CLASS_MENU_BUTTON} ${CSS_CLASS_MENU_BUTTON_EXPORT}`, [
                                    elGMIcon('download'),
                                    el('', [], 'Export')
                                ]);
        exportButton.addEventListener('click', onExportClick);

        const infoButton = el(CSS_INFO_BUTTON,
                            [elGMIcon('info')]);
        infoButton.addEventListener('click', onInfoClick);

        const elDiv = el('', [
            el(CSS_CLASS_MENU, [
                importButton,
                exportButton,
                infoButton
            ]),
            el(CSS_CLASS_PANEL,
                panelCards
            )
        ]);

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

        const elDiv = el(
            CSS_CLASS_PANEL_CARD,
            [el(
                CSS_CLASS_PANEL_CARD_TIME, [],
                startTime,
            ), el(
                CSS_CLASS_PANEL_CARD_TIME, [],
                endTime,
            ), el(
                CSS_CLASS_PANEL_TEXT, [],
                cardText,
                'textarea'
            ),
            buttonContainer()]
        );
        elDiv.style.backgroundColor = backgroundColor;
        elDiv.querySelector(`.${CSS_CLASS_PANEL_TEXT}`).addEventListener('keyup', onTextChange);

        function buttonContainer() {
            const elDeleteButton = el(CSS_CLASS_PANEL_DELETE_BUTTON, [
                                    elGMIcon('delete')
                                ], '', 'button');
            elDeleteButton.addEventListener('click', deleteCallback);

            const elPlayButton = el(CSS_CLASS_PANEL_PLAY_BUTTON, [
                                        elGMIcon('play_arrow')
                                    ], '', 'a');
            elPlayButton.href = playURL;

            const buttonContainer = el('', [
                elDeleteButton,
                elPlayButton,
            ]);
            buttonContainer.style.display = 'inline-block';
            buttonContainer.style.maxWidth = '100%';
            return buttonContainer;
        }

        return elDiv;
    }

    function createBookmarkButton(onClick) {

        const bookmarkStartButton = el(
            `${CSS_CLASS_BOOKMARK_BUTTON} ${CSS_CLASS_MENU_BUTTON} ${CSS_CLASS_MENU_BUTTON_BOOKMARK_START}`,
            [elGMIcon('bookmark_add'), el('',[], 'Bookmark')],
        );
        const bookmarkEndButton = el(
            `${CSS_CLASS_BOOKMARK_BUTTON} ${CSS_CLASS_MENU_BUTTON} ${CSS_CLASS_MENU_BUTTON_BOOKMARK_OK}`,
            [elGMIcon('bookmark_added'), el('',[], 'OK')],
        );
        
        const setStyle = (el) => {
            el.style.position = 'relative';
            el.style.top = '-11rem';
            el.style.height = '2rem';
            el.style.fontSize = '1.5rem';
            el.style.color = 'white';
            el.style.display = 'inline-flex';
            el.style.pointer = 'cursor';
            el.style.border = '5px solid black';
        };
        setStyle(bookmarkStartButton);
        setStyle(bookmarkEndButton);
        bookmarkStartButton.style.backgroundColor = '#4CAF50';
        bookmarkEndButton.style.backgroundColor = 'rgb(201, 75, 75)';
        
        bookmarkEndButton.style.display = 'none';
        bookmarkStartButton.addEventListener('click', () => {
            bookmarkStartButton.style.display = 'none';
            bookmarkEndButton.style.display = 'inline-flex';
            onClick();
        });
        bookmarkEndButton.addEventListener('click', () => {
            bookmarkStartButton.style.display = 'inline-flex';
            bookmarkEndButton.style.display = 'none';
            onClick();
        });

        const elDiv = el(
            CSS_CLASS_BOOKMARK_BUTTON_CONTAINER, [
                bookmarkStartButton,
                bookmarkEndButton,
            ],
        );
        return elDiv;
    }

    function elGMIcon(iconName) {
        return el('material-symbols-outlined', [], iconName, 'span');
    }

    function el(className='',
                children = [],
                textContent='',
                elementTag='div', ) {
        // SEE https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Safely_inserting_external_content_into_a_page
        const el = document.createElement(elementTag);
        el.className = className;
        el.textContent = textContent;
        children.map(child => el.appendChild(child));
        return el;
    }

};