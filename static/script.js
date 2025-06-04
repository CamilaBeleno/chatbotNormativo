// Función para deshabilitar el campo de entrada de texto y el botón de envío
function disableInput() {
    const userInput = document.getElementById("user-input");
    const sendButton = document.querySelector("button"); // Asume que tienes un botón de envío
    userInput.disabled = true;
    sendButton.disabled = true;
}

// Función para habilitar el campo de entrada de texto y el botón de envío
function enableInput() {
    const userInput = document.getElementById("user-input");
    const sendButton = document.querySelector("button"); // Asume que tienes un botón de envío
    userInput.disabled = false;
    sendButton.disabled = false;
}

// Función para enviar mensajes
function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    const chatContent = document.getElementById("chat-content");

    if (message === "") {
        return; // No se envía un mensaje en blanco
    }

    // Agregar el mensaje del usuario al historial de chat
    chatContent.innerHTML += `<div class="user-message">${message}</div>`;

    // Borrar el campo de entrada
    userInput.value = "";

    // Deshabilitar el campo de entrada y el botón de envío mientras el bot responde
    disableInput();

    // Simular que el chatbot está escribiendo
    chatContent.innerHTML += '<div class="bot-message typing">El chatbot está escribiendo...</div>';
    chatContent.scrollTop = chatContent.scrollHeight;
    // Realizar una solicitud AJAX al servidor Flask
    $.ajax({
        type: "POST",
        url: "/send_message",
        data: { user_message: message },
        success: function(response) {
            // Eliminar el mensaje "El chatbot está escribiendo..."
            const typingMessage = document.querySelector('.typing');
            if (typingMessage) {
                chatContent.removeChild(typingMessage);
            }

            // Agregar la respuesta del chatbot al historial de chat
            chatContent.innerHTML += `<div class="bot-message">${response.bot_response}</div>`;

            // Habilitar nuevamente el campo de entrada y el botón de envío
            enableInput();

            // Desplazarse hacia abajo para mostrar el mensaje más reciente
            chatContent.scrollTop = chatContent.scrollHeight;
        }
    });
}

// Agregar un evento para detectar la tecla "Enter" en el campo de entrada
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evitar que el "Enter" haga un salto de línea en el campo de entrada
        sendMessage(); // Llamar a la función sendMessage cuando se presiona "Enter"
    }
});

// Agregar un evento para el botón "Enviar"
document.querySelector("button").addEventListener("click", function() {
    sendMessage();
});

document.addEventListener("DOMContentLoaded", function () {
    const chatContent = document.getElementById("chat-content");

    const welcomeMessage = document.createElement("div");
    welcomeMessage.classList.add("bot-message");
    welcomeMessage.innerHTML = "👋 ¡Hola! Soy NormaBot, tu asistente normativo. Pregúntame cualquier cosa sobre regulaciones.";

    chatContent.appendChild(welcomeMessage);
});