<div align="center">

# OpenIPC FPV — Documentation in Ukrainian

Comprehensive technical documentation of the OpenIPC project for FPV pilots

[![Website](https://img.shields.io/badge/Website-openfpv.com.ua-blue?style=flat-square&logo=googlechrome&logoColor=white)](https://openfpv.com.ua)
[![GitHub](https://img.shields.io/badge/GitHub-OpenFPV-181717?style=flat-square&logo=github)](https://github.com/Maxwell456/openipc-docs-ukr)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
<img src="https://img.shields.io/badge/Language-Ukrainian-yellow?style=flat-square&logo=googletranslate&logoColor=white" alt="Ukrainian">

---

[**View Documentation Online**](https://openfpv.com.ua)

</div>

---

## Project Overview

**OpenIPC** is an open-source platform for IP cameras, optimized for digital FPV systems. This repository contains the full translation and adaptation of the technical documentation into Ukrainian, aimed at assisting in the configuration and operation of OpenIPC-based systems.

## Key Documentation Areas

*   **Hardware**: Guides for VTX (Mario AIO, Thinker, Runcam), VRX (OpenIPC Bonnet, Emax Wyvern), and network adapters (RTL8812EU/AU/BU).
*   **Software**: Overviews of APFPV, WFB-NG, APALink firmware, and specialized 4G/LTE FPV systems.
*   **Configuration**: Instructions for telemetry setup, OSD, VTXMenu, and adaptive bitrate.
*   **Troubleshooting**: Common issue resolution and performance optimization.

## Quick Start

### Local Deployment

To preview the documentation locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/Maxwell456/openipc-docs-ukr.git
cd openipc-docs-ukr

# Install dependencies
pip install mkdocs-material mkdocs-static-i18n

# Start the local development server
mkdocs serve
```

The documentation will be available at `http://127.0.0.1:8000`.

### Docker Usage

<details>
<summary>Show Docker Commands</summary>

**Build image:**
```bash
docker build -t openipc-docs .
```

**Run container:**
```bash
docker run -d --name openipc-docs -p 8888:80 openipc-docs
```

**Stop and remove container:**
```bash
docker stop openipc-docs && docker rm openipc-docs
```

</details>

## Repository Structure

| Path | Description |
| :--- | :--- |
| **docs/uk** | Primary documentation content in Ukrainian |
| **docs/en** | English version (for synchronization) |
| **mkdocs.yml** | Site structure and plugin configuration |
| **Dockerfile** | Containerization setup |

## Contributing

Contributions from the community are welcome. You can help by:

1.  **Reporting Issues**: Use the [Issue Tracker](https://github.com/Maxwell456/openipc-docs-ukr/issues/new) for bugs or suggestions.
2.  **Submitting Changes**: Create a Pull Request with fixes or new content.
3.  **Localization**: Assist in translating new sections from the official documentation.

### Pull Request Process

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add descriptive message'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Maintained by the Ukrainian FPV Community

[![GitHub Stars](https://img.shields.io/github/stars/Maxwell456/openipc-docs-ukr?style=social)](https://github.com/Maxwell456/openipc-docs-ukr/stargazers)

</div>

