# Clínica Psicológica versión 1.0

Aplicación operativa para registrar pacientes, sesiones, talleres, intervenciones en crisis, actividades institucionales, seguimientos y evaluaciones psicométricas. Incluye agenda, filtros, estadísticas, exportación a CSV compatible con Excel e integración con Google Calendar.

## Funciones terminadas

- Inicio de sesión con Google.
- Datos sincronizados entre dispositivos con Cloud Firestore.
- Crear, consultar, editar y eliminar pacientes.
- Crear, consultar, editar y eliminar todos los servicios.
- Registro y seguimiento de psicometría e informes.
- Agenda y filtros por fecha, servicio y estado.
- Historial con filtros por paciente, fecha, estado y modalidad.
- Estadísticas calculadas a partir de los registros reales.
- Detalles estadísticos por modalidad, estado, categoría y tipo.
- Exportación seleccionable de servicios, pacientes y psicometría.
- Creación opcional de eventos en Google Calendar.
- Diseño adaptable para teléfono y computadora.
- Pago con `No aplica` como valor predeterminado.

## Firebase ya configurado

Esta versión ya incluye la conexión pública al proyecto `Clinica Psicologica`, el acceso con Google y la estructura preparada para Cloud Firestore. No es necesario volver a pegar la configuración de Firebase.

La aplicación debe abrirse desde una dirección web (GitHub Pages o Firebase Hosting). Al abrir `index.html` directamente desde una carpeta, el navegador puede bloquear los módulos y el inicio de sesión.

## Configuración manual en otro proyecto (opcional)

1. Crea un proyecto en Firebase Console.
2. Agrega una aplicación web.
3. Activa Authentication → Proveedores → Google.
4. Crea una base de datos Cloud Firestore en modo producción.
5. Copia los valores de configuración dentro de `firebase-config.js`.
6. Copia el contenido de `firestore.rules` en Firestore → Reglas y publícalo.
7. En Authentication → Configuración → Dominios autorizados, agrega el dominio de GitHub Pages.

También es posible abrir la aplicación, pulsar `Configurar Firebase` y pegar los valores desde la interfaz. Esta alternativa guarda únicamente la configuración pública en ese navegador; no guarda información de pacientes localmente.

## Google Calendar

La primera vez que se marque `Crear también en Google Calendar`, Google solicitará autorización para administrar eventos. La aplicación utiliza solamente el alcance `calendar.events`.

En Google Cloud Console debe estar habilitada Google Calendar API para el mismo proyecto. Si Google muestra que la aplicación está en modo de prueba, agrega el correo de la psicóloga como usuario de prueba en la pantalla de consentimiento OAuth.

## Publicación gratuita en GitHub Pages

1. Sube todos los archivos de esta carpeta a la raíz de un repositorio.
2. Abre Settings → Pages.
3. Selecciona Deploy from a branch, la rama principal y la carpeta raíz.
4. Guarda y espera a que GitHub muestre la dirección publicada.

## Seguridad

Los registros pertenecen al identificador de la cuenta autenticada. Las reglas incluidas impiden que una cuenta consulte o modifique registros de otra. Antes de ingresar información real, prueba el acceso con la cuenta autorizada y con una segunda cuenta.

No subas claves de cuenta de servicio, claves privadas ni archivos administrativos de Google Cloud. La configuración web normal de Firebase sí puede publicarse porque el acceso está protegido por Authentication y las reglas de Firestore.

## Pendientes externos

- Sustituir el azul provisional `#0f4c81` cuando se reciba el código definitivo.
- Agregar el nombre y logotipo oficiales cuando sean entregados.
- Confirmar si el Google Form actual seguirá utilizándose o será reemplazado por el formulario integrado.
