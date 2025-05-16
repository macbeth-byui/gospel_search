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

TODO: Link to deployed version

## Development Environment 

To recreate the development environment, you need the following software and/or libraries with the specified versions:

TODO: Add Rust dependencies

TODO: Add JS dependencies

## Useful Websites to Learn More

I found these websites useful in developing this software:

* [React Virtualized](https://github.com/bvaughn/react-virtualized)
* [Rust and WebAssembly](https://rustwasm.github.io/docs/book/)
* [React](https://react.dev/reference/react)
* [Serde JSON](https://github.com/serde-rs/json)

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [ ] Refactor the code for readability, efficiency, and documentation
* [ ] Host on a website
