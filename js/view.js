class EcoAlertaView {
    constructor() {
        this.paginaActual = window.location.pathname.split('/').pop() || 'index.html';
    }

    escapeXSS(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        }[match]));
    }

    showToast(mensaje, tipo = 'success') {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast-notification ${tipo === 'error' ? 'error' : ''}`;
        toast.innerHTML = `<i class="fas ${tipo === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${mensaje}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    initMenu(isLoggedIn, onLogout = null) {
        const menuNav = document.getElementById("menuDinamico");
        if (!menuNav) return;

        const pag = this.paginaActual;
        let enlaces = '';
        
        if (isLoggedIn) {
            enlaces = `
                <a href="index.html" class="${pag === 'index.html' ? 'active' : ''}">
                    <i class="fas fa-chart-pie"></i> Panel de Control
                </a>
                <a href="reportar.html" class="${pag === 'reportar.html' ? 'active' : ''}">
                    <i class="fas fa-bullhorn"></i> Crear Reporte
                </a>
                <a href="misreportes.html" class="${pag === 'misreportes.html' ? 'active' : ''}">
                    <i class="fas fa-folder-open"></i> Mis Reportes
                </a>
                <a href="mapa.html" class="${pag === 'mapa.html' ? 'active' : ''}">
                    <i class="fas fa-map-marked-alt"></i> Mapa
                </a>
                <a href="estadisticas.html" class="${pag === 'estadisticas.html' ? 'active' : ''}">
                    <i class="fas fa-chart-bar"></i> Estadísticas
                </a>
                <a href="horarios.html" class="${pag === 'horarios.html' ? 'active' : ''}">
                    <i class="fas fa-clock"></i> Horarios
                </a>
                <a href="admin.html" class="${pag === 'admin.html' ? 'active' : ''}">
                    <i class="fas fa-user-cog"></i> Administración
                </a>
            `;
        } else {
            enlaces = `
                <a href="index.html" class="${pag === 'index.html' ? 'active' : ''}">
                    <i class="fas fa-home"></i> Inicio
                </a>
                <a href="reportar.html" class="${pag === 'reportar.html' ? 'active' : ''}">
                    <i class="fas fa-bullhorn"></i> Crear Reporte
                </a>
                <a href="mapa.html" class="${pag === 'mapa.html' ? 'active' : ''}">
                    <i class="fas fa-map-marked-alt"></i> Mapa
                </a>
                <a href="horarios.html" class="${pag === 'horarios.html' ? 'active' : ''}">
                    <i class="fas fa-clock"></i> Horarios
                </a>
            `;
        }

        menuNav.innerHTML = `
            <div class="sidebar-brand">
                <i class="fas fa-leaf"></i>
                <h2>EcoAlerta</h2>
            </div>
            <div class="sidebar-links">
                ${enlaces}
            </div>
            <div class="logout-container">
                ${isLoggedIn ? 
                    `<a href="#" class="logout-btn" id="btnCerrarSesion"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>` : 
                    `<a href="login.html" class="menu-login-btn"><i class="fas fa-key"></i> Intranet Municipal</a>`
                }
            </div>
        `;

        // ✅ VINCULAR EVENTO DE LOGOUT
        if (isLoggedIn && onLogout) {
            const logoutBtn = document.getElementById('btnCerrarSesion');
            if (logoutBtn) {
                // Eliminar eventos anteriores para evitar duplicados
                const newLogoutBtn = logoutBtn.cloneNode(true);
                logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
                
                newLogoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof onLogout === 'function') {
                        onLogout();
                    }
                });
            }
        }

        this.agregarHamburguesa();
    }

    agregarHamburguesa() {
        const existing = document.querySelector('.hamburguesa');
        if (existing) return;

        const btn = document.createElement('button');
        btn.className = 'hamburguesa';
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        btn.setAttribute('aria-label', 'Abrir menú');
        document.body.prepend(btn);

        btn.addEventListener('click', () => {
            document.querySelector('.menu').classList.toggle('abierto');
        });

        document.addEventListener('click', (e) => {
            const menu = document.querySelector('.menu');
            if (menu && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                menu.classList.remove('abierto');
            }
        });
    }

    renderAnaliticaPrivada(reportes) {
        const contenedor = document.getElementById("panelAnaliticaMunicipal");
        if (!contenedor) return;

        const stats = this.calcularEstadisticas(reportes);

        contenedor.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 35px; animation: fadeIn 0.4s ease;">
                <div class="chart-card">
                    <h3 style="font-size: 13px; color: var(--primary); margin-bottom: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="fas fa-chart-pie"></i> Estado de Resolución Global
                    </h3>
                    <div style="height: 220px; position: relative;">
                        <canvas id="chartEstadisticas"></canvas>
                    </div>
                </div>
                <div class="kpi-grid">
                    <div class="kpi-card-success">
                        <p class="kpi-label" style="opacity: 0.85;">Tasa de Éxito</p>
                        <h2 id="kpiEfectividad" class="kpi-value">${stats.efectividad}%</h2>
                        <p class="kpi-subtext" style="opacity: 0.9;">
                            <i class="fas fa-check-circle"></i> ${stats.atendidos} de ${stats.total} atendidos
                        </p>
                    </div>
                    <div class="kpi-card-warning">
                        <p class="kpi-label" style="color: var(--text-muted);">Pendientes</p>
                        <h2 class="kpi-value" style="color: #ef4444;">${stats.pendientes}</h2>
                        <p class="kpi-subtext" style="color: #ef4444; font-weight: 500;">
                            <i class="fas fa-exclamation-triangle"></i> Requieren atención
                        </p>
                    </div>
                </div>
            </div>
        `;

        this.actualizarGrafico(reportes);
    }

    actualizarGrafico(reportes) {
        const ctx = document.getElementById("chartEstadisticas");
        if (!ctx || typeof Chart === "undefined") return;

        const stats = this.calcularEstadisticas(reportes);

        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendientes', 'Atendidos', 'No Atendidos'],
                datasets: [{
                    data: [stats.pendientes, stats.atendidos, stats.noAtendidos],
                    backgroundColor: ['#ef4444', '#10b981', '#64748b'],
                    hoverOffset: 8,
                    borderWidth: 2,
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            color: '#f8fafc',
                            font: { family: 'Inter', size: 11, weight: '500' },
                            padding: 12
                        }
                    }
                }
            }
        });
    }

    calcularEstadisticas(reportes) {
        const total = reportes.length;
        const pendientes = reportes.filter(r => r.estado === 'Pendiente').length;
        const atendidos = reportes.filter(r => r.estado === 'Atendido').length;
        const noAtendidos = reportes.filter(r => r.estado === 'No Atendido').length;
        const efectividad = total > 0 ? Math.round((atendidos / total) * 100) : 0;

        return { total, pendientes, atendidos, noAtendidos, efectividad };
    }

    renderDashboardTable(reportes, onOpenImage) {
        const panel = document.getElementById("panelAnaliticaMunicipal");
        if (panel) panel.innerHTML = "";

        const tbody = document.getElementById("tablaReportesBody");
        if (!tbody) return;

        if (reportes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding: 30px;">
                <i class="fas fa-inbox" style="font-size: 24px; display: block; margin-bottom: 10px;"></i>
                Sin incidencias registradas
            </td></tr>`;
            return;
        }

        tbody.innerHTML = reportes.map(r => `
            <tr>
                <td>
                    ${r.imagen 
                        ? `<img src="${r.imagen}" class="img-miniatura view-trigger" data-id="${r.id}" title="Ver evidencia">` 
                        : `<i class="fas fa-image-slash" style="color:var(--text-muted); font-size:20px; padding-left:15px;"></i>`}
                </td>
                <td><strong>${this.escapeXSS(r.referencia)}</strong></td>
                <td style="color:var(--text-muted); font-size:14px;">${this.escapeXSS(r.descripcion)}</td>
                <td>${r.fecha}</td>
                <td>
                    <span class="estado-badge ${r.estado === 'Pendiente' ? 'estado-pendiente' : r.estado === 'Atendido' ? 'estado-atendido' : 'estado-noatendido'}">
                        ${r.estado}
                    </span>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll(".view-trigger").forEach(img => {
            img.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                if (onOpenImage) onOpenImage(id);
            });
        });
    }

    renderControlConsole(reportes, onStatusChange, onDelete, onOpenImage) {
        const tbody = document.getElementById("tablaReportesBody");
        if (!tbody) return;

        if (reportes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:30px;">
                <i class="fas fa-inbox" style="font-size: 24px; display: block; margin-bottom: 10px;"></i>
                No existen casos críticos cargados
            </td></tr>`;
            return;
        }

        tbody.innerHTML = reportes.map(r => `
            <tr>
                <td>
                    ${r.imagen 
                        ? `<img src="${r.imagen}" class="img-miniatura view-trigger" data-id="${r.id}" title="Maximizar foto">` 
                        : `<i class="fas fa-image-slash" style="color:var(--text-muted); font-size:20px; padding-left:15px;"></i>`}
                </td>
                <td><strong>${this.escapeXSS(r.referencia)}</strong></td>
                <td style="font-size: 13px; color: var(--text-muted);">${this.escapeXSS(r.descripcion)}</td>
                <td>
                    <select class="select-status-engine" data-id="${r.id}" style="padding:6px 10px; font-weight:600; border-radius:8px; border:1px solid #cbd5e1; outline:none; background:#1e293b; color:#fff;">
                        <option value="Pendiente" ${r.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                        <option value="Atendido" ${r.estado === "Atendido" ? "selected" : ""}>Atendido</option>
                        <option value="No Atendido" ${r.estado === "No Atendido" ? "selected" : ""}>No Atendido</option>
                    </select>
                </td>
                <td style="text-align: center;">
                    <button class="btn-delete-engine" data-id="${r.id}" style="background-color:#ef4444; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; transition:all 0.2s;">
                        <i class="fas fa-trash-alt" style="color:white;"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll(".select-status-engine").forEach(select => {
            select.addEventListener("change", (e) => {
                const id = e.target.getAttribute("data-id");
                const value = e.target.value;
                if (onStatusChange) onStatusChange(id, value);
            });
        });

        tbody.querySelectorAll(".btn-delete-engine").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                if (onDelete) onDelete(id);
            });
        });

        tbody.querySelectorAll(".view-trigger").forEach(img => {
            img.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                if (onOpenImage) onOpenImage(id);
            });
        });
    }

    injectModalStructure(reporte) {
        const oldModal = document.getElementById("ecoEvidenciaModal");
        if(oldModal) oldModal.remove();

        const modalDiv = document.createElement("div");
        modalDiv.id = "ecoEvidenciaModal";
        
        modalDiv.innerHTML = `
            <div class="eco-modal-content">
                <button class="eco-modal-close" id="closeModalBtn"><i class="fas fa-times"></i></button>
                <img src="${reporte.imagen}" alt="Evidencia" style="width:100%; max-height:350px; object-fit:cover; border-radius:10px; margin-top:15px;">
                <div style="margin-top:15px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <p style="font-weight:700; color:#fff;"><i class="fas fa-map-pin" style="color:#10b981"></i> ${this.escapeXSS(reporte.referencia)}</p>
                        <p style="font-size:12px; color:#94a3b8; margin-top:2px;">Captura: ${reporte.fecha}</p>
                    </div>
                    <span class="estado-badge ${reporte.estado === 'Pendiente' ? 'estado-pendiente' : reporte.estado === 'Atendido' ? 'estado-atendido' : 'estado-noatendido'}">
                        ${reporte.estado}
                    </span>
                </div>
            </div>
            <div id="modalOverlay"></div>
        `;

        document.body.appendChild(modalDiv);

        const cerrarModal = () => modalDiv.remove();
        document.getElementById("closeModalBtn").addEventListener("click", cerrarModal);
        document.getElementById("modalOverlay").addEventListener("click", cerrarModal);
    }

    renderCounters(reportes) {
        if(!document.getElementById("totalReportes")) return;
        const stats = this.calcularEstadisticas(reportes);
        document.getElementById("totalReportes").innerText = stats.total;
        document.getElementById("totalPendientes").innerText = stats.pendientes;
        document.getElementById("totalAtendidos").innerText = stats.atendidos;
    }

    bindLogoutEvent(onLogout) {
        // Este método ahora se llama desde initMenu directamente
        // Lo mantenemos por compatibilidad
        if (onLogout) {
            this._onLogout = onLogout;
        }
    }
}