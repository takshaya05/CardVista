# CARDVISTA

## Tagline

**Scan. View. Connect.**

## Overview

CardVista is an AR-enabled digital visiting card platform that allows users to create, upload, view, manage, scan, and share digital visiting cards. The system combines WebAR, QR code scanning, 3D visualization, and interactive contact features to provide a modern and engaging networking experience directly through the browser.

## Features

* **Digital Card Management:** Upload, view, edit, and delete digital visiting cards.
* **WebAR & 3D Visualization:** Display interactive holographic cards with rotation, zoom, avatars, particles, and voice introductions.
* **QR Code Scanning:** Scan digital visiting cards using uploaded QR images or a webcam.
* **Interactive Contact Actions:** Quickly access Call, Email, Website, Maps, LinkedIn, and Instagram.
* **Customizable AR Scenes:** Select different environments, theme colors, background effects, and music.

## Tech Stack

* **React.js:** Build the interactive user interface.
* **Vite:** Provide fast development and optimized frontend builds.
* **Node.js & Express.js:** Provide the JavaScript runtime environment and backend framework for building the server, REST APIs, routing, and request handling.
* **MongoDB:** Store user accounts, digital card details, contact information, AR preferences, and related application data.
* **Three.js:** Support browser-based 3D visualization and interactive AR-style card experiences.

## Project Structure

* client/
  * src/
    * components/
      * footer
      * header
    * pages/
      * about
      * home
      * dashboard
      * arsimulation
      * scansection
      * uploadsection
      * viewsection
* server/
  * models/
  * routes/
  * controllers/
  * config/
  * server.js