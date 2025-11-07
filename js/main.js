let listaGastos = JSON.parse(localStorage.getItem("gastos")) || [];
let ingresos = parseFloat(localStorage.getItem("ingresos")) || 0;
const URL = "./db/data.json";

const inputIngreso = document.getElementById("ingresos");
const inputNombre = document.getElementById("nombreGasto");
const inputMonto = document.getElementById("montoGasto");
const listaHTML = document.getElementById("listaGastos");
const totalHTML = document.getElementById("totalGastos");
const saldoHTML = document.getElementById("saldo");
const alertaDiv = document.getElementById("alerta");
const buscarInput = document.getElementById("buscar");
const btnBuscar = document.getElementById("btnBuscar");
const guardarIngresoBtn = document.getElementById("guardarIngreso");
const agregarGastoBtn = document.getElementById("agregarGasto");
const borrarTodoBtn = document.getElementById("borrarTodo");

function guardarStorage() {
  localStorage.setItem("gastos", JSON.stringify(listaGastos));
  localStorage.setItem("ingresos", JSON.stringify(ingresos));
}

function mostrarAlerta(mensaje, tipo = "ok") {
  alertaDiv.textContent = mensaje;
  alertaDiv.className = `alerta ${tipo === "error" ? "alerta-error" : "alerta-ok"}`;
  setTimeout(() => (alertaDiv.textContent = ""), 2000);
}

function renderizarGastos(filtro = "") {
  listaHTML.innerHTML = "";

  const textoFiltro = (filtro || "").trim().toLowerCase();
  const filtrados = listaGastos
    .map((g, i) => ({ gasto: g, originalIndex: i }))
    .filter(item => item.gasto.concepto.toLowerCase().includes(textoFiltro));

  filtrados.forEach(item => {
    const { gasto, originalIndex } = item;
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="texto-gasto">+ ${gasto.concepto} = $${Number(gasto.monto)}</span>
      <div class="botones">
        <button class="editar">Editar</button>
        <button class="borrar">Borrar</button>
      </div>
    `;
    li.querySelector(".borrar").addEventListener("click", () => borrarGasto(originalIndex));
    li.querySelector(".editar").addEventListener("click", () => crearEditorInline(originalIndex));
    listaHTML.appendChild(li);
  });

  calcularBalance();
  guardarStorage();
}

function calcularBalance() {
  const total = listaGastos.reduce((a, g) => a + Number(g.monto), 0);
  totalHTML.textContent = `$${total}`;
  const saldo = ingresos - total;
  saldoHTML.textContent = `$${saldo}`;
}

function borrarGasto(index) {
  listaGastos.splice(index, 1);
  guardarStorage();
  renderizarGastos();
  Swal.fire({
    icon: "warning",
    title: "Gasto eliminado",
    text: "El gasto fue eliminado correctamente.",
    confirmButtonColor: "#c0392b"
  });
}

function crearEditorInline(index) {
  const li = listaHTML.children[index];
  if (!li || li.querySelector(".editor-inline")) return;

  const gasto = listaGastos[index];
  const editor = document.createElement("div");
  editor.className = "editor-inline";
  editor.innerHTML = `
    <input type="text" class="edit-nombre" value="${gasto.concepto}" />
    <input type="number" class="edit-monto" value="${Number(gasto.monto)}" />
    <button class="save-edit">Guardar</button>
    <button class="cancel-edit">Cancelar</button>
  `;

  const texto = li.querySelector(".texto-gasto");
  const botones = li.querySelector(".botones");
  texto.classList.add("oculto");
  botones.classList.add("oculto");
  li.appendChild(editor);

  editor.querySelector(".save-edit").addEventListener("click", () => {
    const nuevoNombre = editor.querySelector(".edit-nombre").value.trim();
    const nuevoMonto = Number(editor.querySelector(".edit-monto").value);
    if (!nuevoNombre || !Number.isFinite(nuevoMonto) || nuevoMonto <= 0) {
      mostrarAlerta("Datos inválidos", "error");
      return;
    }
    listaGastos[index] = { concepto: nuevoNombre, monto: nuevoMonto };
    guardarStorage();
    renderizarGastos();
    mostrarAlerta("Gasto actualizado");
  });

  editor.querySelector(".cancel-edit").addEventListener("click", () => {
    editor.remove();
    texto.classList.remove("oculto");
    botones.classList.remove("oculto");
  });
}

guardarIngresoBtn.addEventListener("click", () => {
  const valor = Number(inputIngreso.value);
  if (!Number.isFinite(valor) || valor <= 0) {
    mostrarAlerta("Por favor ingresa un número válido", "error");
    return;
  }
  ingresos += valor;
  guardarStorage();
  calcularBalance();
  Swal.fire({ icon: "success", title: "Ingreso agregado", text: `Se sumó $${valor}`, confirmButtonColor: "#2a7d2a" });
  inputIngreso.value = "";
});

agregarGastoBtn.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const monto = Number(inputMonto.value);

  if (!nombre || !Number.isFinite(monto) || monto <= 0) {
    mostrarAlerta("Completa los campos correctamente", "error");
    return;
  }

  listaGastos.push({ concepto: nombre, monto });
  guardarStorage();

  const totalActual = listaGastos.reduce((a, g) => a + Number(g.monto), 0);
  Swal.fire({
    icon: "success",
    title: "Gasto agregado",
    html: `<b>+ ${nombre} = $${monto}</b><br>Total actual: <b>$${totalActual}</b>`,
    confirmButtonColor: "#2a7d2a"
  });

  inputNombre.value = "";
  inputMonto.value = "";
  renderizarGastos();
});

let searchActive = false;
btnBuscar.addEventListener("click", () => {
  if (searchActive) {
    buscarInput.value = "";
    renderizarGastos();
    btnBuscar.textContent = "Buscar";
    searchActive = false;
    return;
  }

  const termino = buscarInput.value.trim().toLowerCase();
  if (!termino) {
    Swal.fire({ icon: "info", title: "Campo vacío", text: "Por favor escribí algo para buscar.", confirmButtonColor: "#2a7d2a" });
    return;
  }

  const filtrados = listaGastos.filter(g => g.concepto.toLowerCase().includes(termino));
  if (filtrados.length === 0) {
    const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    beep.play().catch(()=>{});
    if (navigator.vibrate) navigator.vibrate(200);
    Swal.fire({ icon: "warning", title: "Sin resultados", text: `No se encontró ningún gasto que coincida con "${termino}".`, confirmButtonColor: "#2a7d2a" });
    return;
  }

  renderizarGastos(termino);
  btnBuscar.textContent = "Mostrar todo";
  searchActive = true;
});

borrarTodoBtn.addEventListener("click", () => {
  Swal.fire({
    title: "¿Borrar todos los datos?",
    text: "Esto eliminará tus ingresos y gastos guardados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#c0392b"
  }).then(res => {
    if (res.isConfirmed) {
      listaGastos = [];
      ingresos = 0;
      localStorage.clear();
      renderizarGastos();
      calcularBalance();
      Swal.fire({ icon: "success", title: "Datos borrados", text: "Se eliminaron todos los registros", confirmButtonColor: "#2a7d2a" });
    }
  });
});

async function cargarDatosIniciales() {
  try {
    if (listaGastos.length > 0) return;
    Swal.fire({ title: "Cargando datos...", html: "Un momento.. ", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    await new Promise(r => setTimeout(r, 800));
    const res = await fetch(URL);
    if (!res.ok) throw new Error("No se pudo leer db/data.json");
    const data = await res.json();
    listaGastos = data.gastos || [];
    guardarStorage();
    Swal.fire({ icon: "success", title: "Datos cargados", confirmButtonColor: "#2a7d2a" });
  } catch (err) {
    Swal.fire({ icon: "error", title: "Error al cargar datos", text: err.message, confirmButtonColor: "#c0392b" });
  } finally {
    renderizarGastos();
    calcularBalance();
  }
}
inputIngreso.value = "";
cargarDatosIniciales();
