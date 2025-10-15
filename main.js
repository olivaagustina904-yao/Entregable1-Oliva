let listaGastos = JSON.parse(localStorage.getItem("gastos")) || [];
let ingresos = parseFloat(localStorage.getItem("ingresos")) || 0;

const inputIngreso = document.getElementById("ingresos");
const inputNombre = document.getElementById("nombreGasto");
const inputMonto = document.getElementById("montoGasto");
const listaHTML = document.getElementById("listaGastos");
const totalHTML = document.getElementById("totalGastos");
const saldoHTML = document.getElementById("saldo");
const buscarInput = document.getElementById("buscar");
const alertaDiv = document.getElementById("alerta");
const guardarIngresoBtn = document.getElementById("guardarIngreso");
const agregarGastoBtn = document.getElementById("agregarGasto");
const borrarTodoBtn = document.getElementById("borrarTodo");

function renderizarGastos(filtro = "") {
  listaHTML.innerHTML = "";

  listaGastos.forEach((gasto, index) => {
    if (!gasto.concepto.toLowerCase().includes(filtro.toLowerCase())) return;

    const li = document.createElement("li");
    li.dataset.index = index;
    li.innerHTML = `
      <span class="texto-gasto">${gasto.concepto}: $${gasto.monto.toFixed(2)}</span>
      <div class="botones">
        <button class="editar" data-index="${index}"></button>
        <button class="borrar" data-index="${index}"></button>
      </div>
    `;
    listaHTML.appendChild(li);
  });

  calcularBalance();
  localStorage.setItem("gastos", JSON.stringify(listaGastos));
}


function calcularBalance() {
  const total = listaGastos.reduce((acc, gasto) => acc + gasto.monto, 0);
  totalHTML.textContent = `$${total.toFixed(2)}`;
  const saldo = ingresos - total;
  saldoHTML.textContent = `$${saldo.toFixed(2)}`;
}


function mostrarAlerta(mensaje, tipo = "ok") {
  alertaDiv.textContent = mensaje;
  alertaDiv.style.color = tipo === "error" ? "red" : "green";
  setTimeout(() => (alertaDiv.textContent = ""), 2000);
}


guardarIngresoBtn.addEventListener("click", () => {
  const valor = parseFloat(inputIngreso.value);
  if (isNaN(valor) || valor <= 0) {
    inputIngreso.classList.add("error");
    mostrarAlerta("Por favor ingresa un número válido", "error");
    return;
  }
  inputIngreso.classList.remove("error");
  ingresos = valor;
  localStorage.setItem("ingresos", ingresos);
  calcularBalance();
  mostrarAlerta("Ingreso guardado correctamente");
});


agregarGastoBtn.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const monto = parseFloat(inputMonto.value);
  if (!nombre || isNaN(monto) || monto <= 0) {
    inputNombre.classList.add("error");
    inputMonto.classList.add("error");
    mostrarAlerta("Completa los campos correctamente", "error");
    return;
  }

  inputNombre.classList.remove("error");
  inputMonto.classList.remove("error");

  listaGastos.push({ concepto: nombre, monto });
  inputNombre.value = "";
  inputMonto.value = "";
  renderizarGastos(buscarInput.value);
  mostrarAlerta("Gasto agregado");
});


buscarInput.addEventListener("input", (e) => {
  renderizarGastos(e.target.value);
});


listaHTML.addEventListener("click", (e) => {
  const target = e.target;
  const index = parseInt(target.dataset.index, 10);
  if (isNaN(index)) return;

  if (target.classList.contains("borrar")) {
    listaGastos.splice(index, 1);
    renderizarGastos(buscarInput.value);
    mostrarAlerta("Gasto eliminado");
  }

  if (target.classList.contains("editar")) {
    crearEditorInline(index);
  }
});


function crearEditorInline(index) {
  const li = listaHTML.querySelector(`li[data-index="${index}"]`);
  if (!li || li.querySelector(".editor-inline")) return;

  const gasto = listaGastos[index];
  const editor = document.createElement("div");
  editor.className = "editor-inline";
  editor.innerHTML = `
    <input type="text" class="edit-nombre" value="${gasto.concepto}" />
    <input type="number" class="edit-monto" value="${gasto.monto}" />
    <button class="save-edit">Guardar</button>
    <button class="cancel-edit">Cancelar</button>
  `;

  const texto = li.querySelector(".texto-gasto");
  const botones = li.querySelector(".botones");
  texto.style.display = "none";
  botones.style.display = "none";
  li.appendChild(editor);

  editor.querySelector(".save-edit").addEventListener("click", () => {
    const nuevoNombre = editor.querySelector(".edit-nombre").value.trim();
    const nuevoMonto = parseFloat(editor.querySelector(".edit-monto").value);
    if (!nuevoNombre || isNaN(nuevoMonto) || nuevoMonto <= 0) {
      mostrarAlerta("Datos inválidos", "error");
      return;
    }
    listaGastos[index] = { concepto: nuevoNombre, monto: nuevoMonto };
    renderizarGastos(buscarInput.value);
    mostrarAlerta("Gasto actualizado");
  });

  editor.querySelector(".cancel-edit").addEventListener("click", () => {
    editor.remove();
    texto.style.display = "";
    botones.style.display = "";
  });
}


borrarTodoBtn.addEventListener("click", () => {
  listaGastos = [];
  ingresos = 0;
  localStorage.clear();
  inputIngreso.value = "";
  renderizarGastos();
  calcularBalance();
  mostrarAlerta("Datos borrados correctamente");
});


inputIngreso.value = ingresos || "";
renderizarGastos();
calcularBalance();


