// ===== CONFIGURACIÓN SUPABASE =====
const API_URL = 'https://slyeilaprkszigbyzcyb.supabase.co/functions/v1/rapid-responder';
const SUPABASE_ANON = 'sb_publishable_ySNu9mmru7fGSBKY_psuIA_faNxG5IH'; // la sb_publishable_...

async function apiRequest(action, payload = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s de margen

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'apikey': SUPABASE_ANON
      },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error('Respuesta inválida del backend.');
    }

    if (!data.ok) {
      throw new Error(data.message || 'Error en la API.');
    }
    return data;

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('El servidor tardó demasiado en responder. Intente nuevamente.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ===== AUTH =====
function apiLogin(usuario, clave) {
  return apiRequest('login', { usuario, clave });
}
function apiGetSesion(token) {
  return apiRequest('getSesion', { token });
}
function apiLogout(token) {
  return apiRequest('logout', { token });
}

// ===== BÚSQUEDA / REGISTRO =====
function apiBuscarProducto(token, data) {
  return apiRequest('buscarProducto', { token, scan: data });
}

// NUEVO: registro en lote (reemplaza el for de apiRegistrarAuditoria)
function apiRegistrarAuditoriaLote(token, orden, nroConteo, rows) {
  return apiRequest('registrarAuditoriaLote', { token, orden, nroConteo, rows });
}

function apiCerrarConteoOrden(token, orden, comentarioGlobal) {
  return apiRequest('cerrarConteoOrden', { token, orden, comentarioGlobal });
}

// ===== USUARIOS / PRIORIZADOS / AUDITORIA =====
function apiListarUsuarios(token) {
  return apiRequest('listarUsuarios', { token });
}
function apiGuardarUsuario(token, data) {
  return apiRequest('guardarUsuario', { token, data });
}
function apiListarPriorizados(token) {
  return apiRequest('listarPriorizados', { token });
}
function apiGuardarPriorizados(token, codigos) {
  return apiRequest('guardarPriorizados', { token, codigos });
}
function apiListarAuditoria(token, limite = 100) {
  return apiRequest('listarAuditoria', { token, limite });
}
function apiLimpiarAuditoria(token) {
  return apiRequest('limpiarAuditoria', { token });
}

// ===== ÓRDENES =====
function apiListarOrdenesAdmin_(token) {
  return apiRequest('listarOrdenesAdmin', { token });
}
function apiListarOrdenesAuditor(token) {
  return apiRequest('listarOrdenesAuditor', { token });
}
function apiObtenerDetalleOrdenAdmin_(token, orden) {
  return apiRequest('obtenerDetalleOrdenAdmin', { token, orden });
}
function apiAbrirOrdenAuditor(token, orden) {
  return apiRequest('abrirOrdenAuditor', { token, orden });
}
function apiAbrirSegundoConteo(token, orden) {
  return apiRequest('abrirSegundoConteo', { token, orden });
}
function apiAbrirTercerConteo(token, orden) {
  return apiRequest('abrirTercerConteo', { token, orden });
}
function apiEliminarOrdenAdmin_(token, orden) {
  return apiRequest('eliminarOrdenAdmin', { token, orden });
}
function apiReiniciarOrdenAdmin_(token, orden) {
  return apiRequest('reiniciarOrdenAdmin', { token, orden });
}

// ===== IMPORTACIÓN (nuevo: envía filas leídas con SheetJS) =====
function apiPreviewPlantilla(token, rows) {
  return apiRequest('previewPlantilla', { token, rows });
}
function apiImportarPlantilla(token, rows, duplicateMode) {
  return apiRequest('importarPlantilla', { token, rows, duplicateMode });
}

// ===== EXPORTACIÓN (nuevo: devuelve datos, el Excel se arma en el navegador) =====
function apiDataRegistroVerificacion(token) {
  return apiRequest('dataRegistroVerificacion', { token });
}
