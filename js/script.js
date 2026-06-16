// ==========================================================================
// 🌿 ECOALERTA - MOTOR LÓGICO CENTRAL INTERACTIVO TOTAL
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 📦 1. DATOS DEMO INICIALES
    if (!localStorage.getItem("reportes")) {
        const reportesDemo = [
            { 
                id: 1, 
                tipo: "Punto Crítico Detectado",
                referencia: "Av. de la Cultura (Paradero San Sebastián)", 
                descripcion: "Acumulación crítica de bolsas de basura y restos de poda en la berma central.", 
                estado: "Pendiente", 
                fecha: "14/06/2026",
                lat: -13.5312,
                lng: -71.9272,
                imagen: "" 
            },
            { 
                id: 2, 
                tipo: "Punto Crítico Detectado",
                referencia: "Plaza de Armas de San Sebastián", 
                descripcion: "Contenedores saturados tras festividad local en el distrito.", 
                estado: "Atendido", 
                fecha: "15/06/2026",
                lat: -13.5336,
                lng: -71.9392,
                imagen: ""
            },
            { 
                id: 3, 
                tipo: "Punto Crítico Detectado",
                referencia: "Urb. Santa Rosa Pasaje 4", 
                descripcion: "Escombros de construcción bloqueando la acera peatonal.", 
                estado: "No Atendido", 
                fecha: "16/06/2026",
                lat: -13.5385,
                lng: -71.9421,
                imagen: ""
            }
        ];
        localStorage.setItem("reportes", JSON.stringify(reportesDemo));
    }

    // 🚀 2. CONTROL ENRUTADOR SEGURO
    const rolActual = (localStorage.getItem("rol") || "").toLowerCase().trim();
    const paginaActual = window.location.pathname.split("/").pop() || "index.html";

    if (!rolActual && paginaActual !== "login.html") {
        window.location.href = "login.html";
        return;
    }

    // Inicializaciones Globales Automáticas
    generarMenuDinamico();
    configurarFormulario();

    // Filtros de ejecución según vistas y privilegios
    if (rolActual === "trabajador" || rolActual === "admin") {
        mostrarTotalReportes();
        mostrarReportes();
        generarGrafico();
    }
});

// ==========================================================================
// 🔑 SESIONES Y SEGURIDAD
// ==========================================================================
function cerrarSesion(e){
    if(e && e.preventDefault) e.preventDefault(); 
    if(confirm("🌱 EcoAlerta: ¿Está seguro de que desea cerrar su sesión?")){
        localStorage.clear(); 
        window.location.href = "login.html"; 
    }
}

// ==========================================================================
// 🟢 GENERADOR DINÁMICO DE MENÚ LATERAL (CONTROL DE ACCESO TOTAL)
// ==========================================================================
function generarMenuDinamico() {
    const contenedorMenu = document.getElementById("menuDinamico");
    if (!contenedorMenu) return;

    const rol = (localStorage.getItem("rol") || "").toLowerCase().trim();
    const paginaActual = window.location.pathname.split("/").pop() || "index.html";

    let htmlMenu = `
        <div class="sidebar-top">
            <div class="sidebar-brand">
                <h2><i class="fas fa-leaf"></i> EcoAlerta</h2>
            </div>
            <div class="sidebar-links">
    `;

    if (rol === "trabajador" || rol === "admin") {
        htmlMenu += `
            <a href="index.html" class="${paginaActual === 'index.html' ? 'active' : ''}"><i class="fas fa-th-large"></i> Inicio</a>
            <a href="reportar.html" class="${paginaActual === 'reportar.html' ? 'active' : ''}"><i class="fas fa-bullhorn"></i> Reportar</a>
            <a href="mapa.html" class="${paginaActual === 'mapa.html' ? 'active' : ''}"><i class="fas fa-map-marked-alt"></i> Mapa Urbano</a>
            <a href="horarios.html" class="${paginaActual === 'horarios.html' ? 'active' : ''}"><i class="fas fa-clock"></i> Horarios</a>
            <a href="estadisticas.html" class="${paginaActual === 'estadisticas.html' ? 'active' : ''}"><i class="fas fa-chart-pie"></i> Estadísticas</a>
            <a href="perfil.html" class="${paginaActual === 'perfil.html' ? 'active' : ''}"><i class="fas fa-user-cog"></i> Perfil</a>
        `;
    } 
    else if (rol === "vecino") {
        htmlMenu += `
            <a href="reportar.html" class="${paginaActual === 'reportar.html' ? 'active' : ''}"><i class="fas fa-bullhorn"></i> Reportar</a>
            <a href="mapa.html" class="${paginaActual === 'mapa.html' ? 'active' : ''}"><i class="fas fa-map-marked-alt"></i> Mapa</a>
            <a href="horarios.html" class="${paginaActual === 'horarios.html' ? 'active' : ''}"><i class="fas fa-clock"></i> Horarios</a>
        `;
    }

    htmlMenu += `
            </div>
        </div>
        <div class="sidebar-footer">
            <a href="#" id="btnCerrarSesionEspecial" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </a>
        </div>
    `;

    contenedorMenu.innerHTML = htmlMenu;

    document.getElementById("btnCerrarSesionEspecial").onclick = function(e) {
        cerrarSesion(e);
    };
}

// ==========================================================================
// 📝 RECEPTOR UNIFICADO DE FORMULARIOS
// ==========================================================================
function configurarFormulario(){
    const formulario = document.getElementById("formReporte");
    if(!formulario) return;

    formulario.addEventListener("submit", function(e){
        e.preventDefault();

        const refUbicacion = document.getElementById("ubicacion").value.trim();
        const desc = document.getElementById("descripcion").value.trim();
        const fotoInput = document.getElementById("foto");

        if(refUbicacion === "" || desc === ""){
            alert("Todos los campos del reporte son obligatorios.");
            return;
        }

        const latActual = (typeof latitudGuardada !== 'undefined' && latitudGuardada) ? latitudGuardada : -13.5336;
        const lngActual = (typeof longitudGuardada !== 'undefined' && longitudGuardada) ? longitudGuardada : -71.9392;

        function guardarReporteFinal(imagenBase64 = "") {
            let reportes = JSON.parse(localStorage.getItem("reportes")) || [];
            reportes.push({
                id: Date.now(),
                tipo: "Punto Crítico Detectado",
                referencia: refUbicacion,
                descripcion: desc,
                estado: "Pendiente",
                fecha: new Date().toLocaleDateString("es-PE"),
                lat: latActual, 
                lng: lngActual,
                imagen: imagenBase64
            });
            localStorage.setItem("reportes", JSON.stringify(reportes));
            alert("🎉 ¡Reporte enviado con éxito! Redirigiendo al mapa de control...");
            window.location.href = "mapa.html";
        }

        if(fotoInput && fotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                guardarReporteFinal(event.target.result);
            };
            reader.readAsDataURL(fotoInput.files[0]);
        } else {
            guardarReporteFinal();
        }
    });
}

// ==========================================================================
// 📋 COMPONENTE ADMINISTRATIVO DE TABLAS
// ==========================================================================
function mostrarReportes(){
    let tablaBody = document.getElementById("tablaReportesBody");
    if(!tablaBody) return;

    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];
    tablaBody.innerHTML = "";

    if(reportes.length === 0){
        tablaBody.innerHTML = `<tr><td colspan="5" style="padding:30px; font-weight:500; color:#64748b;">No se registran alertas ambientales.</td></tr>`;
        return;
    }

    reportes.forEach((reporte, index) => {
        let claseEstado = "estado-pendiente";
        if(reporte.estado === "Atendido") claseEstado = "estado-atendido";
        if(reporte.estado === "No Atendido") claseEstado = "estado-noatendido";

        let componenteImagen = reporte.imagen 
            ? `<img src="${reporte.imagen}" class="img-miniatura" onclick="alert('Visualizando evidencia')" title="Ver evidencia">`
            : `<span style="color:#94a3b8; font-size:12px;"><i class="fas fa-image-slash"></i> Sin foto</span>`;

        const paginaActual = window.location.pathname.split("/").pop() || "index.html";
        const fila = document.createElement("tr");

        if (paginaActual === "index.html") {
            // Fila simplificada para el Dashboard de Inicio
            fila.innerHTML = `
                <td style="text-align:left; font-weight:600;">${reporte.referencia}</td>
                <td style="text-align:left; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${reporte.descripcion}</td>
                <td><small>${reporte.fecha}</small></td>
                <td><span class="estado-badge ${claseEstado}">${reporte.estado}</span></td>
                <td><a href="perfil.html" class="btn-action" style="padding:5px 10px; font-size:12px; text-decoration:none;"><i class="fas fa-eye"></i> Revisar</a></td>
            `;
        } else {
            // Fila interactiva completa para la sección Perfil / Gestión de Reportes
            fila.innerHTML = `
                <td>${componenteImagen}</td>
                <td style="text-align:left; font-weight:600;">${reporte.referencia}</td>
                <td style="text-align:left;">${reporte.descripcion}</td>
                <td>
                    <select onchange="cambiarEstadoDirecto(${index}, this.value)" style="margin-bottom:0; padding:6px;">
                        <option value="Pendiente" ${reporte.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                        <option value="Atendido" ${reporte.estado === "Atendido" ? "selected" : ""}>Atendido</option>
                        <option value="No Atendido" ${reporte.estado === "No Atendido" ? "selected" : ""}>No Atendido</option>
                    </select>
                </td>
                <td>
                    <button onclick="eliminarReporteDirecto(${index})" style="background:#dc2626; padding:6px 12px; font-size:13px;"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
        }
        tablaBody.appendChild(fila);
    });
}

function cambiarEstadoDirecto(index, nuevoEstado) {
    let reportes = JSON.parse(localStorage.getItem("reportes")) || [];
    reportes[index].estado = nuevoEstado;
    localStorage.setItem("reportes", JSON.stringify(reportes));
    mostrarReportes();
}

function eliminarReporteDirecto(index) {
    if(!confirm("⚠️ ¿Desea remover este reporte de forma permanente?")) return;
    let reportes = JSON.parse(localStorage.getItem("reportes")) || [];
    reportes.splice(index, 1);
    localStorage.setItem("reportes", JSON.stringify(reportes));
    mostrarReportes();
}

function mostrarTotalReportes(){
    const totalRep = document.getElementById("totalReportes");
    const totalPen = document.getElementById("totalPendientes");
    const totalAt = document.getElementById("totalAtendidos");
    const totalNoAt = document.getElementById("totalNoAtendidos");

    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];

    if(totalRep) totalRep.textContent = reportes.length;
    if(totalPen) totalPen.textContent = reportes.filter(r => r.estado === "Pendiente").length;
    if(totalAt) totalAt.textContent = reportes.filter(r => r.estado === "Atendido").length;
    if(totalNoAt) totalNoAt.textContent = reportes.filter(r => r.estado === "No Atendido").length;
}

// ==========================================================================
// 📊 GRÁFICO DE DONA (CHART.JS)
// ==========================================================================
function generarGrafico(){
    const graficoCanvas = document.getElementById("grafico");
    if(!graficoCanvas || typeof Chart === "undefined") return;

    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];
    const pendientes = reportes.filter(r => r.estado === "Pendiente").length;
    const atendidos = reportes.filter(r => r.estado === "Atendido").length;
    const noAtendidos = reportes.filter(r => r.estado === "No Atendido").length;

    if(window.miGrafico) window.miGrafico.destroy();

    window.miGrafico = new Chart(graficoCanvas, {
        type: "doughnut",
        data: {
            labels: ["Pendientes", "Atendidos", "No Atendidos"],
            datasets: [{
                data: [pendientes, atendidos, noAtendidos],
                backgroundColor: ["#ef4444", "#10b981", "#64748b"],
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}