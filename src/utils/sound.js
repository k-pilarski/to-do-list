export const notificationSound = () => {
    let audio =  new Audio('/assets/notification.mp3');
    audio.volume = 0.1; 
    audio.play();
};