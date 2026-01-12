import './style.scss';
export default Styles();

function Styles() {

    const CSS_CLASS_PANEL = 'vnote-panel';
    const CSS_CLASS_PANEL_CARD = 'vnote-panel__card';
    const CSS_CLASS_PANEL_TEXT = 'vnote-panel__text';
    const CSS_CLASS_PANEL_DELETE_BUTTON = 'vnote-panel__delete-button';
    const CSS_CLASS_PANEL_PLAY_BUTTON = 'vnote-panel__play-button';
    const CSS_CLASS_PANEL_CARD_TIME = 'vnote-panel__time';
    const CSS_CLASS_MENU = 'vnote-panel-menu';
    const CSS_INFO_BUTTON = 'vnote-panel__info-button';
    const CSS_CLASS_MENU_BUTTON = 'vnote-panel-menu__button';
    const CSS_CLASS_MENU_BUTTON_BOOKMARK_START = 'vnote-bookmark__start-button';
    const CSS_CLASS_MENU_BUTTON_BOOKMARK_OK = 'vnote-bookmark__ok-button';
    const CSS_CLASS_MENU_BUTTON_IMPORT = 'CSS_CLASS_MENU_BUTTON_IMPORT';
    const CSS_CLASS_MENU_BUTTON_EXPORT = 'CSS_CLASS_MENU_BUTTON_EXPORT';
    const CSS_CLASS_BOOKMARK_BUTTON = 'vnote-bookmark__button';
    const CSS_CLASS_BOOKMARK_BUTTON_CONTAINER = 'vnote-bookmark';


    init();
    return {
        init,
        CSS_INFO_BUTTON,
        CSS_CLASS_PANEL,
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
    };
 
    function init(elContainer = window.document.body) {

        var elGoogleIcons = document.createElement('link');
        elGoogleIcons.rel = 'stylesheet';
        elGoogleIcons.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
        elContainer.appendChild(elGoogleIcons);
    }
};