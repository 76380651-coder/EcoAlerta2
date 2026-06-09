// =====================================
// INICIO DEL SISTEMA
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    ocultarOpciones();
    mostrarTotalReportes();
    mostrarReportes();
    configurarFormulario();
    generarGrafico();

});

// =====================================
// LOGIN TRABAJADOR
// =====================================

function loginTrabajador(){

    const usuario =
    document.getElementById("usuario").value.trim();

    const clave =
    document.getElementById("clave").value.trim();

    if(usuario === "" || clave === ""){

        alert("Complete todos los campos");
        return;

    }

    if(usuario === "admin" && clave === "1234"){

        localStorage.setItem(
            "rol",
            "trabajador"
        );

        window.location.href =
        "index.html";

    }else{

        alert(
            "Usuario o contraseña incorrectos"
        );

    }

}

// =====================================
// LOGIN VECINO
// =====================================

function loginVecino(){

    localStorage.setItem(
        "rol",
        "vecino"
    );

    window.location.href =
    "reportar.html";

}

// =====================================
// CERRAR SESIÓN
// =====================================

function cerrarSesion(){

    if(confirm("¿Desea cerrar sesión?")){

        localStorage.removeItem("rol");

        window.location.href =
        "login.html";

    }

}

// =====================================
// OCULTAR OPCIONES DEL MENÚ
// =====================================

function ocultarOpciones(){

    const rol =
    localStorage.getItem("rol");

    if(rol === "vecino"){

        const elementos =
        document.querySelectorAll(
            ".solo-trabajador"
        );

        elementos.forEach(elemento => {

            elemento.style.display =
            "none";

        });

    }

}

// =====================================
// CONTADOR REPORTES
// =====================================

function mostrarTotalReportes(){

    const total =
    document.getElementById(
        "totalReportes"
    );

    if(!total) return;

    const reportes =
    JSON.parse(
        localStorage.getItem("reportes")
    ) || [];

    total.textContent =
    reportes.length;

}

// =====================================
// FORMULARIO REPORTAR
// =====================================

function configurarFormulario(){

    const formulario =
    document.getElementById(
        "formReporte"
    );

    if(!formulario) return;

    formulario.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const ubicacion =
            document.getElementById(
                "ubicacion"
            ).value.trim();

            const descripcion =
            document.getElementById(
                "descripcion"
            ).value.trim();

            if(
                ubicacion === "" ||
                descripcion === ""
            ){

                alert(
                "Complete todos los campos"
                );

                return;

            }

            let reportes =
            JSON.parse(
                localStorage.getItem(
                    "reportes"
                )
            ) || [];

            reportes.push({

                id: Date.now(),

                ubicacion,

                descripcion,

                estado:"Pendiente",

                fecha:
                new Date()
                .toLocaleDateString(
                    "es-PE"
                )

            });

            localStorage.setItem(

                "reportes",

                JSON.stringify(
                    reportes
                )

            );

            alert(
                "Reporte registrado correctamente"
            );

            formulario.reset();

        }

    );

}

// =====================================
// MOSTRAR REPORTES
// =====================================

function mostrarReportes(){

    const tabla =
    document.getElementById(
        "tablaReportes"
    );

    if(!tabla) return;

    const reportes =
    JSON.parse(
        localStorage.getItem(
            "reportes"
        )
    ) || [];

    tabla.innerHTML = "";

    reportes.forEach(reporte => {

        tabla.innerHTML += `

        <tr>

            <td>
            ${reporte.ubicacion}
            </td>

            <td>
            ${reporte.descripcion}
            </td>

            <td>
            ${reporte.fecha}
            </td>

            <td>

                <span class="${
                    reporte.estado === "Pendiente"
                    ? "estado-pendiente"
                    : "estado-atendido"
                }">

                ${reporte.estado}

                </span>

            </td>

            <td>

                <button
                onclick="cambiarEstado(${reporte.id})">

                ✔

                </button>

                <button
                onclick="eliminarReporte(${reporte.id})">

                🗑

                </button>

            </td>

        </tr>

        `;

    });

}

// =====================================
// ELIMINAR REPORTE
// =====================================

function eliminarReporte(id){

    if(
        !confirm(
            "¿Eliminar reporte?"
        )
    ) return;

    let reportes =
    JSON.parse(
        localStorage.getItem(
            "reportes"
        )
    ) || [];

    reportes =
    reportes.filter(
        reporte =>
        reporte.id !== id
    );

    localStorage.setItem(

        "reportes",

        JSON.stringify(
            reportes
        )

    );

    location.reload();

}

// =====================================
// CAMBIAR ESTADO
// =====================================

function cambiarEstado(id){

    let reportes =
    JSON.parse(
        localStorage.getItem(
            "reportes"
        )
    ) || [];

    reportes.forEach(reporte => {

        if(reporte.id === id){

            reporte.estado =
            "Atendido";

        }

    });

    localStorage.setItem(

        "reportes",

        JSON.stringify(
            reportes
        )

    );

    location.reload();

}

// =====================================
// GRÁFICO ESTADÍSTICAS
// =====================================

function generarGrafico(){

    const grafico =
    document.getElementById(
        "grafico"
    );

    if(
        !grafico ||
        typeof Chart ===
        "undefined"
    ) return;

    const reportes =
    JSON.parse(
        localStorage.getItem(
            "reportes"
        )
    ) || [];

    const pendientes =
    reportes.filter(
        r => r.estado ===
        "Pendiente"
    ).length;

    const atendidos =
    reportes.filter(
        r => r.estado ===
        "Atendido"
    ).length;

    new Chart(

        grafico,

        {

            type:"doughnut",

            data:{

                labels:[

                    "Pendientes",

                    "Atendidos"

                ],

                datasets:[{

                    data:[

                        pendientes,

                        atendidos

                    ]

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

}
function eliminarTodos(){

    if(!confirm(
        "¿Eliminar todos los reportes?"
    )) return;

    localStorage.removeItem(
        "reportes"
    );

    location.reload();

}
