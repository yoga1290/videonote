import BaseController from './BaseController';
import TimeUtil from '../utils/TimeUtil';
import UIUtil from '../utils/UIUtil';
import Logger from '../utils/Logger';

export default YoutubeController(BaseController, TimeUtil, UIUtil, Logger);

function YoutubeController(baseController, timeUtil, uiUtil, Logger) {

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
    const {
        log
    } = Logger('YoutubeController');

    const SEL_PROGRESS_BAR_CONTAINER = '.style-scope ytd-player .ytp-progress-bar-container';

    // START HERE:
    // Wait for the video bar to initalize
    waitForElement(SEL_PROGRESS_BAR_CONTAINER).then(init);
    function init() {

        var SEL_VIDEO_PLAY_BUTTON = '.ytp-play-button';
        var SEL_BELOW_VIDEO = '#primary-inner #below';
        
        const progressBarContainer = document.createElement('div');

        waitForElement(SEL_PROGRESS_BAR_CONTAINER).then(()=> {
            document.querySelector(SEL_PROGRESS_BAR_CONTAINER).appendChild(progressBarContainer);
        }, ()=>(log(SEL_PROGRESS_BAR_CONTAINER, 'not found')));

        
        const panelContainer = document.createElement('div');
        waitForElement(SEL_BELOW_VIDEO).then(()=> {
            const elParent = document.querySelectorAll(SEL_BELOW_VIDEO)[0];
            elParent.parentElement.insertBefore(panelContainer, elParent);
        }, ()=>(log(SEL_BELOW_VIDEO, 'not found')));
        

        const bookmarkButtonContainer = document.createElement('div');
        bookmarkButtonContainer.style.position = 'absolute';
        let bookmarkButtonContainerParent;
        waitForElement(SEL_VIDEO_PLAY_BUTTON).then(()=> {
            bookmarkButtonContainerParent = document.querySelectorAll(SEL_VIDEO_PLAY_BUTTON)[0];
            bookmarkButtonContainerParent.parentElement.appendChild(bookmarkButtonContainer);
        }, ()=>(log(SEL_VIDEO_PLAY_BUTTON, 'not found')));

        const playButton = document.querySelectorAll(SEL_VIDEO_PLAY_BUTTON)[0];

        initContainers(
            playButton,
            panelContainer,
            bookmarkButtonContainer,
            progressBarContainer,
            getTranscript,
            getProgressBarClipXratio,
            getProgressBarActualWidth,
            isVideoPlayingStatus,
            getCurrentVideoTimeInMinutesAndSeconds,
            getServiceIdAndVideoIdAndURL,
        );
    }

    function isVideoPlayingStatus() {
        var SEL_VIDEO_PLAYING_MODE = '.html5-video-player.playing-mode';
        let isPlaying = document.querySelectorAll(SEL_VIDEO_PLAYING_MODE).length > 0;
        return isPlaying;
    }

    function getProgressBarClipXratio() {
        const SEL_BALL = '.style-scope ytd-player .ytp-progress-bar-container .ytp-scrubber-container';
        const currentX = document.querySelector(SEL_BALL).style.transform.match(/([\d]+)/g)[0];
        const barWidth = getProgressBarActualWidth();
        const percentageX = parseInt(currentX) / barWidth;
        return percentageX;
    }
    
    function getProgressBarActualWidth() {
        const SEL_PROGRESS_BAR = '.style-scope ytd-player .ytp-chrome-bottom';
        return parseInt(
                document.querySelector(SEL_PROGRESS_BAR).style.width.match(/([\d]+)/g)[0] );
    }

    function getCurrentVideoTimeInMinutesAndSeconds() {
        
        var SEL_PROGRESS_BAR = '.ytp-progress-bar';
        var SEL_PROGRESS_BAR_ATT_VALUE = 'aria-valuenow';

        let timeInSeconds = parseInt(document.querySelectorAll(SEL_PROGRESS_BAR)[0].getAttribute(SEL_PROGRESS_BAR_ATT_VALUE) );
        const {minutes, seconds} = getTimeInMinutesAndSeconds(timeInSeconds);
        return { minutes, seconds, timeInSeconds };
    }

    function getServiceIdAndVideoIdAndURL(time=0) {
            let serviceId, videoId, url;
            try {
                const hasYoutube = location.host.match(/(m\.)*youtu(\.be|be\.com)+$/);
                const hasYoutubeVideoQuery = window.location.href.match(/\?.*v\=([^&]*)/);

                if (!!hasYoutube && !!hasYoutubeVideoQuery) {
                    serviceId = 'youtube';
                    videoId = hasYoutubeVideoQuery[1];
                    url = `https://youtu.be/${videoId}?t=${time}`
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
                console.log('getTranscript', e);
                rej(e);} //try
        
        }); //promise
    }


};