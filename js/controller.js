class EcoAlertaController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        const isLoggedIn = this.model.isLoggedIn();
        
        // ✅ PASAR EL MÉTODO handleLogout COMO CALLBACK
        this.view.initMenu(isLoggedIn, () => this.handleLogout());
        
        this.actualizarPantallaPrincipal();
    }

    actualizarPantallaPrincipal() {
        const reportes = this.model.getAll();
        const isLoggedIn = this.model.isLoggedIn();

        this.view.renderCounters(reportes);

        if (isLoggedIn) {
            this.view.renderAnaliticaPrivada(reportes);
            this.view.renderControlConsole(
                reportes,
                (id, nuevoEstado) => this.handleCambioEstado(id, nuevoEstado),
                (id) => this.handleEliminarReporte(id),
                (id) => this.handleVerEvidencia(id)
            );
        } else {
            this.view.renderDashboardTable(
                reportes,
                (id) => this.handleVerEvidencia(id)
            );
        }
    }

    handleCambioEstado(id, nuevoEstado) {
        if (this.model.updateStatus(id, nuevoEstado)) {
            this.view.showToast(`✅ Estado actualizado a "${nuevoEstado}"`);
            this.actualizarPantallaPrincipal();
        }
    }

    handleEliminarReporte(id) {
        if (confirm("⚠️ ¿Está seguro de que desea eliminar permanentemente este reporte?")) {
            if (this.model.delete(id)) {
                this.view.showToast("🗑️ Reporte eliminado correctamente");
                this.actualizarPantallaPrincipal();
            }
        }
    }

    handleVerEvidencia(id) {
        const reporte = this.model.getById(id);
        if (reporte && reporte.imagen) {
            this.view.injectModalStructure(reporte);
        } else {
            this.view.showToast("📷 Este reporte no tiene imagen adjunta", "error");
        }
    }

    // ✅ CERRAR SESIÓN → DIRECTO AL LOGIN
    handleLogout() {
        // Limpiar todas las claves de sesión
        localStorage.removeItem('eco_session');
        localStorage.removeItem('session_user');
        localStorage.removeItem('isLoggedIn');
        sessionStorage.clear();
        
        this.view.showToast("👋 Sesión cerrada correctamente");
        
        // ✅ REDIRIGIR DIRECTAMENTE AL LOGIN
        setTimeout(() => {
            window.location.href = "login.html";
        }, 500);
    }
}

// 🚀 ARRANQUE AUTOMÁTICO
document.addEventListener("DOMContentLoaded", () => {
    const model = new EcoAlertaModel();
    const view = new EcoAlertaView();
    window.appController = new EcoAlertaController(model, view);
});