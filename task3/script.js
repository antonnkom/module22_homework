const buttonGetDataUser = document.querySelector('#getDataUser');
const elemDataLocation = document.querySelector('#data-location');
const elemDataSize = document.querySelector('#data-size');

const error = () => {
    elemDataLocation.textContent = 'Информация о местоположении недоступна';
}

const succes = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    elemDataLocation.textContent = `Широта ${latitude}°, Долгота ${longitude}°`;
}

const getSize = () => {
    const width = window.screen.width;
    const height = window.screen.height;

    elemDataSize.textContent = `Ширина экрана: ${width}px, Высота экрана ${height}px`;
}

buttonGetDataUser.addEventListener('click', (e) => {
    getSize();

    if (! navigator.geolocation) {
        error();
    } else {
        elemDataLocation.textContent = 'Определение местоположения...';
        navigator.geolocation.getCurrentPosition(succes, error);
    }
});