// ==== Manejo del Modal ====
const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("formSuscripcion");
const mensaje = document.getElementById("mensaje");
const confettiContainer = document.getElementById("confetti-container");

openModal.onclick = () => modal.style.display = "block";
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

// ==== Validación de formulario + confeti ====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  if (email.includes("@") && email.includes(".")) {
    mensaje.textContent = "¡Gracias por suscribirte!";
    mensaje.style.color = "green";
    form.reset();
    lanzarConfeti();
  } else {
    mensaje.textContent = "Por favor, ingresa un correo válido.";
    mensaje.style.color = "red";
  }
});

// ==== Animación de confeti ====
function lanzarConfeti() {
  for (let i = 0; i < 15; i++) {
    const confeti = document.createElement("div");
    confeti.classList.add("confetti");
    // Posición y color aleatorios
    confeti.style.left = Math.random() * 100 + "vw";
    confeti.style.backgroundColor = coloresAleatorios();
    confeti.style.animationDuration = (Math.random() * 2 + 2) + "s";
    confettiContainer.appendChild(confeti);

    // Remover confeti después de la animación
    setTimeout(() => {
      confeti.remove();
    }, 4000);
  }
}

function coloresAleatorios() {
  const colores = ["#ff5db1", "#fecd51", "#21acbb", "#64c4ae", "#178b62", "#a63d3d"];
  return colores[Math.floor(Math.random() * colores.length)];
}
