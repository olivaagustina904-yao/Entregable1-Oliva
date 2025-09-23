let listagasto =[];

function obtenerIngresos(){
    
    let ingreso= parseFloat(prompt("Cuanto dinero ganas al mes ?"));

    if(isNaN(ingreso)|| ingreso<=0) {
        alert("Por favor, ingresa un número válido.");
        return obtenerIngresos();
    }

    return ingreso;
}

function obtenerGastos() {
    let cantidad = parseInt(prompt("¿Cuántos tipos de gastos querés registrar?"));

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa un número válido mayor que 0.");
        return obtenerGastos(); 
    }

    for (let i = 0; i < cantidad; i++) {
        let nombreGasto = prompt(`Nombre del gasto ${i + 1}:`);
        
        let montogasto;

        while(true){
            montogasto = parseFloat(prompt(`Monto destinado a ${nombreGasto}:`));
            if(!isNaN(montogasto) && montogasto > 0){
                break;
            }
            alert("Porfavor, Ingresa un numero valido mayor que 0.");
        }
       listagasto.push({concepto: nombreGasto, monto:montogasto});
    }
}

function calcularGastoTotal(){
    let suma = 0;
    for (let i = 0; i < listagasto.length; i++){
        suma += listagasto[i].monto;
    }
    return suma; 
}

function mostrarBalance(ingresos, totalgasto){
    let saldo = ingresos - totalgasto;

    let detalle = "--- Detalle de gastos ---\n";
    listagasto.forEach ((gasto, i) => {

        detalle += `${i + 1}. ${gasto.concepto}: ${gasto.monto}\n`;
    });

    detalle+= `\nIngresos: ${ingresos}`;
    detalle+= `\nGastos: ${totalgasto}`;
    detalle+= `\nSaldo final: ${saldo}`;
    
   if(saldo > 0 ){
    detalle += "(saldo positivo)";
   }else if (saldo === 0 ){
    detalle += "(sin ahorros)";
   } else {
    detalle += "(saldo negativo)";
   }

   alert(detalle);
   console.log(detalle);
}

function ejecutarsimulador(){
    let ingresos = obtenerIngresos();
    obtenerGastos();
    let totalgasto = calcularGastoTotal();
    mostrarBalance(ingresos,totalgasto);
}


if(confirm("Queres iniciar el simulador de gasto?")){
   ejecutarsimulador();
} else {
    alert("Has cancelado el simulador.");
}