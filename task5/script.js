const wsUri = "wss://echo.websocket.org/";
const inputMessage = document.querySelector('#message');
const buttonSendMessage = document.querySelector('#sendMessage');
const buttonSendRequestLocation = document.querySelector('#sendRequestLocation');
const chat = document.querySelector('#messagesChat');

let websocket = new WebSocket(wsUri);
websocket.onopen = (event) => console.log('CONNECTED');

buttonSendMessage.addEventListener('click', (e) => {
    e.preventDefault();

    let message = inputMessage.value;
    sendMessage(message);

    websocket.onmessage = (event) => {
        let message = event.data;
        writeToChat(message, 'message-server');
    };

    return false;
});



buttonSendRequestLocation.addEventListener('click', async(e) => {
    e.preventDefault();

    let coords = await getPosition()
        .then((coords) => {
            if (! coords.error) {
                return coords;
            }
        });
    
    if (! coords.error) {
        sendMessage(`<a href="https://www.openstreetmap.org/#map=6/${coords.latitude}/${coords.longitude}" target="_blank">Гео локация</a>`);
        websocket.onmessage = (event) => {
            let message = event.data;
            console.log(message);
        };
    }
});

websocket.onerror = (event) => {
    console.error('ERROR:', event.data);
};

websocket.onclose = ((event) => {
    console.log(`Closed ${event.code}`);
    websocket.close();
    websocket = null;
});

const sendMessage = (message) => {
    websocket.send(message);
    inputMessage.value = '';
    inputMessage.textContent = '';
    writeToChat(message, 'message-client');
    return false;
}

const writeToChat = (message, className) => {
    let elem = document.createElement('p');
    elem.style.wordWrap = "break-word";
    elem.classList.add('text-message');
    elem.classList.add(className);
    elem.innerHTML = message;
    chat.appendChild(elem);
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
