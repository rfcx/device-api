# @rfcx/notification-templates

Shared, **transport-agnostic** transactional email rendering for RFCx / Arbimon
applications. Produces `{ subject, text, html }` from typed data. It does **not**
send email — callers hand the result to their transport (the `notify.rfcx.org`
gateway, Mandrill, etc.).

## Why

Today each app hand-rolls its own HTML (device-api Handlebars, rfcx-api
Handlebars views, arbimon-legacy EJS + string concat, arbimon CLI TS template
strings). Branding, footers and escaping drift apart. This package centralizes
the layout, footer and per-template copy behind one typed API.

## Design

- **Zero runtime dependencies.** Pure TypeScript string templates + a tiny HTML
  escaper. No Handlebars/EJS in the dependency tree, so any Node app (CJS or
  ESM) can consume it without engine or loader friction.
- **Transport stays out.** The package never performs IO. Routing (`to`,
  `from`, `bcc`) belongs to the caller / notify gateway.
- **Typed at the call site.** `renderEmail(name, data)` is fully type-checked
  via a `TemplateName -> data shape` map.
- **Shared layout/footer.** Every template renders inside `renderLayout`, so the
  header banner and RFCx footer are identical everywhere.
- **Snapshot tests.** HTML output is locked with Vitest snapshots to catch
  accidental branding/markup regressions.

## Usage

```ts
import { renderEmail } from '@rfcx/notification-templates'

const { subject, text, html } = renderEmail('device.deploymentSuccess', {
  deviceType: 'AudioMoth',
  date: deployedAt.toLocaleDateString(),
  time: deployedAt.toLocaleTimeString()
})

// Then hand to your transport (notify gateway generic payload):
await axios.post(EMAIL_SEND_URL, {
  to: [{ email: user.email, name: user.name }],
  from: { email: 'contact@rfcx.org', name: 'Rainforest Connection' },
  subject,
  text,
  html
}, { headers: { Authorization: `Bearer ${EMAIL_SEND_TOKEN}` } })
```

`DEFAULT_FROM` provides the conventional from address per brand:

```ts
import { DEFAULT_FROM } from '@rfcx/notification-templates'
DEFAULT_FROM.rfcx    // { email: 'contact@rfcx.org', name: 'Rainforest Connection' }
DEFAULT_FROM.arbimon // { email: 'no-reply@arbimon.org', name: 'Arbimon' }
```

## Templates

| Name                        | Data shape                                            | Migrated from |
| --------------------------- | ----------------------------------------------------- | ------------- |
| `device.deploymentSuccess`  | `{ deviceType, date, time }`                          | device-api `deploy-success-email-template.html` |

Planned (not yet migrated): `arbimon.projectBackup`,
`arbimon.exportDetections`, `arbimon.projectBackupFailed` (arbimon CLI),
`user.activateAccount`, `user.resetPassword` (arbimon-legacy),
`support.contactForm`, `alerts.event` (rfcx-api), `support.userFeedback`
(device-api).

## Adding a template

1. Create `src/templates/<name>.ts` exporting a `TemplateDefinition<TData>`.
2. Register it in `src/index.ts` (`TEMPLATES` + `TemplateDataMap`).
3. Add tests + snapshot in `src/index.test.ts`.

## Scripts

```sh
npm install
npm test        # vitest (unit + snapshots)
npm run build   # tsup -> dist (esm + cjs + d.ts)
npm run typecheck
```

## Distribution options

This package is intentionally standalone and buildable in isolation. See the
staged rollout plan in the PR description for how it is expected to be consumed
(git tag/tarball first, private npm registry later). Until a publish/auth path
is agreed, consumers should pin a tarball or git ref rather than a registry
version.
