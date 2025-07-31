export const notificationSound = () => {
    const basePath = window.location.pathname.includes('/to-do-list') 
        ? '/nazwa-repozytorium'
        : '';
    
    let audio =  new Audio(`${basePath}/notification.mp3`);
    audio.volume = 0.1; 
    audio.play()
};