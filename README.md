## Overview

**Project Title**

Gospel Search

**Project Description**

Search for words and phrases in the scriptures

**Project Goals**

Integration of Rust WASM (Web Assembly) and React

## Instructions for Build and Use

Initial Setup (Once):
* root: `rustup update`
* root: `cargo install wasm-pack`
* root: `npm install npm@latest -g`

Create Rust Project (Once)
* root: `cargo init gospel_search`
* gospel_search: `cargo add wasm-bindgen`

Generate WASM from Rust (Repeat when Rust code changes):
* gospel_search: `wasm-pack build --target web`

Create React Project  (Once)
* gospel_search: `npx create-react-app app`
* gospel_search/app/package.json: Add `"wasm-gospel-search" : "file:../pkg"`
* gospel_search/app: `npm install`
* gospel_search/app/App.js: Add `import init, { function_names } from 'wasm-gospel-search';`

Run React Project (Repeat when WASM changes)
* gospel_search/app: `npm start`

[https://gospel-search.onrender.com](https://gospel-search.onrender.com)

## Development Environment 

To recreate the development environment, you need the following software and/or libraries with the specified versions:

Rust Dependencies:
* wasm-bindgen = "0.2.100"
* js-sys = "0.3"
* serde = { version = "1.0", features = ["derive"] }
* serde_json = "1.0"
* regex = "1.11.1"
* wasm-bindgen-futures = "0.4.50"
* serde-wasm-bindgen = "0.6.5"

JavaScript Dependencies:
* "react": "^19.1.0",
* "react-dom": "^19.1.0",
* "react-scripts": "5.0.1",
* "react-virtualized": "^9.22.6",
* "wasm-gospel-search": "file:../pkg",

## Useful Websites to Learn More

I found these websites useful in developing this software:

* [React Virtualized](https://github.com/bvaughn/react-virtualized)
* [Rust and WebAssembly](https://rustwasm.github.io/docs/book/)
* [React](https://react.dev/reference/react)
* [Serde JSON](https://github.com/serde-rs/json)

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [x] Refactor the code for readability, efficiency, and documentation
* [x] Host on a website
