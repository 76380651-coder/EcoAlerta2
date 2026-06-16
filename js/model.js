class EcoAlertaModel {
    constructor() {
        this.STORAGE_KEY = 'ecoalerta_reportes';
        this.SESSION_KEY = 'eco_session';
        
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const datosDemo = [
                { 
                    id: 1, 
                    referencia: "Av. Ejercito cuadra 4", 
                    descripcion: "Acumulación masiva de residuos plásticos en berma central.", 
                    estado: "Pendiente", 
                    fecha: "2026-06-15", 
                    lat: -13.5312, 
                    lng: -71.9272,
                    imagen: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23ef4444'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-size='10'>📸 FOTO 1</text></svg>"
                },
                { 
                    id: 2, 
                    referencia: "Parque Melgar - Zona Este", 
                    descripcion: "Contenedor de basura desbordado obstruyendo paso peatonal.", 
                    estado: "Atendido", 
                    fecha: "2026-06-14", 
                    lat: -13.5336, 
                    lng: -71.9392,
                    imagen: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%2310b981'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-size='10'>📸 FOTO 2</text></svg>"
                }
            ];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(datosDemo));
        }
    }

    getAll() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    save(referencia, descripcion, imagen, lat, lng) {
        const reportes = this.getAll();
        const nuevoReporte = {
            id: Date.now(),
            referencia: referencia.trim(),
            descripcion: descripcion.trim(),
            estado: "Pendiente",
            fecha: new Date().toISOString().split('T')[0],
            lat: lat || -13.5336,
            lng: lng || -71.9392,
            imagen: imagen || null
        };
        reportes.push(nuevoReporte);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reportes));
        return nuevoReporte;
    }

    updateStatus(id, nuevoEstado) {
        const reportes = this.getAll();
        const index = reportes.findIndex(r => r.id === parseInt(id));
        if (index !== -1) {
            reportes[index].estado = nuevoEstado;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reportes));
            return true;
        }
        return false;
    }

    delete(id) {
        let reportes = this.getAll();
        const filtered = reportes.filter(r => r.id !== parseInt(id));
        if (filtered.length !== reportes.length) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
            return true;
        }
        return false;
    }

    getById(id) {
        const reportes = this.getAll();
        return reportes.find(r => r.id === parseInt(id)) || null;
    }

    getEstadisticas() {
        const reportes = this.getAll();
        return {
            total: reportes.length,
            pendientes: reportes.filter(r => r.estado === 'Pendiente').length,
            atendidos: reportes.filter(r => r.estado === 'Atendido').length,
            noAtendidos: reportes.filter(r => r.estado === 'No Atendido').length,
            efectividad: reportes.length > 0 
                ? Math.round((reportes.filter(r => r.estado === 'Atendido').length / reportes.length) * 100)
                : 0
        };
    }

    login(user, pass) {
        if (user === 'admin' && pass === '1234') {
            localStorage.setItem(this.SESSION_KEY, 'true');
            localStorage.setItem('session_user', 'Operador Municipal');
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem('session_user');
    }

    isLoggedIn() {
        return localStorage.getItem(this.SESSION_KEY) === 'true';
    }

    getLoggedUser() {
        return localStorage.getItem('session_user') || 'Invitado';
    }
}