# FDLJ — Rules & Design Skills

## 1. UI/UX Pro Max (Estética y Experiencia Deportiva)
- **Tema:** Dark mode deportivo moderno (estética fútbol de noche / EA Sports FC).
- **Jerarquía:** Uso riguroso de contraste tipográfico, pesos visuales e indicadores dinámicos (badges de estado, barras de progreso, racha 🔥).
- **Cartas FIFA:** Estética cromo con bordes dinámicos según el OVR (Oro > 8.0, Plata 6.5–7.9, Bronce < 6.5) y renderizado SVG limpio con DiceBear.
- **Responsive:** Mobile-first absoluto para uso fluido desde teléfonos.

## 2. Frontend Design Systems (Consistencia con Tailwind 4)
- **Componentes Primitivos:** Reutilizar estrictamente los componentes de `src/components/ui/` (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Spinner`).
- **Espaciados y Paleta:** Utilizar la escala de spacing de Tailwind 4 y los tokens semánticos de color (`bg-background`, `text-foreground`, `border-border`).
- **Estados:** Todo componente interactivo debe incluir feedback visual claro para `hover`, `focus`, `disabled` y `loading`.

## 3. Designing Frontend Interfaces (Arquitectura de Pantalla)
- **Flujos Complejos:** Considerar siempre estados vacíos (*Empty States*), estados de carga (*Skeletons*) y toasts de feedback con `sonner`.
- **Feedback:** Respuestas inmediatas en la UI tras cada acción (guardar resultado, calificar compañero, cambiar estado del partido).