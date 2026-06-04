import { defineConfig } from 'vitepress'
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Absolute path to the docs/ source dir (this file lives in docs/.vitepress/)
const DOCS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Google Analytics 4 Measurement ID 
const GA4_ID = 'G-WFWC26NZLB'

const SITE = 'https://openfpv.com.ua'

// Organization node, referenced by @id across all JSON-LD graphs
const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#org`,
  name: 'OpenFPV Ukraine',
  url: SITE,
  logo: `${SITE}/logo-light.png`,
  sameAs: ['https://github.com/Maxwell456/openipc-docs-ukr'],
}

// Top-level sections → readable name + an existing landing page (for breadcrumbs)
const SECTIONS: Record<'uk' | 'en', Record<string, { name: string; landing: string }>> = {
  uk: {
    'getting-started': { name: 'Початок роботи', landing: '/getting-started/' },
    'hardware': { name: 'Обладнання', landing: '/hardware/vtx/' },
    'software': { name: 'Програмне забезпечення', landing: '/software/apfpv' },
    'configuration': { name: 'Конфігурація', landing: '/configuration/multiconfigurator' },
    'updates': { name: 'Оновлення', landing: '/updates' },
    'links': { name: 'Корисні посилання', landing: '/links' },
  },
  en: {
    'getting-started': { name: 'Getting Started', landing: '/en/getting-started/' },
    'hardware': { name: 'Hardware', landing: '/en/hardware/vtx/' },
    'software': { name: 'Software', landing: '/en/software/apfpv' },
    'configuration': { name: 'Configuration', landing: '/en/configuration/multiconfigurator' },
    'updates': { name: 'Updates', landing: '/en/updates' },
    'links': { name: 'Links', landing: '/en/links' },
  },
}

// relativePath ('en/software/apfpv.md') → logical path ('software/apfpv'); '' = home
function logicalPath(rel: string): string {
  let p = rel.replace(/\.md$/, '').replace(/^en\//, '')
  p = p.replace(/(^|\/)index$/, '$1')
  return p
}

function ogImageFor(rel: string): string {
  if (/^(en\/)?getting-started/.test(rel)) return `${SITE}/og-started.png`
  if (/^(en\/)?hardware/.test(rel)) return `${SITE}/og-hardware.png`
  if (/^(en\/)?software/.test(rel)) return `${SITE}/og-software.png`
  if (/^(en\/)?configuration/.test(rel)) return `${SITE}/og-config.png`
  return `${SITE}/og-default.png`
}

// Old MkDocs URLs (trailing slash) → new VitePress URLs. Redirect stubs are
// generated for these in buildEnd() so existing Google rankings are preserved.
// Applied to both the root locale and the /en/ locale.
const REDIRECTS: Record<string, string> = {
  '/adaptive-link/': '/configuration/adaptive-link',
  '/advanced/': '/configuration/advanced',
  '/drone/': '/getting-started/drone',
  '/examples/': '/examples',
  '/firmware/': '/software/',
  '/firmware/apalink/': '/software/apalink',
  '/firmware/apfpv/': '/software/apfpv',
  '/firmware/apfpv-greg/': '/software/apfpv-greg',
  '/firmware/apfpv-gs/': '/software/apfpv-gs',
  '/firmware/drone-build/': '/software/drone-build',
  '/firmware/firmware-build/': '/software/firmware-build',
  '/firmware/map/': '/software/map',
  '/firmware/overview/': '/software/overview',
  '/firmware/uart-flashing/': '/configuration/uart-flash',
  '/firmware/update-settings/': '/software/update-settings',
  '/firmware/upgrading-firmware/': '/configuration/upgrading-firmware',
  '/firmware/vpn/': '/software/vpn',
  '/firmware/waybeam-venc/': '/software/waybeam-venc',
  '/firmware/waybeam-venc-install-camera/': '/software/waybeam-venc-install-camera',
  '/firmware/waybeam-venc-install-groundstation/': '/software/waybeam-venc-install-groundstation',
  '/firmware/waybeam-venc-web-interface/': '/software/waybeam-venc-web-interface',
  '/groundstation/': '/getting-started/groundstation',
  '/groundstation-build/': '/getting-started/groundstation-build',
  '/link/': '/configuration/adaptive-link',
  '/net-cards/rtl8812au/': '/hardware/net-cards/rtl8812au',
  '/net-cards/rtl8812bu/': '/hardware/net-cards/rtl8812bu',
  '/net-cards/rtl8812eu/': '/hardware/net-cards/rtl8812eu',
  '/quick-start/': '/getting-started/',
  '/telemetry/vtx-menu/': '/configuration/telemetry',
  '/troubleshooting/': '/getting-started/troubleshooting',
  '/update/': '/updates',
  '/update/posts/2025-04-23-jumbo/': '/updates/posts/2025-04-23-jumbo',
  '/update/posts/2025-04-25-webui/': '/updates/posts/2025-04-25-webui',
  '/update/posts/2025-05-30-apfpv/': '/updates/posts/2025-05-30-apfpv',
  '/update/posts/2025-07-31-apalink/': '/updates/posts/2025-07-31-apalink',
  '/update/posts/2025-09-03-openipc4g/': '/updates/posts/2025-09-03-openipc4g',
  '/update/posts/2026-04-16-waybeam-venc/': '/updates/posts/2026-04-16-waybeam-venc',
  '/vrx/emaxwyvernlinkvrx/': '/hardware/vrx/emaxwyvernlink',
  '/vrx/openipcbonnet/': '/hardware/vrx/openipcbonnet',
  '/vrx/runcamwifilinkreceiver/': '/hardware/vrx/runcam-rx',
  '/vtx/marioaio/': '/hardware/vtx/marioaio',
  '/vtx/runcamwifilink/': '/hardware/vtx/runcamwifilink',
  '/vtx/runcamwifilinkv2/': '/hardware/vtx/runcamwifilinkv2',
  '/vtx/sigmastar-ssc338q/': '/hardware/vtx/sigmastar-ssc338q',
  '/vtx/thinkerairunit/': '/hardware/vtx/thinkerairunit',
}

// Write a redirect stub (canonical + meta-refresh + JS) at <outDir>/<oldPath>/index.html
function writeRedirect(outDir: string, oldPath: string, newPath: string) {
  const target = SITE + newPath
  const html = `<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<title>Redirecting…</title>
<script>location.replace(${JSON.stringify(target)})</script>
</head>
<body>Redirecting to <a href="${target}">${target}</a>…</body>
</html>
`
  const rel = oldPath.replace(/^\//, '').replace(/\/$/, '')
  const file = resolve(outDir, rel, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

export default defineConfig({
  base: '/',
  appearance: 'dark',

  sitemap: {
    hostname: 'https://openfpv.com.ua',
    // Attach hreflang alternates to every sitemap entry (i18n SEO best practice)
    transformItems(items) {
      return items.map((item) => {
        const lp = item.url.replace(/^en\//, '').replace(/^en$/, '')
        item.links = [
          { lang: 'uk', url: `${SITE}/${lp}` },
          { lang: 'en', url: `${SITE}/en/${lp}` },
          { lang: 'x-default', url: `${SITE}/${lp}` },
        ]
        return item
      })
    }
  },

  locales: {
    root: {
      label: 'Українська',
      lang: 'uk-UA',
      title: 'OpenFPV',
      description: 'OpenIPC FPV — документація та підтримка українською. Відкрита платформа для цифрових FPV-систем.',
      themeConfig: {
        nav: [
          {
            text: 'Початок роботи',
            items: [
              { text: 'Швидкий старт', link: '/getting-started/' },
              { text: 'Налаштування дрону', link: '/getting-started/drone' },
              { text: 'Налаштування VRX', link: '/getting-started/groundstation' },
              { text: 'Збірка Radxa GS', link: '/getting-started/groundstation-build' },
              { text: 'Вирішення проблем', link: '/getting-started/troubleshooting' },
            ]
          },
          {
            text: 'Обладнання',
            items: [
              { text: 'Камери (VTX)', link: '/hardware/vtx/' },
              { text: 'Приймачі (VRX)', link: '/hardware/vrx/' },
              { text: 'Мережеві карти', link: '/hardware/network-cards' },
            ]
          },
          {
            text: 'Програмне забезпечення',
            items: [
              {
                text: 'Прошивки камер',
                items: [
                  { text: 'APFPV', link: '/software/apfpv' },
                  { text: 'WFB-NG', link: '/software/wfb-ng' },
                  { text: 'OpenIPC 4G/LTE (QuadroFleet)', link: '/software/openipc-4g' },
                ]
              },
              {
                text: 'Наземна станція',
                items: [
                  { text: 'GS Firmware APFPV (Radxa)', link: '/software/apfpv-gs' },
                ]
              },
              {
                text: 'Waybeam Venc',
                items: [
                  { text: 'Огляд', link: '/software/waybeam-venc' },
                ]
              },
            ]
          },
          {
            text: 'Конфігурація',
            items: [
              { text: 'Multiconfigurator', link: '/configuration/multiconfigurator' },
              { text: 'Телеметрія та OSD', link: '/configuration/telemetry' },
              { text: 'Adaptive-Link', link: '/configuration/adaptive-link' },
              { text: 'Розширені налаштування', link: '/configuration/advanced' },
            ]
          },
          { text: 'Корисні посилання', link: '/links' },
        ],
        sidebar: {
          '/getting-started/': [
            {
              text: 'Початок роботи',
              items: [
                { text: 'Швидкий старт', link: '/getting-started/' },
                { text: 'Налаштування дрону', link: '/getting-started/drone' },
                { text: 'Налаштування VRX', link: '/getting-started/groundstation' },
                { text: 'Збірка Radxa GS своїми руками', link: '/getting-started/groundstation-build' },
                { text: 'Вирішення проблем', link: '/getting-started/troubleshooting' },
              ]
            }
          ],
          '/hardware/': [
            {
              text: 'Камери та VTX',
              items: [
                { text: 'Огляд', link: '/hardware/vtx/' },
                { text: 'Runcam WiFiLink v1', link: '/hardware/vtx/runcamwifilink' },
                { text: 'Runcam WiFiLink v2', link: '/hardware/vtx/runcamwifilinkv2' },
                { text: 'SSC338Q + IMX415', link: '/hardware/vtx/sigmastar-ssc338q' },
                { text: 'Mario AIO', link: '/hardware/vtx/marioaio' },
                { text: 'Thinker Air Unit', link: '/hardware/vtx/thinkerairunit' },
                { text: 'EMAX Wyvern Link', link: '/hardware/vtx/emaxwyvernlink' },
              ]
            },
            {
              text: 'Приймачі (VRX)',
              items: [
                { text: 'Огляд VRX', link: '/hardware/vrx/' },
                { text: 'RunCam WiFiLink RX', link: '/hardware/vrx/runcam-rx' },
                { text: 'EMAX Wyvern VRX', link: '/hardware/vrx/emaxwyvernlink' },
                { text: 'OpenIPC Bonnet (Radxa)', link: '/hardware/vrx/openipcbonnet' },
              ]
            },
            {
              text: 'Мережеві карти',
              items: [
                { text: 'Огляд', link: '/hardware/network-cards' },
                { text: 'RTL8812AU', link: '/hardware/net-cards/rtl8812au' },
                { text: 'RTL8812EU2', link: '/hardware/net-cards/rtl8812eu' },
                { text: 'RTL8812BU', link: '/hardware/net-cards/rtl8812bu' },
              ]
            }
          ],
          '/software/': [
            {
              text: 'Прошивки камер',
              collapsed: false,
              items: [
                {
                  text: 'APFPV',
                  collapsed: false,
                  items: [
                    { text: 'APFPV', link: '/software/apfpv' },
                    { text: 'APALink', link: '/software/apalink' },
                    { text: "Greg's Firmware", link: '/software/apfpv-greg' },
                  ]
                },
                {
                  text: 'WFB-NG',
                  collapsed: false,
                  items: [
                    { text: 'Огляд', link: '/software/wfb-ng' },
                    { text: 'Конфігурація', link: '/software/wfb-ng-config' },
                    { text: 'Наземна станція (Ubuntu)', link: '/software/wfb-ng-groundstation' },
                  ]
                },
                {
                  text: 'OpenIPC 4G/LTE (QuadroFleet)',
                  collapsed: true,
                  items: [
                    { text: 'Огляд', link: '/software/openipc-4g' },
                    { text: 'Налаштування VPN', link: '/software/vpn' },
                    { text: 'Збірка прошивки', link: '/software/firmware-build' },
                    { text: 'Збірка дрону', link: '/software/drone-build' },
                    { text: 'Оновлення налаштувань', link: '/software/update-settings' },
                    { text: 'Карта навігації', link: '/software/map' },
                  ]
                },
              ]
            },
            {
              text: 'Прошивки наземної станції',
              collapsed: false,
              items: [
                { text: 'GS Firmware APFPV (Radxa)', link: '/software/apfpv-gs' },
              ]
            },
            {
              text: 'Waybeam Venc',
              collapsed: false,
              items: [
                { text: 'Огляд Waybeam Venc', link: '/software/waybeam-venc' },
                { text: 'Встановлення на камеру', link: '/software/waybeam-venc-install-camera' },
                { text: 'Встановлення на GS', link: '/software/waybeam-venc-install-groundstation' },
                { text: 'Веб-панель та API', link: '/software/waybeam-venc-web-interface' },
              ]
            },
          ],
          '/configuration/': [
            {
              text: 'Конфігурація',
              items: [
                { text: 'Multiconfigurator', link: '/configuration/multiconfigurator' },
                { text: 'Оновлення прошивки', link: '/configuration/upgrading-firmware' },
                { text: 'Прошивка через UART', link: '/configuration/uart-flash' },
                { text: 'Телеметрія та OSD (VTX Menu)', link: '/configuration/telemetry' },
                { text: 'Adaptive-Link', link: '/configuration/adaptive-link' },
                { text: 'Розширені налаштування', link: '/configuration/advanced' },
              ]
            }
          ],
          '/updates/': [
            {
              text: 'Оновлення та новини',
              items: [
                { text: 'Всі оновлення', link: '/updates' },
                { text: '16 квітня 2026 — Waybeam Venc', link: '/updates/posts/2026-04-16-waybeam-venc' },
                { text: '3 вересня 2025 — OpenIPC 4G/LTE', link: '/updates/posts/2025-09-03-openipc4g' },
                { text: '31 липня 2025 — APALink', link: '/updates/posts/2025-07-31-apalink' },
                { text: '30 травня 2025 — APFPV', link: '/updates/posts/2025-05-30-apfpv' },
                { text: '25 квітня 2025 — WebUI', link: '/updates/posts/2025-04-25-webui' },
                { text: '23 квітня 2025 — Jumbo Frame', link: '/updates/posts/2025-04-23-jumbo' },
              ]
            }
          ],
        },
        outline: { label: 'На цій сторінці', level: [2, 3] },
        docFooter: { prev: 'Попередня', next: 'Наступна' },
        lastUpdated: { text: 'Оновлено' },
        returnToTopLabel: 'Вгору',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
        lightModeSwitchTitle: 'Світла тема',
        darkModeSwitchTitle: 'Темна тема',
        footer: {
          copyright: '© 2024–2026 OpenFPV Ukraine'
        },
        editLink: {
          pattern: 'https://github.com/Maxwell456/openipc-docs-ukr/edit/main/docs/:path',
          text: 'Редагувати на GitHub'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'OpenFPV',
      description: 'OpenIPC FPV — documentation and support. Open platform for digital FPV systems.',
      themeConfig: {
        nav: [
          {
            text: 'Getting Started',
            items: [
              { text: 'Quick Start', link: '/en/getting-started/' },
              { text: 'Drone Setup', link: '/en/getting-started/drone' },
              { text: 'VRX Setup', link: '/en/getting-started/groundstation' },
              { text: 'Radxa GS Build', link: '/en/getting-started/groundstation-build' },
              { text: 'Troubleshooting', link: '/en/getting-started/troubleshooting' },
            ]
          },
          {
            text: 'Hardware',
            items: [
              { text: 'Cameras (VTX)', link: '/en/hardware/vtx/' },
              { text: 'Receivers (VRX)', link: '/en/hardware/vrx/' },
              { text: 'Network Cards', link: '/en/hardware/network-cards' },
            ]
          },
          {
            text: 'Software',
            items: [
              {
                text: 'Camera Firmware',
                items: [
                  { text: 'APFPV', link: '/en/software/apfpv' },
                  { text: 'WFB-NG', link: '/en/software/wfb-ng' },
                  { text: 'OpenIPC 4G/LTE (QuadroFleet)', link: '/en/software/openipc-4g' },
                ]
              },
              {
                text: 'Ground Station',
                items: [
                  { text: 'GS Firmware APFPV (Radxa)', link: '/en/software/apfpv-gs' },
                ]
              },
              {
                text: 'Waybeam Venc',
                items: [
                  { text: 'Overview', link: '/en/software/waybeam-venc' },
                ]
              },
            ]
          },
          {
            text: 'Configuration',
            items: [
              { text: 'Multiconfigurator', link: '/en/configuration/multiconfigurator' },
              { text: 'Telemetry & OSD', link: '/en/configuration/telemetry' },
              { text: 'Adaptive-Link', link: '/en/configuration/adaptive-link' },
              { text: 'Advanced Settings', link: '/en/configuration/advanced' },
            ]
          },
          { text: 'Links', link: '/en/links' },
        ],
        sidebar: {
          '/en/getting-started/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Quick Start', link: '/en/getting-started/' },
                { text: 'Drone Setup', link: '/en/getting-started/drone' },
                { text: 'VRX Setup', link: '/en/getting-started/groundstation' },
                { text: 'DIY Radxa GS Build', link: '/en/getting-started/groundstation-build' },
                { text: 'Troubleshooting', link: '/en/getting-started/troubleshooting' },
              ]
            }
          ],
          '/en/hardware/': [
            {
              text: 'Cameras & VTX',
              items: [
                { text: 'Overview', link: '/en/hardware/vtx/' },
                { text: 'Runcam WiFiLink v1', link: '/en/hardware/vtx/runcamwifilink' },
                { text: 'Runcam WiFiLink v2', link: '/en/hardware/vtx/runcamwifilinkv2' },
                { text: 'SSC338Q + IMX415', link: '/en/hardware/vtx/sigmastar-ssc338q' },
                { text: 'Mario AIO', link: '/en/hardware/vtx/marioaio' },
                { text: 'Thinker Air Unit', link: '/en/hardware/vtx/thinkerairunit' },
                { text: 'EMAX Wyvern Link', link: '/en/hardware/vtx/emaxwyvernlink' },
              ]
            },
            {
              text: 'Receivers (VRX)',
              items: [
                { text: 'VRX Overview', link: '/en/hardware/vrx/' },
                { text: 'RunCam WiFiLink RX', link: '/en/hardware/vrx/runcam-rx' },
                { text: 'EMAX Wyvern VRX', link: '/en/hardware/vrx/emaxwyvernlink' },
                { text: 'OpenIPC Bonnet (Radxa)', link: '/en/hardware/vrx/openipcbonnet' },
              ]
            },
            {
              text: 'Network Cards',
              items: [
                { text: 'Overview', link: '/en/hardware/network-cards' },
                { text: 'RTL8812AU', link: '/en/hardware/net-cards/rtl8812au' },
                { text: 'RTL8812EU2', link: '/en/hardware/net-cards/rtl8812eu' },
                { text: 'RTL8812BU', link: '/en/hardware/net-cards/rtl8812bu' },
              ]
            }
          ],
          '/en/software/': [
            {
              text: 'Camera Firmware',
              collapsed: false,
              items: [
                {
                  text: 'APFPV',
                  collapsed: false,
                  items: [
                    { text: 'APFPV', link: '/en/software/apfpv' },
                    { text: 'APALink', link: '/en/software/apalink' },
                    { text: "Greg's Firmware", link: '/en/software/apfpv-greg' },
                  ]
                },
                {
                  text: 'WFB-NG',
                  collapsed: false,
                  items: [
                    { text: 'Overview', link: '/en/software/wfb-ng' },
                    { text: 'Configuration', link: '/en/software/wfb-ng-config' },
                    { text: 'Ground Station (Ubuntu)', link: '/en/software/wfb-ng-groundstation' },
                  ]
                },
                {
                  text: 'OpenIPC 4G/LTE (QuadroFleet)',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/en/software/openipc-4g' },
                    { text: 'VPN Setup', link: '/en/software/vpn' },
                    { text: 'Firmware Build', link: '/en/software/firmware-build' },
                    { text: 'Drone Build', link: '/en/software/drone-build' },
                    { text: 'Update Settings', link: '/en/software/update-settings' },
                    { text: 'Map Navigation', link: '/en/software/map' },
                  ]
                },
              ]
            },
            {
              text: 'Ground Station Firmware',
              collapsed: false,
              items: [
                { text: 'GS Firmware APFPV (Radxa)', link: '/en/software/apfpv-gs' },
              ]
            },
            {
              text: 'Waybeam Venc',
              collapsed: false,
              items: [
                { text: 'Waybeam Venc Overview', link: '/en/software/waybeam-venc' },
                { text: 'Install on Camera', link: '/en/software/waybeam-venc-install-camera' },
                { text: 'Install on GS', link: '/en/software/waybeam-venc-install-groundstation' },
                { text: 'Web Panel & API', link: '/en/software/waybeam-venc-web-interface' },
              ]
            },
          ],
          '/en/configuration/': [
            {
              text: 'Configuration',
              items: [
                { text: 'Multiconfigurator', link: '/en/configuration/multiconfigurator' },
                { text: 'Upgrading Firmware', link: '/en/configuration/upgrading-firmware' },
                { text: 'UART Flashing', link: '/en/configuration/uart-flash' },
                { text: 'Telemetry & OSD (VTX Menu)', link: '/en/configuration/telemetry' },
                { text: 'Adaptive-Link', link: '/en/configuration/adaptive-link' },
                { text: 'Advanced Settings', link: '/en/configuration/advanced' },
              ]
            }
          ],
          '/en/updates/': [
            {
              text: 'Updates & News',
              items: [
                { text: 'All updates', link: '/en/updates' },
                { text: 'Apr 16 2026 — Waybeam Venc', link: '/en/updates/posts/2026-04-16-waybeam-venc' },
                { text: 'Sep 3 2025 — OpenIPC 4G/LTE', link: '/en/updates/posts/2025-09-03-openipc4g' },
                { text: 'Jul 31 2025 — APALink', link: '/en/updates/posts/2025-07-31-apalink' },
                { text: 'May 30 2025 — APFPV', link: '/en/updates/posts/2025-05-30-apfpv' },
                { text: 'Apr 25 2025 — WebUI', link: '/en/updates/posts/2025-04-25-webui' },
                { text: 'Apr 23 2025 — Jumbo Frame', link: '/en/updates/posts/2025-04-23-jumbo' },
              ]
            }
          ],
        },
        outline: { label: 'On this page', level: [2, 3] },
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdated: { text: 'Last updated' },
        footer: {
          copyright: '© 2024–2026 OpenFPV Ukraine'
        },
        editLink: {
          pattern: 'https://github.com/Maxwell456/openipc-docs-ukr/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        }
      }
    }
  },

  themeConfig: {
    logo: {
      light: '/logo-light.png',
      dark: '/logo-dark.png',
      alt: 'OpenFPV'
    },
    siteTitle: 'OpenFPV',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Maxwell456/openipc-docs-ukr' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
        },
        link: 'https://mail.google.com/mail/?view=cm&fs=1&to=openfpv.com.ua@gmail.com',
        ariaLabel: 'Email'
      }
    ],

    // Global search config — applies to all locales (merged into each).
    // detailedView shows content preview; fuzzy + prefix make matching forgiving
    // for typos and partial words; boost ranks title/heading matches higher.
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 },
            // Down-rank changelog/news posts so canonical topic pages rank first
            // (e.g. searching "4G" should surface the 4G topic, not an old update).
            boostDocument: (id: string) =>
              typeof id === 'string' && id.includes('/updates/') ? 0.2 : 1
          }
        },
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Пошук', buttonAriaLabel: 'Пошук' },
              modal: {
                displayDetails: 'Показати деталі',
                resetButtonTitle: 'Скинути пошук',
                backButtonTitle: 'Закрити пошук',
                noResultsText: 'Нічого не знайдено за запитом',
                footer: {
                  selectText: 'вибрати',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'навігація',
                  navigateUpKeyAriaLabel: 'вгору',
                  navigateDownKeyAriaLabel: 'вниз',
                  closeText: 'закрити',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          en: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                displayDetails: 'Show detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          }
        }
      }
    },
  },

  head: [
    // ── Security headers (via meta — GitHub Pages has no custom response headers) ──
    // Referrer-Policy: don't leak full URL to third parties
    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],
    // Content Security Policy — restricts allowed script/style/frame sources
    // 'unsafe-inline' is required by VitePress's hydration scripts; remove if/when
    // migrating to a server that supports nonce-based CSP injection.
    ['meta', {
      'http-equiv': 'Content-Security-Policy',
      content: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://cloudflareinsights.com",
        "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
        "worker-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ].join('; '),
    }],

    // ── Google Analytics 4 (replace G-XXXXXXXXXX with real Measurement ID) ──
    ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}` }],
    ['script', {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`],

    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3d6aff' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    ['meta', { property: 'og:site_name', content: 'OpenFPV' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@OpenFPV' }],
    // og:type, og:url, canonical, hreflang, og:locale and JSON-LD are emitted
    // per-page in transformPageData() below.
  ],

  transformPageData(pageData) {
    const rel = pageData.relativePath
    const isEn = /^en\//.test(rel)
    const lang: 'uk' | 'en' = isEn ? 'en' : 'uk'
    const lp = logicalPath(rel) // '' = home
    const isHome = lp === ''

    const ukUrl = `${SITE}/${lp}`
    const enUrl = `${SITE}/en/${lp}`
    const canonical = isEn ? enUrl : ukUrl
    const img = ogImageFor(rel)

    const title = pageData.title || 'OpenFPV'
    const desc =
      pageData.description ||
      (isEn
        ? 'OpenIPC FPV — documentation and support. Open platform for digital FPV systems.'
        : 'OpenIPC FPV — документація та підтримка українською.')

    const head = (pageData.frontmatter.head ??= [])

    // Canonical + per-page hreflang alternates — only emit a language alternate
    // when that translation actually exists on disk, otherwise hreflang points at
    // a 404 (Google flags this and it can hurt international ranking signals).
    const ukRel = isEn ? rel.replace(/^en\//, '') : rel
    const enRel = isEn ? rel : `en/${rel}`
    const ukExists = existsSync(resolve(DOCS_DIR, ukRel))
    const enExists = existsSync(resolve(DOCS_DIR, enRel))

    head.push(['link', { rel: 'canonical', href: canonical }])
    if (ukExists) head.push(['link', { rel: 'alternate', hreflang: 'uk', href: ukUrl }])
    if (enExists) head.push(['link', { rel: 'alternate', hreflang: 'en', href: enUrl }])
    // x-default points to the Ukrainian (primary) version when present
    head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: ukExists ? ukUrl : enUrl }])

    // Open Graph + Twitter (PNG images — SVG is not rendered by social platforms)
    head.push(
      ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:image', content: img }],
      ['meta', { property: 'og:locale', content: isEn ? 'en_US' : 'uk_UA' }],
      ['meta', { property: 'og:locale:alternate', content: isEn ? 'uk_UA' : 'en_US' }],
      ['meta', { name: 'twitter:image', content: img }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: desc }]
    )

    // Structured data (JSON-LD) — single @graph per page
    const inLanguage = isEn ? 'en-US' : 'uk-UA'
    const graph: any[] = [ORG]

    if (isHome) {
      graph.push({
        '@type': 'WebSite',
        name: 'OpenFPV',
        url: canonical,
        inLanguage,
        publisher: { '@id': `${SITE}/#org` },
      })
    } else {
      // Breadcrumb: Home → Section → current page
      const seg = lp.split('/')[0]
      const sec = SECTIONS[lang][seg]
      const crumbs: any[] = [
        {
          '@type': 'ListItem',
          position: 1,
          name: isEn ? 'Home' : 'Головна',
          item: isEn ? `${SITE}/en/` : `${SITE}/`,
        },
      ]
      let pos = 2
      if (sec) {
        crumbs.push({ '@type': 'ListItem', position: pos++, name: sec.name, item: `${SITE}${sec.landing}` })
      }
      crumbs.push({ '@type': 'ListItem', position: pos, name: title })
      graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs })

      graph.push({
        '@type': 'TechArticle',
        headline: title,
        description: desc,
        inLanguage,
        url: canonical,
        image: img,
        dateModified: pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : undefined,
        author: { '@id': `${SITE}/#org` },
        publisher: { '@id': `${SITE}/#org` },
      })

      // VideoObject: auto-detect YouTube embeds from the page markdown source
      const mdContent = readFileSync(resolve(DOCS_DIR, rel), 'utf-8')
      const seenVideoIds = new Set<string>()
      const ytRegex = /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g
      let ytMatch: RegExpExecArray | null
      while ((ytMatch = ytRegex.exec(mdContent)) !== null) {
        const videoId = ytMatch[1]
        if (!seenVideoIds.has(videoId)) {
          seenVideoIds.add(videoId)
          graph.push({
            '@type': 'VideoObject',
            name: title,
            description: desc,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
            inLanguage,
            publisher: { '@id': `${SITE}/#org` },
          })
        }
      }
    }

    // Opt-in FAQ rich result: add `faq: [{ q, a }]` to a page's frontmatter
    const faq = (pageData.frontmatter as any).faq
    if (Array.isArray(faq) && faq.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faq.map((item: { q: string; a: string }) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      })
    }

    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])
  },

  // Generate redirect stubs from the old MkDocs URLs (both locales) so existing
  // Google rankings carry over to the new VitePress URLs.
  buildEnd(siteConfig) {
    const outDir = siteConfig.outDir
    for (const [oldPath, newPath] of Object.entries(REDIRECTS)) {
      writeRedirect(outDir, oldPath, newPath)
      writeRedirect(outDir, '/en' + oldPath, '/en' + newPath)
    }
  },

  markdown: { lineNumbers: true },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  ignoreDeadLinks: false,
})
