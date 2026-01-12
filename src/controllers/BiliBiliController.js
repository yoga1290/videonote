import BaseController from './BaseController';
import TimeUtil from '../utils/TimeUtil';
import UIUtil from '../utils/UIUtil';

new BiliBiliController(BaseController, TimeUtil, UIUtil);

// export BiliBiliController();
function BiliBiliController(baseController, timeUtil, uiUtil) {

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

    const SEL_PROGRESS_BAR_CONTAINER = '.bui-track-video-progress';

    // START HERE:
    // Wait for the video bar to initalize
    waitForElement(SEL_PROGRESS_BAR_CONTAINER).then(init);
    function init() {

        var SEL_VIDEO_PLAY_BUTTON = '.player-mobile-control-btn';
        var SEL_BELOW_VIDEO = '.video-play__meta';
        
        const progressBarContainer = document.createElement('div');
        document.querySelector(SEL_PROGRESS_BAR_CONTAINER).appendChild(progressBarContainer);
        
        const panelContainer = document.createElement('div');
        const elParent = document.querySelectorAll(SEL_BELOW_VIDEO)[0];
        elParent.appendChild(panelContainer);

        const playButton = document.querySelectorAll(SEL_VIDEO_PLAY_BUTTON)[0];
        const playButtonContainer = document.createElement('div');
        playButtonContainer.style.position = 'absolute';
        const playButtonContainerParent = document.querySelectorAll(SEL_VIDEO_PLAY_BUTTON)[0];
        playButtonContainerParent.parentElement.appendChild(playButtonContainer);

        initContainers(
            playButton,
            panelContainer,
            playButtonContainer,
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
        var SEL_VIDEO_PLAYING_MODE = '.player-mobile-play-icon.player-mobile-active';
        let isPlaying = document.querySelectorAll(SEL_VIDEO_PLAYING_MODE).length > 0;
        return isPlaying;
    }

    function getProgressBarClipXratio() {
        const SEL_BALL = '.bui-track-video-progress .bui-bar-wrap .bui-bar-normal';
        const currentX = document.querySelector(SEL_BALL).style.transform.match(/([\d\.]+)/g)[0];
        return currentX;
    }
    
    function getProgressBarActualWidth() { //TODO
        const SEL_PROGRESS_BAR = '.bui-track-video-progress';
        return document.querySelector(SEL_PROGRESS_BAR).offsetWidth;
    }

    function getCurrentVideoTimeInMinutesAndSeconds() {
        
        var SEL_PROGRESS_BAR_TIME = '.player-mobile-time-current-text';

        let timeInSeconds = mapTimeToSecs(document.querySelectorAll(SEL_PROGRESS_BAR_TIME)[0].innerText);
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
    


//    init();//TODO


};