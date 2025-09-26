document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleContact');
    const contactInfo = document.getElementById('contactInfo');

    toggleButton.addEventListener('click', () => {
        contactInfo.classList.toggle('hidden');
        if (contactInfo.classList.contains('hidden')) {
            toggleButton.textContent = 'Mostrar contacto';
        } else {
            toggleButton.textContent = 'Ocultar contacto';
        }
    });
});