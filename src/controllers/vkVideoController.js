import BaseController from './BaseController';
import TimeUtil from '../utils/TimeUtil';
import Styles from '../views/style';
import UIUtil from '../utils/UIUtil';


new VKVideoController(BaseController, Styles, TimeUtil, UIUtil);

function VKVideoController(baseController, style, timeUtil, uiUtil) {

    const {
        initContainers,
    } = baseController;
    const {
        getTimeInMinutesAndSeconds,
        mapTimeToSecs,
    } = timeUtil;
    const {
        waitForElement,
    } = uiUtil;

    // const SEL_PROGRESS_BAR_CONTAINER = '.preview-track-horizontally-alinged .player-wrapper .keyboard-controls .wrapper-bottom .enriched-timeline .timeline .timeline-slider .bars .filled';
    const SEL_PROGRESS_BAR_CONTAINER = '.preview-track-horizontally-alinged .player-wrapper .keyboard-controls .wrapper-bottom';
    let shadowDoc;
    // let progressBarContainerElement;
    function waitForProgressBarContainerElement() {
        return new Promise((res, rej) => {
            const shadowEl = '.shadow-root-container';
            const timelineEl = '.preview-track-horizontally-alinged .player-wrapper .wrapper-bottom';

            waitForElement(shadowEl).then(() => {
                const { shadowRoot } = document.querySelectorAll(shadowEl)[0];
                shadowDoc = shadowRoot;
                waitForElement(timelineEl, shadowDoc).then(res, rej);
            }, rej);
        });
    }

    // START HERE:
    // Wait for the video bar to initalize
    waitForProgressBarContainerElement().then(init);
    function init() {

        var SEL_BELOW_VIDEO = '.vkitInternalHeaderLayout';
        
        const progressBarContainer = document.createElement('div');
        shadowDoc.querySelector(SEL_PROGRESS_BAR_CONTAINER).appendChild(progressBarContainer);
        
        const panelContainer = document.createElement('div');
        const elParent = document.querySelectorAll(SEL_BELOW_VIDEO)[0];
        elParent.parentElement.appendChild(panelContainer);

        const playButton = document.querySelectorAll('.shadow-root-container')[0].shadowRoot.querySelectorAll('.preview-track-horizontally-alinged .player-wrapper .keyboard-controls .wrapper-bottom .controls .controls-left .btn-container .tooltip-wrapper button')[0];

        const highlighButtonContainer = document.querySelectorAll('.shadow-root-container')[0].shadowRoot.firstChild;
        const playButtonContainer = document.createElement('div');
        playButtonContainer.style.position = 'absolute';
        highlighButtonContainer.appendChild(playButtonContainer);

        style.init(highlighButtonContainer);

        initContainers(
            playButton,
            panelContainer,
            highlighButtonContainer,
            progressBarContainer,
            getTranscript,
            getProgressBarClipXratio,
            getProgressBarActualWidth,
            isVideoPlayingStatus,
            getCurrentVideoTimeInMinutesAndSeconds,
            getServiceIdAndVideoIdAndURL
        );
    }

    function isVideoPlayingStatus() {
        let isPlaying = document.querySelectorAll('.shadow-root-container')[0]
                            .shadowRoot.querySelectorAll(
                                '.preview-track-horizontally-alinged .player-wrapper .keyboard-controls .wrapper-bottom .controls .controls-left .tooltip-wrapper button.btn svg[data-testid="play-icon"]').length > 0;
        return isPlaying;
    }

    let _progressBarClipXratio;
    function getProgressBarClipXratio() {
        const elBall = document.querySelectorAll('.shadow-root-container')[0].shadowRoot.querySelectorAll('.preview-track-horizontally-alinged .player-wrapper .keyboard-controls .wrapper-bottom .handleWrap')[0];
        const value = parseInt( elBall.style.transform.match(/\((\d*).*\)/)[1] ) / 100;
        _progressBarClipXratio = value>=1? _progressBarClipXratio: value;
        return _progressBarClipXratio;
    }
    function getProgressBarActualWidth() {
        return document.querySelectorAll('.shadow-root-container')[0].shadowRoot.querySelectorAll('.preview-track-horizontally-alinged .player-wrapper .keyboard-controls .wrapper-bottom')[0].offsetWidth;
    }

    function getCurrentVideoTimeInMinutesAndSeconds() {
        
        const timeInSeconds = mapTimeToSecs(
            document.querySelectorAll('.shadow-root-container')[0].shadowRoot.querySelector('.preview-track-horizontally-alinged .player-wrapper .keyboard-controls .wrapper-bottom .controls .controls-left .time .current').innerText);

            const {minutes, seconds} = getTimeInMinutesAndSeconds(timeInSeconds);
        return { minutes, seconds, timeInSeconds };
    }

    function getServiceIdAndVideoIdAndURL(time=0) {
        let serviceId, videoId, url;
        try {
            const hasVKVideo = location.host.match(/vkvideo\.ru$/);
            const hasVKVideoQuery = window.location.href.match(/.*vkvideo\.ru\/video([^\/]*)/);

            if (!!hasVKVideo && !!hasVKVideoQuery) {
                serviceId = 'vkvideo';
                videoId = hasVKVideoQuery[1];
                url = `https://vkvideo.ru/video${videoId}?t=${time}`
            }

        } catch(e) {console.error(e);}
        return { serviceId, videoId, url };
    }

    function getTranscript() { //TODO

        var SEL_TRANSCRIPT_TEXT = '.ytd-transcript-segment-renderer .segment-text';
        var SEL_TRANSCRIPT_TIME = '.ytd-transcript-segment-renderer .segment-timestamp';
        var SEL_TRANSCRIPT_SHOW_BUTTON = '.ytd-video-description-transcript-section-renderer button';

        return new Promise((res, rej) => {

            try {
                waitForElement(SEL_TRANSCRIPT_SHOW_BUTTON).then(() => {
                    document.querySelectorAll(SEL_TRANSCRIPT_SHOW_BUTTON)[0].click();
                }); //waitfor SEL_TRANSCRIPT_SHOW_BUTTON

                waitForElement(SEL_TRANSCRIPT_TIME).then(()=>{
    
                    var timeSegments = document.querySelectorAll(SEL_TRANSCRIPT_TIME);
                    var textSegments = document.querySelectorAll(SEL_TRANSCRIPT_TEXT);

                    var transacripts = [];
                    for(let i=0; i< textSegments.length; i++) {

                        transacripts.push({
                            time: mapTimeToSecs(timeSegments[i].innerText),
                            text: textSegments[i].innerText
                        });

                    }
                    res(transacripts);
                }); //waitfor SEL_TRANSCRIPT_TIME
            } catch(e){
                rej(e);} //try
        
        }); //promise
    }


};