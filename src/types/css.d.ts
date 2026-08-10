/**
 * Declaraciones ambient para imports de CSS en el bundle web (react-native-web).
 * Sin estas, TypeScript no reconoce `import './x.module.css'` ni
 * `import '@/global.css'` como módulos válidos, aunque los archivos existan.
 */

declare module "*.module.css" {
  const classes: { readonly [className: string]: string };
  export default classes;
}

declare module "*.css";
