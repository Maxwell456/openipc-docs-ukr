<div align="center">

<a href="https://openfpv.com.ua">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/public/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/public/logo-light.png">
    <img src="docs/public/logo-light.png" alt="OpenFPV" width="260">
  </picture>
</a>

<h3>Open documentation for digital FPV systems built on OpenIPC</h3>

<p>From choosing hardware to a working low-latency video link in the air,<br>in Ukrainian and English.</p>

<p>
  <a href="https://openfpv.com.ua"><img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fopenfpv.com.ua&style=flat-square&label=website&up_message=online&up_color=3d6aff"></a>
  <img alt="Languages: Ukrainian, English" src="https://img.shields.io/badge/languages-UK%20%7C%20EN-3d6aff?style=flat-square">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-3d6aff?style=flat-square"></a>
</p>

<p>
  <a href="https://openfpv.com.ua/getting-started/"><strong>Get started</strong></a>
  &nbsp;·&nbsp;
  <a href="https://openfpv.com.ua/en/"><strong>English</strong></a>
  &nbsp;·&nbsp;
  <a href="https://openfpv.com.ua/faq"><strong>FAQ</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/Maxwell456/openipc-docs-ukr/issues/new"><strong>Report an issue</strong></a>
</p>

</div>

<br>

## About

**OpenFPV** is a community documentation site for building digital FPV video links on [OpenIPC](https://github.com/OpenIPC) firmware. It collects in one place what is usually scattered across forums and chats: which cameras and adapters work, how to flash the firmware, what each setting does, and what to check when there is no picture.

> [!NOTE]
> OpenFPV is an independent community project and is not affiliated with or endorsed by OpenIPC.

<br>

## Documentation

<table>
  <tr>
    <td width="33%" valign="top">
      <img src=".github/assets/icons/rocket.svg" width="40" height="40" alt=""><br>
      <a href="https://openfpv.com.ua/getting-started/"><strong>Getting Started</strong></a><br>
      <sub>Quick start, platform comparison, air unit and ground station builds, troubleshooting</sub>
    </td>
    <td width="33%" valign="top">
      <img src=".github/assets/icons/cpu.svg" width="40" height="40" alt=""><br>
      <a href="https://openfpv.com.ua/hardware/vtx/"><strong>Hardware</strong></a><br>
      <sub>Cameras (VTX), receivers (VRX) and compatible Wi-Fi adapters</sub>
    </td>
    <td width="33%" valign="top">
      <img src=".github/assets/icons/code.svg" width="40" height="40" alt=""><br>
      <a href="https://openfpv.com.ua/software/"><strong>Software</strong></a><br>
      <sub>APFPV, APALink, WFB-NG, Waybeam Venc, 4G/LTE, fiber-optic link, PixelPilot</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <img src=".github/assets/icons/sliders.svg" width="40" height="40" alt=""><br>
      <a href="https://openfpv.com.ua/configuration/"><strong>Configuration</strong></a><br>
      <sub>Companion configurator, firmware flashing, telemetry and OSD, Adaptive-Link</sub>
    </td>
    <td width="33%" valign="top">
      <img src=".github/assets/icons/timer.svg" width="40" height="40" alt=""><br>
      <a href="https://openfpv.com.ua/tools/latency-timer"><strong>Tools</strong></a><br>
      <sub>Interactive utilities, such as the glass-to-glass latency timer</sub>
    </td>
    <td width="33%" valign="top">
      <img src=".github/assets/icons/bell.svg" width="40" height="40" alt=""><br>
      <a href="https://openfpv.com.ua/updates"><strong>Updates</strong></a><br>
      <sub>Release notes and project news</sub>
    </td>
  </tr>
</table>

<br>

## Features

<table>
  <tr>
    <td width="50%" valign="top">
      <img src=".github/assets/icons/languages.svg" width="40" height="40" alt=""><br>
      <strong>Two languages</strong><br>
      <sub>Every page is available in Ukrainian and English.</sub>
    </td>
    <td width="50%" valign="top">
      <img src=".github/assets/icons/calculator.svg" width="40" height="40" alt=""><br>
      <strong>Interactive guides</strong><br>
      <sub>Built-in tools such as a WFB-NG bitrate calculator, a latency timer and link diagrams.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src=".github/assets/icons/search.svg" width="40" height="40" alt=""><br>
      <strong>Fast search</strong><br>
      <sub>Full-text search across the whole site, right in the browser.</sub>
    </td>
    <td width="50%" valign="top">
      <img src=".github/assets/icons/smartphone.svg" width="40" height="40" alt=""><br>
      <strong>Works offline</strong><br>
      <sub>Install the site on your phone and read it in the field without a connection.</sub>
    </td>
  </tr>
</table>

<br>

## Running locally

Requires [Node.js](https://nodejs.org) 18 or later.

```bash
git clone https://github.com/Maxwell456/openipc-docs-ukr.git
cd openipc-docs-ukr
npm install
npm run dev
```

Open <http://localhost:5173>. Ukrainian content is served at `/`, English content at `/en/`.

<br>

## Contributing

Contributions are welcome, whether a typo fix, a new guide or a translation.

1. Fork the repository and create a branch.
2. Make your changes. Pages live in `docs/` (Ukrainian) and `docs/en/` (English); please update both.
3. Run `npm run build` to check for broken links.
4. Open a pull request with a short description of the change.

> [!TIP]
> Found a mistake while reading? Select the text on the page and press **Bug?** to open a pre-filled issue.

<br>

## Support

OpenFPV is maintained by volunteers. If the project helped you, see the [support page](https://openfpv.com.ua/support).

## License

Released under the [MIT License](LICENSE). OpenIPC, third-party firmware and product names belong to their respective owners.

<br>

<div align="center">
  <sub>Made by the Ukrainian OpenIPC community</sub>
</div>
