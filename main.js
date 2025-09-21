let listagasto =[];

function obtenerIngresos(){
    
    let ingreso= parseFloat(prompt("Cuanto dinero ganas al mes ?"));

    if(isNaN(ingreso)){
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
        let montoGasto = parseFloat(prompt(`Monto destinado a ${nombreGasto}:`));

        if (isNaN(montoGasto)) {
            alert("Por favor, ingresa un número válido para el monto.");
            i--; 
            continue;
        }

        listagasto.push({ concepto: nombreGasto, monto: montoGasto });
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
    let saldo = ingresos - totalgasto

    console.log("--- Detalle de gastos ---");
    listagasto.forEach (gasto => {
        console.log(`${gasto.concepto}: ${gasto.monto}`);
    })
    
    if (saldo > 0 ){
        alert(
            `Ingresos: ${ingresos}\n` +
            `Gastos totales: ${totalgasto}\n`+
            `Saldo final: ${saldo} (saldo positivo) `
        );
    } else if(saldo === 0 ){
        alert(
            `Ingresos: ${ingresos}\n` +
            `Gastos totales : ${totalgasto}\n` +
            `Saldo final: ${saldo} (sin ahorros)`
        );
    } else {
        alert(
            `Ingresos: ${ingresos}\n`+
            `Gastos totales: ${totalgasto}\n`+
            `Saldo final: ${saldo} (saldo negativo)`
        );
    }
}

function ejecutarsimulador(){
    let ingresos = obtenerIngresos();
    obtenerGastos();
    let totalgasto = calcularGastoTotal();
    mostrarBalance(ingresos,totalgasto);
}

ejecutarsimulador();