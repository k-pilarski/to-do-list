export const notificationSound = () => {
    const basePath = window.location.pathname.includes('/to-do-list') 
        ? '/to-do-list'
        : '';
    
    let audio =  new Audio(`${basePath}/assets/notification.mp3`);
    audio.volume = 0.1; 
    audio.play()
};