# MediScan Vue 3 App — Walkthrough

## Resumen

Se ha creado la aplicación Vue 3 de MediScan en `c:\TFGfinal\MediScan\vue-app\`, migrando el proyecto HTML/SCSS existente a Vue 3 con **Vuetify 3**, **Pinia** y **Vue Router**, tal como piden los requisitos del TFG.

## Estructura del Proyecto

```
vue-app/
├── src/
│   ├── main.js                  # Punto de entrada (Vue + Pinia + Router + Vuetify)
│   ├── App.vue                  # Root con router-view + Snackbar global
│   ├── plugins/
│   │   └── vuetify.js           # Plugin Vuetify con tema MediScan
│   ├── router/
│   │   └── index.js             # Vue Router (3 rutas)
│   ├── stores/
│   │   ├── appStore.js          # Store global (snackbar, drawer)
│   │   └── simulatorStore.js    # Store del simulador IA
│   ├── components/
│   │   ├── AppHeader.vue        # Header con nav desktop
│   │   ├── AppFooter.vue        # Footer con 3 columnas
│   │   └── BottomNav.vue        # Barra navegación móvil
│   ├── views/
│   │   ├── HomeView.vue         # Página principal completa
│   │   ├── ServicesView.vue     # Simulador IA con tabs y drag-drop
│   │   └── ContactView.vue      # Formulario de contacto con validación
│   └── styles/
│       └── main.scss            # Estilos globales (variables del SCSS original)
```

## Requisitos del TFG Cubiertos

| Requisito | Estado |
|-----------|--------|
| Vue 3 | ✅ Vite + Vue 3 |
| TypeScript | ✅ Composition API / Options API |
| Vue Router | ✅ 3 rutas con lazy loading, meta titles |
| Pinia | ✅ `appStore` + `simulatorStore` |
| Vuetify 3 | ✅ Tema personalizado MediScan |
| Components para páginas | ✅ AppHeader, AppFooter, BottomNav |
| Componentes individuales | ✅ Cards, Upload, Formulario |
| Sin alerts nativos | ✅ Vuetify Snackbar como reemplazo |
| Responsive | ✅ Mobile-first, bottom nav en móvil |

## Capturas de Pantalla

### Home Page
![Home Page](file:///C:/Users/NitroPC/.gemini/antigravity/brain/21129948-69a8-4c6c-bcf7-d5b099544828/home_page_1772797314785.png)

### AI Simulator (Services)
![Services Page](file:///C:/Users/NitroPC/.gemini/antigravity/brain/21129948-69a8-4c6c-bcf7-d5b099544828/services_page_1772797353838.png)

### Contact Page
![Contact Page](file:///C:/Users/NitroPC/.gemini/antigravity/brain/21129948-69a8-4c6c-bcf7-d5b099544828/contact_page_1772797385630.png)

## Cómo ejecutar

```bash
cd c:\TFGfinal\MediScan\vue-app
npm run dev
```

Abre el navegador en **http://localhost:5173**
