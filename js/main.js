// ===== Datos del catálogo (juegos ficticios) =====
const juegos = [
    {
        titulo: "Nébula Runner",
        genero: "Acción",
        plataforma: "PC, PlayStation",
        anio: 2024,
        puntaje: 4.5,
        img: "img/nebula-runner.svg",
        desc: "Corre entre planetas esquivando asteroides y combate contra jefes espaciales en niveles de ritmo vertiginoso.",
    },
    {
        titulo: "Reino de Cenizas",
        genero: "RPG",
        plataforma: "PC, Xbox",
        anio: 2023,
        puntaje: 4.7,
        img: "img/reino-de-cenizas.svg",
        desc: "Un reino devastado por el fuego necesita un héroe. Elige tu clase, forma un grupo y decide el destino de cada aldea.",
    },
    {
        titulo: "Cultivo Cósmico",
        genero: "Simulación",
        plataforma: "Nintendo Switch, PC",
        anio: 2022,
        puntaje: 4.2,
        img: "img/cultivo-cosmico.svg",
        desc: "Construye una granja en un asteroide, cultiva plantas extrañas y comercia con vecinos de otras galaxias.",
    },
    {
        titulo: "Circuito Fantasma",
        genero: "Carreras",
        plataforma: "PlayStation, Xbox",
        anio: 2024,
        puntaje: 4.0,
        img: "img/circuito-fantasma.svg",
        desc: "Compite en pistas urbanas de noche y desafía los tiempos fantasma de otros jugadores.",
    },
    {
        titulo: "Laberinto de Cristal",
        genero: "Puzzle",
        plataforma: "Móvil, Nintendo Switch",
        anio: 2021,
        puntaje: 4.4,
        img: "img/laberinto-de-cristal.svg",
        desc: "Dirige rayos de luz por laberintos de cristal. Cada nivel cambia las reglas de los reflejos.",
    },
    {
        titulo: "Frontera Zero",
        genero: "Estrategia",
        plataforma: "PC",
        anio: 2023,
        puntaje: 4.3,
        img: "img/frontera-zero.svg",
        desc: "Administra recursos, defiende tu base y planea cada turno en un mapa que cambia con el clima.",
    },
    {
        titulo: "Mar de Faros",
        genero: "Aventura",
        plataforma: "PC, Nintendo Switch, PlayStation",
        anio: 2025,
        puntaje: 4.8,
        img: "img/mar-de-faros.svg",
        desc: "Navega entre islas, resuelve misterios y enciende faros para guiar a los barcos perdidos.",
    },
    {
        titulo: "Torre Lógica",
        genero: "Puzzle",
        plataforma: "Móvil, PC",
        anio: 2022,
        puntaje: 3.9,
        img: "img/torre-logica.svg",
        desc: "Apila bloques con lógica para llegar a la cima. Pensado para partidas cortas.",
    },
];

// ===== Referencias al DOM =====
const grid = document.getElementById("grid");
const buscador = document.getElementById("search");
const selectGenero = document.getElementById("genre");
const contador = document.getElementById("count");
const vacio = document.getElementById("empty");
const modal = document.getElementById("modal");

// ===== Menú hamburguesa =====
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

function cerrarMenu() {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
}

menuBtn.addEventListener("click", () => {
    const abierto = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(abierto));
    menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});
menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", cerrarMenu),
);

// ===== Catálogo: render, filtro y buscador =====
const generos = [...new Set(juegos.map((j) => j.genero))].sort();
generos.forEach((g) => {
    const op = document.createElement("option");
    op.value = g;
    op.textContent = g;
    selectGenero.appendChild(op);
});

function crearTarjeta(juego, indice) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card";
    btn.dataset.indice = indice;
    btn.innerHTML = `
      <img src="${juego.img}" alt="Portada de ${juego.titulo}" loading="lazy">
      <span class="card-info">
        <h3>${juego.titulo}</h3>
        <span class="tag">${juego.genero}</span>
        <span class="rating">★ ${juego.puntaje.toFixed(1)}</span>
      </span>`;
    btn.addEventListener("click", () => abrirFicha(juego));
    return btn;
}

function renderizar() {
    const texto = buscador.value.trim().toLowerCase();
    const genero = selectGenero.value;
    const resultado = juegos.filter(
        (j) =>
            j.titulo.toLowerCase().includes(texto) &&
            (genero === "todos" || j.genero === genero),
    );

    grid.innerHTML = "";
    resultado.forEach((j, i) => grid.appendChild(crearTarjeta(j, i)));
    vacio.hidden = resultado.length > 0;
    contador.textContent =
        resultado.length === 1
            ? "1 juego encontrado"
            : `${resultado.length} juegos encontrados`;
}

buscador.addEventListener("input", renderizar);
selectGenero.addEventListener("change", renderizar);
renderizar();

// ===== Ficha del juego (modal) =====
function abrirFicha(juego) {
    document.getElementById("m-img").src = juego.img;
    document.getElementById("m-img").alt = `Portada de ${juego.titulo}`;
    document.getElementById("m-title").textContent = juego.titulo;
    document.getElementById("m-meta").textContent =
        `${juego.genero} | ${juego.plataforma} | ${juego.anio} | ★ ${juego.puntaje.toFixed(1)}`;
    document.getElementById("m-desc").textContent = juego.desc;
    modal.showModal();
}

document
    .getElementById("mClose")
    .addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
});

// ===== Acordeón de preguntas frecuentes =====
document.querySelectorAll(".acc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const panel = document.getElementById(
            btn.getAttribute("aria-controls"),
        );
        const abierto = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!abierto));
        panel.hidden = abierto;
    });
});

// ===== Validación del formulario =====
const form = document.getElementById("form");
const ok = document.getElementById("ok");

function validarCampo(id, mensaje, esValido) {
    const campo = document.getElementById(id);
    const error = document.getElementById("e-" + id);
    const valido = esValido(campo.value.trim());
    campo.classList.toggle("invalid", !valido);
    error.textContent = valido ? "" : mensaje;
    return valido;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    ok.hidden = true;

    const v1 = validarCampo(
        "nombre",
        "Escribe tu nombre (mínimo 2 letras).",
        (v) => v.length >= 2,
    );
    const v2 = validarCampo(
        "correo",
        "Escribe un correo válido, por ejemplo nombre@correo.com.",
        (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    );
    const v3 = validarCampo(
        "juego",
        "Escribe el nombre del juego que sugieres.",
        (v) => v.length >= 2,
    );

    if (v1 && v2 && v3) {
        const nombre = document.getElementById("nombre").value.trim();
        const juego = document.getElementById("juego").value.trim();
        ok.textContent = `Gracias, ${nombre}. Recibimos tu sugerencia: ${juego}.`;
        ok.hidden = false;
        form.reset();
    }
});

// ===== Año del pie de página =====
document.getElementById("year").textContent = new Date().getFullYear();
