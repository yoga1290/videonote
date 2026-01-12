import Components from '../views/components';
import TimeUtil from '../utils/TimeUtil';
import UIUtil from '../utils/UIUtil';
import StorageService from '../services/StorageService';

export default BaseController(Components, TimeUtil, UIUtil, StorageService);


function BaseController(components, timeUtil, uiUtil, storageService) {

    const {
        createProgressBarClip,
        createPanel,
        createPanelCard,
        createBookmarkButton,
    } = components;

    const {
        formatTime,
    } = timeUtil;

    const {
        waitForElement
    } = uiUtil;

    const {
        onExportClick,
        onImportClick,
    } = storageService;
    
    let quotes = []; // { startTime, endTime, text, startX, endX }
    let currentStartTime, currentEndTime, startX, endX, currentTranscript;

    let progressBarContainer;
    let panelContainer;
    let playButton;
    let playButtonContainer;

    let transcripts = [];

    let isRecording = false;
    const COL_TEXT = 'Text';
    const COL_URL = 'URL';
    const COL_START_TIME = 'Start time';
    const COL_END_TIME = 'End time';
    const COL_PLATFORM_VIDEO_ID = 'Platform#VideoId';
    const COL_START_X = 'Timeline start';
    const COL_END_X = 'Timeline end';
    const COL_ORDER = [COL_TEXT, COL_URL, COL_PLATFORM_VIDEO_ID,
                        COL_START_TIME, COL_END_TIME, COL_START_X, COL_END_X];
    const CSV_SEPERATOR = '", "';

    let getProgressBarClipXratio = () => ({});
    let getProgressBarActualWidth = () => ({});
    let isVideoPlayingStatus = () => ({});
    let getCurrentVideoTimeInMinutesAndSeconds = () => ({});
    let getServiceIdAndVideoIdAndURL = () => ({});

    let ongoingProgressBarClipInterval = -1;

    const CARD_COLLORS = ['#c94b4b', '#ccc7b0', '#9bb6a1', '#3b7b7a', '#414643'];


    return {
        
        waitForElement,
        initContainers,
    };

    function initContainers(
        _playButton,
        _panelContainer,
        _playButtonContainer,
        _progressBarContainer,
        getTranscript,
        _getProgressBarClipXratio,
        _getProgressBarActualWidth,
        _isVideoPlayingStatus,
        _getCurrentVideoTimeInMinutesAndSeconds,
        _getServiceIdAndVideoIdAndURL,
    ) {

        playButton = _playButton;
        playButtonContainer = _playButtonContainer;
        progressBarContainer = _progressBarContainer;
        panelContainer = _panelContainer;
        getServiceIdAndVideoIdAndURL = _getServiceIdAndVideoIdAndURL;
        
        getTranscript().then((_transcripts) => ( transcripts = _transcripts ) );

        getProgressBarClipXratio = _getProgressBarClipXratio;
        getProgressBarActualWidth = _getProgressBarActualWidth;
        isVideoPlayingStatus = _isVideoPlayingStatus;
        getCurrentVideoTimeInMinutesAndSeconds = _getCurrentVideoTimeInMinutesAndSeconds;

        playButtonContainer.appendChild( createBookmarkButton( onBookmarkClick ) );

        renderUI();
        function onBookmarkClick() {
            setTimeout(
                handleBookmarkClick(), 50);
        }
        tryLoadQuotes();
    }

    function renderOngoingProgressBar(startX, endX, color) {
        const progressWidh = getProgressBarActualWidth();
        progressBarContainer.appendChild(
                    createProgressBarClip(
                        startX * progressWidh + 'px',
                        endX * progressWidh + 'px',
                        color) );
    }
    function renderUI() {

        let panelCards = [];
        progressBarContainer.innerHTML = '';

        const progressWidh = getProgressBarActualWidth();

        const _onImportClick = () => {
            onImportClick().then(()=> {
                console.log('onImportClick OK');
                tryLoadQuotes();
            });
        };
        const onInfoClick = () => (window.open('https://github.com/yoga1290/videonote#readme',
                                                '_blank',
                                                ('vnote-'+new Date().getTime()) ));

        quotes.map((quote, idx) => {
            const color = CARD_COLLORS[idx % CARD_COLLORS.length];
            progressBarContainer.appendChild(
                    createProgressBarClip(
                        quote[COL_START_X] * progressWidh + 'px',
                        quote[COL_END_X] * progressWidh + 'px',
                        color)
                    );
            const deleteCallback = (idx) => (
                () => {
                    quotes.splice(idx, 1);
                    renderUI();
                    trySaveQuotes();
                }
            );
            const bookmarkCallback = ({target})=> {
                quotes[idx][COL_TEXT] = target.value;
                trySaveQuotes();
            };

            panelCards.push( createPanelCard(
                                        quote[COL_TEXT],
                                        quote[COL_START_TIME],
                                        quote[COL_END_TIME],
                                        color, 
                                        quote[COL_URL],
                                        deleteCallback(idx),
                                        bookmarkCallback
                                        ) );
        });
        panelContainer.innerHTML = '';
        panelContainer.appendChild( createPanel( _onImportClick,
                                                onExportClick,
                                                onInfoClick,
                                                panelCards ) );
    } 

    function handleBookmarkClick() {

        setTimeout(handleClick, 50);

        function handleClick() {

            isRecording = !isRecording; //isVideoPlayingStatus();

            const { minutes, seconds, timeInSeconds } = getCurrentVideoTimeInMinutesAndSeconds();
            
            currentStartTime = isRecording? timeInSeconds:currentStartTime;
            currentEndTime = isRecording? currentEndTime:timeInSeconds;

            const clipX = getProgressBarClipXratio();
            startX = isRecording? clipX:startX;

            if(endX==undefined) endX = startX;
            endX = isRecording? endX:clipX;
            
            if (isRecording) {
                clearInterval(ongoingProgressBarClipInterval);
                ongoingProgressBarClipInterval = (
                    setInterval(() => (
                        renderOngoingProgressBar(
                                startX,
                                getProgressBarClipXratio(),
                                CARD_COLLORS[quotes.length % CARD_COLLORS.length])
                        ),
                        500
                ));
            }

            if (!isRecording && currentStartTime <= currentEndTime) {

                currentTranscript = tryUpdateTranscriptInTimeRange(currentStartTime, currentEndTime);

                const { serviceId, videoId, url } = getServiceIdAndVideoIdAndURL(currentStartTime);
                quotes.push({
                    [COL_START_TIME]: formatTime(currentStartTime),
                    [COL_END_TIME]: formatTime(currentEndTime),
                    [COL_TEXT]: currentTranscript,
                    [COL_START_X]: startX,
                    [COL_END_X]: endX,
                    [COL_PLATFORM_VIDEO_ID]: serviceId+'#'+videoId,
                    [COL_URL]: url,
                });
                clearInterval(ongoingProgressBarClipInterval);
                renderUI();
                trySaveQuotes();
            }

            if( !isRecording && isVideoPlayingStatus()) {
                playButton.click();
            }
        }
        

    }

    function tryUpdateTranscriptInTimeRange(start, end) {

        try {
            const valid = (t) => (start <= t && t<=end);
            currentTranscript = transcripts.filter(t => ( valid(t.time) )).map(t => (t.text)).join(' ');
            // document.querySelectorAll('.video-quotes-transcript')[0].innerText = currentTranscript;
            return currentTranscript;
        } catch(e) {}
        return '';
    }

    //#########################################
    //############## Storage Util #############
    //#########################################
    function trySaveQuotes() {
        try {
            const { serviceId, videoId } = getServiceIdAndVideoIdAndURL();
            const key = serviceId + '#' + videoId;
            browser.storage.local.set({[key]: quotes}).then((a) => (console.log(a)));
        } catch(e) {}
    }
    function tryLoadQuotes() {
        try {
            const { serviceId, videoId } = getServiceIdAndVideoIdAndURL();
            const key = serviceId + '#' + videoId;
            browser.storage.local.get(key)
                        .then((data) => {
                            console.log('tryLoadQuotes data', data);
                            quotes = data[key] || [];
                            renderUI();
                        }, (e) => (console.error(e)));
        } catch(e) {console.error(e);}
    }

};
