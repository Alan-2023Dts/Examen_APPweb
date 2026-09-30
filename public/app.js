const servicesStatus = document.querySelector('#services-status');
const servicesList = document.querySelector('#services-list');
const serviceSelect = document.querySelector('#servicio');
const requestForm = document.querySelector('#request-form');
const formStatus = document.querySelector('#form-status');
const submitButton = document.querySelector('#submit-button');

const fields = {
  nombre: document.querySelector('#nombre'),
  correo: document.querySelector('#correo'),
  servicio: serviceSelect,
  comentario: document.querySelector('#comentario')
};

function showServicesError(message) {
  servicesStatus.textContent = message;
  servicesStatus.className = 'status-message status-error';
}

function renderServices(servicios) {
  servicesList.replaceChildren();
  serviceSelect.replaceChildren(new Option('Selecciona un servicio', ''));

  servicios.forEach((servicio, index) => {
    const card = document.createElement('article');
    card.className = 'service-card';
    card.innerHTML = `
      <span class="service-index">0${index + 1}</span>
      <h3>${escapeHtml(servicio.nombre)}</h3>
      <p>${escapeHtml(servicio.descripcion)}</p>
    `;
    servicesList.append(card);
    serviceSelect.add(new Option(servicio.nombre, servicio.nombre));
  });

  serviceSelect.disabled = false;
  servicesStatus.textContent = `${servicios.length} servicios disponibles`;
  servicesStatus.className = 'status-message';
}

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

async function loadServices() {
  try {
    const response = await fetch('/api/servicios');
    if (!response.ok) throw new Error('No se pudieron cargar los servicios.');

    const servicios = await response.json();
    if (!Array.isArray(servicios) || servicios.length === 0) {
      throw new Error('No hay servicios disponibles en este momento.');
    }
    renderServices(servicios);
  } catch (error) {
    serviceSelect.disabled = true;
    showServicesError(error.message || 'No se pudieron cargar los servicios.');
  }
}

function setFieldError(name, message) {
  const field = fields[name];
  const error = document.querySelector(`#${name}-error`);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
}

function validateForm() {
  const values = Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, field.value.trim()]));
  let valid = true;

  Object.keys(values).forEach((name) => {
    setFieldError(name, values[name] ? '' : 'Este campo es obligatorio.');
    if (!values[name]) valid = false;
  });

  if (values.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
    setFieldError('correo', 'Escribe un correo electronico valido.');
    valid = false;
  }
  return valid ? values : null;
}

function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

async function submitRequest(event) {
  event.preventDefault();
  formStatus.textContent = '';
  formStatus.className = 'form-status';
  const values = validateForm();
  if (!values) return;

  submitButton.disabled = true;
  submitButton.firstChild.textContent = 'Enviando... ';

  try {
    const response = await fetch('/api/solicitudes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No se pudo enviar la solicitud.');

    showFormStatus(result.mensaje || 'Solicitud enviada correctamente.', 'success');
    requestForm.reset();
    Object.keys(fields).forEach((name) => setFieldError(name, ''));
  } catch (error) {
    showFormStatus(error.message || 'Ocurrio un error al enviar la solicitud.', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.firstChild.textContent = 'Enviar solicitud ';
  }
}

requestForm.addEventListener('submit', submitRequest);
loadServices();