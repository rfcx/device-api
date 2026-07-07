"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateNames = exports.safeUrl = exports.escapeHtml = exports.DEFAULT_FROM = void 0;
exports.renderEmail = renderEmail;
const device_deployment_success_js_1 = require("./templates/device-deployment-success.js");
const types_js_1 = require("./types.js");
var layout_js_1 = require("./layout.js");
Object.defineProperty(exports, "DEFAULT_FROM", { enumerable: true, get: function () { return layout_js_1.DEFAULT_FROM; } });
var escape_js_1 = require("./escape.js");
Object.defineProperty(exports, "escapeHtml", { enumerable: true, get: function () { return escape_js_1.escapeHtml; } });
Object.defineProperty(exports, "safeUrl", { enumerable: true, get: function () { return escape_js_1.safeUrl; } });
/**
 * Registry of all known templates keyed by their stable dotted name.
 * Add new templates here as applications are migrated.
 */
const TEMPLATES = {
    'device.deploymentSuccess': device_deployment_success_js_1.deviceDeploymentSuccess
};
/**
 * Render a template by name to `{ subject, text, html }`.
 *
 * Transport-agnostic: callers wrap the result in whatever message envelope
 * their transport requires (notify gateway generic payload, Mandrill-lite, etc.).
 */
function renderEmail(templateName, data) {
    const template = TEMPLATES[templateName];
    return (0, types_js_1.renderTemplate)(template, data);
}
exports.templateNames = Object.keys(TEMPLATES);
