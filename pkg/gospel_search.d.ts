/* tslint:disable */
/* eslint-disable */
export class Gospel {
  free(): void;
  constructor(bom_json: string, dc_json: string, nt_json: string, ot_json: string, pogp_json: string);
  search_async(text: string, params: SearchParams): Promise<any>;
}
export class SearchParams {
  free(): void;
  constructor();
  copy(): SearchParams;
  bom: boolean;
  ot: boolean;
  nt: boolean;
  dc: boolean;
  pogp: boolean;
  word: boolean;
  case: boolean;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_searchparams_free: (a: number, b: number) => void;
  readonly __wbg_get_searchparams_bom: (a: number) => number;
  readonly __wbg_set_searchparams_bom: (a: number, b: number) => void;
  readonly __wbg_get_searchparams_ot: (a: number) => number;
  readonly __wbg_set_searchparams_ot: (a: number, b: number) => void;
  readonly __wbg_get_searchparams_nt: (a: number) => number;
  readonly __wbg_set_searchparams_nt: (a: number, b: number) => void;
  readonly __wbg_get_searchparams_dc: (a: number) => number;
  readonly __wbg_set_searchparams_dc: (a: number, b: number) => void;
  readonly __wbg_get_searchparams_pogp: (a: number) => number;
  readonly __wbg_set_searchparams_pogp: (a: number, b: number) => void;
  readonly __wbg_get_searchparams_word: (a: number) => number;
  readonly __wbg_set_searchparams_word: (a: number, b: number) => void;
  readonly __wbg_get_searchparams_case: (a: number) => number;
  readonly __wbg_set_searchparams_case: (a: number, b: number) => void;
  readonly searchparams_new: () => number;
  readonly searchparams_copy: (a: number) => number;
  readonly __wbg_gospel_free: (a: number, b: number) => void;
  readonly gospel_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly gospel_search_async: (a: number, b: number, c: number, d: number) => any;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly closure32_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure49_externref_shim: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
