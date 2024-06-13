const buttonTimezone = document.querySelector('#getDataTime');
const elemTimeZone = document.querySelector('#time-zone');
const elemTimeLocation = document.querySelector('#time-location');

const useRequest = (latitude, longitude) => {
    return fetch(`https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat=${latitude}&long=${longitude}`)
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            elemTimeZone.textContent = `Временная зона, в которой находится пользователь: ${result.timezone}`;
            elemTimeLocation.textContent = `Местные дата и время: ${result.date_time}`;
        })
        .catch((error) => {
            console.log(error);
        });
};

function getPosition() {
    return new Promise((resolve, reject) => {
        let coords = {
            latitude: null,
            longitude: null,
            error: false
        }

        const success = (position) => {
            coords.latitude = position.coords.latitude;
            coords.longitude = position.coords.longitude;
            resolve(coords);
        };

        const error = (error) => {
            elemTimeZone.textContent = 'Информация о местоположении недоступна';
            elemTimeLocation.textContent = '';
            reject(error);
        };

        navigator.geolocation.getCurrentPosition(success, error);
    });
}

buttonTimezone.addEventListener('click', async(e) => {
    e.preventDefault();
    elemTimeZone.textContent = 'Получение данных...';
    
    let coords = await getPosition()
        .then((coords) => {
            if (! coords.error) {
                return coords;
            }
        });
    
    if (! coords.error) {
        await useRequest(coords.latitude, coords.longitude);
    }
});