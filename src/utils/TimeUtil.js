export default TimeUtil();

function TimeUtil() {

    return {
        getTimeInMinutesAndSeconds,
        mapTimeToSecs,
        formatTime,
    };

    function mapTimeToSecs(time) {
        let nums = time.split(':')
                    .filter(v=> (v.match(/[0-9]+/)))
                    .filter( (_, idx) => (idx < 3))
                    .map(v => (parseInt(v)) )
                    .reverse();
        let w = [1, 60, 60 * 60], totalSecs = 0;
        for( let i=0; i<nums.length; i++) {
            totalSecs += w[i] * nums[i];
        }
        return totalSecs;
    }

    function formatTime(timeInSeconds) {
        const {minutes, seconds} = getTimeInMinutesAndSeconds(timeInSeconds);
        return `${minutes}:${seconds}`;
    }

    function getTimeInMinutesAndSeconds(timeInSeconds) {
        let minutes = `${parseInt(timeInSeconds/60)}`;
        minutes = minutes.length <2? `0${minutes}`:minutes;          
        let seconds = `${parseInt(timeInSeconds%60)}`;
        seconds = seconds.length <2? `0${seconds}`:seconds;
        return { minutes, seconds };
    }


}