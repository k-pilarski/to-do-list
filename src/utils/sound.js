export const notificationSound = () => {
    const audioPath = new URL('../../assets/notification.mp3', window.location.href);
    
    let audio =  new Audio(audioPath.href);
    audio.volume = 0.1; 
    audio.play()
        .catch(error => {
                console.error("Audio playback error:", error);
            });
};