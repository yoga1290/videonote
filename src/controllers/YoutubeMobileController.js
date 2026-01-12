import BaseController from './BaseController';
import TimeUtil from '../utils/TimeUtil';
import UIUtil from '../utils/UIUtil';
import Logger from '../utils/Logger';

new YoutubeMobileController(BaseController, TimeUtil, UIUtil, Logger);

function YoutubeMobileController(baseController, timeUtil, uiUtil, Logger) {

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
    } = Logger('YoutubeMobileController');

    const SEL_PROGRESS_BAR_CONTAINER = 'yt-progress-bar-line'; //'yt-progress-bar';//'.style-scope ytd-player .ytp-progress-bar-container';
    const SEL_VIDEO_PLAYER_CONTAINER = '.player-container';

    // START HERE:
    // Wait for the video bar to initalize
    let playerClicked = false;
    waitForElement(SEL_VIDEO_PLAYER_CONTAINER).then(() => (
        document.querySelector(SEL_VIDEO_PLAYER_CONTAINER).addEventListener('click', ()=> {
            if (!!playerClicked) return;
            playerClicked = true;
            waitForElement(SEL_PROGRESS_BAR_CONTAINER).then(init);
        })
    ));
    function init() {

        var SEL_VIDEO_PLAY_BUTTON = '.player-control-play-pause-icon';
        var SEL_BELOW_VIDEO = '.slim-video-metadata-header';

        const progressBarContainer = document.createElement('div');
        waitForElement(SEL_PROGRESS_BAR_CONTAINER).then(()=> {
            const progressBar = document.querySelector(SEL_PROGRESS_BAR_CONTAINER);
            progressBar.insertBefore(progressBarContainer, progressBar.lastChild);
        }, ()=>(log(SEL_PROGRESS_BAR_CONTAINER, 'not found')));

        
        const panelContainer = document.createElement('div');
        waitForElement(SEL_BELOW_VIDEO).then(()=> {
            const elParent = document.querySelectorAll(SEL_BELOW_VIDEO)[0];
            elParent.parentElement.appendChild(panelContainer);
        }, ()=>(log(SEL_BELOW_VIDEO, 'not found')));
        

        const bookmarkButtonContainer = document.createElement('div');
        bookmarkButtonContainer.style.position = 'absolute';
        let bookmarkButtonContainerParent;
        waitForElement(SEL_VIDEO_PLAYER_CONTAINER).then(()=> {
            bookmarkButtonContainerParent = document.querySelectorAll(SEL_VIDEO_PLAYER_CONTAINER)[0];
            bookmarkButtonContainerParent.appendChild(bookmarkButtonContainer);
        }, ()=>(log(SEL_VIDEO_PLAYER_CONTAINER, 'not found')));

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
        const SEL_BALL = '.ytProgressBarLineProgressBarPlayed';
        const currentX = document.querySelector(SEL_BALL).style.width.match(/([\d\.]+)/g)[0];
        const percentageX = parseInt(currentX) / 100;
        return percentageX;
    }
    
    function getProgressBarActualWidth() {
        return document.querySelector('.ytPlayerProgressBarProgressBar').offsetWidth;
    }

    function getCurrentVideoTimeInMinutesAndSeconds() {
        
        var SEL_CURRENT_TIME = '.ytwPlayerTimeDisplayPill span[role="text"]';

        let timeInSeconds = mapTimeToSecs(document.querySelectorAll(SEL_CURRENT_TIME)[0].innerText );
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
                rej(e);} //try
        
        }); //promise
    }
    


//    init();//TODO


};