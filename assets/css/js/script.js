/*
  REGOLE
  - Solo const/let, mai var.
  - DOM con querySelector / querySelectorAll.
  - Eventi con addEventListener (mai onclick inline nell'HTML).
*/

let tasks = [
    { id: 1, testo: "Studiare Java", completato: false },
    { id: 2, testo: "Riposare", completato: true },
    { id: 3, testo: "Fare la spesa", completato: true },
    { id: 4, testo: "Andare a correre", completato: false }
];
// Ogni task: { id: number, testo: string, completato: boolean }

let filtro = "tutti"; // "tutti" | "attivi" | "completati"


/* SCRIVI QUI LE TUE FUNZIONI E I TUOI LISTENER:
   1. Listener sul submit di #form-task (preventDefault, validazione, push, render)
   2. Funzione rendiLista() (filtra, crea <li>, aggiorna contatore)
   3. Listener su #lista-task con event delegation (Elimina + checkbox)
   4. Listener sui button .filtri (cambia filtro, classe attivo, render)
   EXTRA: localStorage per persistenza
*/
const form = document.querySelector("#form-task");
const campo = document.querySelector("#campo-task");
const errore = document.querySelector("#errore");
const lista = document.querySelector("#lista-task");
const contatore = document.querySelector("#contatore");
const bottoniFiltro = document.querySelectorAll(".filtri button");


form.addEventListener("submit", function (e) {
    e.preventDefault();

    const testo = campo.value.trim();

    if (testo === "") {
        errore.textContent = "Il campo non può essere vuoto!";
        return;
    }

    errore.textContent = "";

    const nuovoTask = {
        id: Date.now(),
        testo: testo,
        completato: false
    };

    tasks.push(nuovoTask);
    campo.value = "";
    salvaLocale();
    rendiLista();
});


function rendiLista() {
    lista.innerHTML = "";

    const taskFiltrati = tasks.filter(function (task) {
        if (filtro === "attivi") return !task.completato;
        if (filtro === "completati") return task.completato;
        return true;
    });

    taskFiltrati.forEach(function (task) {
        const li = document.createElement("li");
        li.dataset.id = task.id;
        if (task.completato) li.classList.add("completato");

        li.innerHTML = `
      <input type="checkbox" class="check" ${task.completato ? "checked" : ""}>
      <span>${task.testo}</span>
      <button class="elimina">Elimina</button>
    `;

        lista.appendChild(li);
    });

    const attivi = tasks.filter(t => !t.completato).length;
    contatore.textContent = attivi;
}

lista.addEventListener("click", function (e) {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);


    if (e.target.classList.contains("elimina")) {
        tasks = tasks.filter(t => t.id !== id);
        rendiLista();
    }


    if (e.target.classList.contains("check")) {
        const task = tasks.find(t => t.id === id);
        if (task) task.completato = e.target.checked;
        rendiLista();
    }
});

bottoniFiltro.forEach(function (btn) {
    btn.addEventListener("click", function () {
        bottoniFiltro.forEach(b => b.classList.remove("attivo"));
        btn.classList.add("attivo");
        filtro = btn.dataset.filtro;
        rendiLista();
    });
});

rendiLista();
