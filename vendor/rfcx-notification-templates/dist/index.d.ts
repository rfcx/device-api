import type { DeviceDeploymentSuccessData } from './templates/device-deployment-success.js';
import type { RenderedEmail } from './types.js';
export type { RenderedEmail, TemplateDefinition } from './types.js';
export type { Brand } from './layout.js';
export { DEFAULT_FROM } from './layout.js';
export { escapeHtml, safeUrl } from './escape.js';
export type { DeviceDeploymentSuccessData, DeviceType } from './templates/device-deployment-success.js';
/**
 * Maps each template name to its typed data shape so `renderEmail` is fully
 * type-checked at every call site.
 */
export interface TemplateDataMap {
    'device.deploymentSuccess': DeviceDeploymentSuccessData;
}
export type TemplateName = keyof TemplateDataMap;
/**
 * Render a template by name to `{ subject, text, html }`.
 *
 * Transport-agnostic: callers wrap the result in whatever message envelope
 * their transport requires (notify gateway generic payload, Mandrill-lite, etc.).
 */
export declare function renderEmail<TName extends TemplateName>(templateName: TName, data: TemplateDataMap[TName]): RenderedEmail;
export declare const templateNames: TemplateName[];
