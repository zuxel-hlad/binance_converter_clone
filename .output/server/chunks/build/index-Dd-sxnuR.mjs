import { useSSRContext, defineComponent, mergeProps, ref, computed, unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, toDisplayString, withAsyncContext, watchEffect, watch, createTextVNode, isRef, shallowRef, toRef, getCurrentInstance, onServerPrefetch } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { u as useRouter, g as useRoute, b as useNuxtApp, e as asyncDataDefaults, _ as _export_sfc, f as createError } from './server.mjs';
import { XMarkIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/vue/24/solid';
import { binanceCryptoIcons } from 'binance-icons';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h;
  var _b;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, _handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  const handler = _handler ;
  const getDefault = () => asyncDataDefaults.value;
  const getDefaultCachedData = () => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key];
  options.server = (_a2 = options.server) != null ? _a2 : true;
  options.default = (_b2 = options.default) != null ? _b2 : getDefault;
  options.getCachedData = (_c = options.getCachedData) != null ? _c : getDefaultCachedData;
  options.lazy = (_d = options.lazy) != null ? _d : false;
  options.immediate = (_e = options.immediate) != null ? _e : true;
  options.deep = (_f = options.deep) != null ? _f : asyncDataDefaults.deep;
  options.dedupe = (_g = options.dedupe) != null ? _g : "cancel";
  const initialCachedData = options.getCachedData(key, nuxtApp);
  const hasCachedData = initialCachedData != null;
  if (!nuxtApp._asyncData[key] || !options.immediate) {
    (_h = (_b = nuxtApp.payload._errors)[key]) != null ? _h : _b[key] = asyncDataDefaults.errorValue;
    const _ref = options.deep ? ref : shallowRef;
    nuxtApp._asyncData[key] = {
      data: _ref(hasCachedData ? initialCachedData : options.default()),
      pending: ref(!hasCachedData),
      error: toRef(nuxtApp.payload._errors, key),
      status: ref("idle"),
      _default: options.default
    };
  }
  const asyncData = { ...nuxtApp._asyncData[key] };
  delete asyncData._default;
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    var _a3;
    if (nuxtApp._asyncDataPromises[key]) {
      if (isDefer((_a3 = opts.dedupe) != null ? _a3 : options.dedupe)) {
        return nuxtApp._asyncDataPromises[key];
      }
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    if (opts._initial || nuxtApp.isHydrating && opts._initial !== false) {
      const cachedData = opts._initial ? initialCachedData : options.getCachedData(key, nuxtApp);
      if (cachedData != null) {
        return Promise.resolve(cachedData);
      }
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxtApp));
        } catch (err) {
          reject(err);
        }
      }
    ).then(async (_result) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = await options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      nuxtApp.payload.data[key] = result;
      asyncData.data.value = result;
      asyncData.error.value = asyncDataDefaults.errorValue;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      asyncData.error.value = createError(error);
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      delete nuxtApp._asyncDataPromises[key];
    });
    nuxtApp._asyncDataPromises[key] = promise;
    return nuxtApp._asyncDataPromises[key];
  };
  asyncData.clear = () => clearNuxtDataByKey(nuxtApp, key);
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    nuxtApp._asyncData[key].pending.value = false;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const _imports_0 = "data:image/svg+xml,%3c?xml%20version='1.0'%20?%3e%3csvg%20height='256px'%20version='1.1'%20viewBox='0%200%20256%20256'%20width='256px'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ctitle/%3e%3cdesc/%3e%3cdefs/%3e%3cg%20fill='none'%20fill-rule='evenodd'%20id='Classic'%20stroke='none'%20stroke-width='1'%3e%3cg%20fill='%23F3BA2F'%20id='Binance-Coin'%20transform='translate(-1570.000000,%20-2488.000000)'%3e%3cg%20transform='translate(1570.000000,%202488.000000)'%3e%3cpolygon%20id='Fill-3'%20points='8.30912153%20147.721013%2048.4291093%20147.721013%2048.4291093%20107.601025%208.30912153%20107.601025'%20transform='translate(28.369115,%20127.661019)%20rotate(-45.000000)%20translate(-28.369115,%20-127.661019)%20'/%3e%3cpolygon%20id='Fill-3'%20points='206.892929%20147.721013%20247.012917%20147.721013%20247.012917%20107.601025%20206.892929%20107.601025'%20transform='translate(226.952923,%20127.661019)%20rotate(-45.000000)%20translate(-226.952923,%20-127.661019)%20'/%3e%3cpolygon%20id='Fill-3'%20points='107.601025%20147.721013%20147.721013%20147.721013%20147.721013%20107.601025%20107.601025%20107.601025'%20transform='translate(127.661019,%20127.661019)%20rotate(-45.000000)%20translate(-127.661019,%20-127.661019)%20'/%3e%3cpath%20d='M182.826002,42.9100781%20L182.826002,22.8500842%20L72.4960362,22.8500842%20L72.4960362,62.970072%20L142.706015,62.970072%20L142.706015,133.180051%20L182.826002,133.180051%20L182.826002,42.9100781%20Z'%20id='Combined-Shape'%20transform='translate(127.661019,%2078.015067)%20rotate(-45.000000)%20translate(-127.661019,%20-78.015067)%20'/%3e%3cpath%20d='M182.826002,142.201982%20L182.826002,122.141988%20L72.4960362,122.141988%20L72.4960362,162.261976%20L142.706015,162.261976%20L142.706015,232.471954%20L182.826002,232.471954%20L182.826002,142.201982%20Z'%20id='Combined-Shape'%20transform='translate(127.661019,%20177.306971)%20rotate(-225.000000)%20translate(-127.661019,%20-177.306971)%20'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  props: {
    assets: {}
  },
  emits: ["close-dialog", "on-asset-selected"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const searchValue = ref("");
    const searchedAssets = computed(() => {
      const assets = [...props.assets];
      if (assets && assets.length) {
        return assets.filter(
          ({ assetName, assetFullName }) => assetName.toLowerCase().includes(searchValue.value.toLowerCase()) || assetFullName.toLowerCase().includes(searchValue.value)
        );
      }
      return [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "size-full overflow-hidden rounded-xl border border-input-border bg-dark-gray pb-6 md:h-[512px] md:w-[520px]" }, _attrs))}><div class="flex items-end justify-between gap-3 px-6 py-[18px]"><h3 class="text-xl font-semibold text-white">Select token</h3><button type="button">`);
      _push(ssrRenderComponent(unref(XMarkIcon), {
        class: "size-6 text-white",
        onClick: ($event) => emit("close-dialog")
      }, null, _parent));
      _push(`</button></div><div class="relative h-14 px-6 py-2">`);
      _push(ssrRenderComponent(unref(MagnifyingGlassIcon), { class: "absolute left-9 top-1/2 size-5 -translate-y-1/2 text-gray-hover" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchValue))} type="text" class="size-full rounded-lg border border-input-border bg-transparent pl-9 pr-3 text-sm font-medium text-white caret-focused-input outline-none transition-colors placeholder:text-gray-hover hover:border-focused-input" placeholder="Search" tabindex="0"></div>`);
      _push(ssrRenderComponent(unref(PerfectScrollbar), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="ml-[-12px] overflow-y-auto px-6 py-2"${_scopeId}>`);
            if (unref(searchValue).length && !unref(searchedAssets).length) {
              _push2(`<span class="block w-full text-center text-gray-hover"${_scopeId}>Assets not found.</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (!unref(searchValue).length && !unref(searchedAssets).length) {
              _push2(`<span class="block w-full text-center text-gray-hover"${_scopeId}>No assets now.</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(unref(searchedAssets), (asset, idx) => {
              var _a;
              _push2(`<div class="flex cursor-pointer items-center rounded-lg px-3 py-2 transition-colors hover:bg-black"${_scopeId}>`);
              if (unref(binanceCryptoIcons).has(asset.assetName.toLocaleLowerCase())) {
                _push2(`<div class="mr-[10px] shrink-0 [&amp;&gt;svg]:size-5"${_scopeId}>${(_a = unref(binanceCryptoIcons).get(asset.assetName.toLocaleLowerCase())) != null ? _a : ""}</div>`);
              } else {
                _push2(`<div class="mr-[10px] size-5 shrink-0 rounded-full bg-gray-200"${_scopeId}><img${ssrRenderAttr("src", _imports_0)}${ssrRenderAttr("alt", asset.assetFullName)}${_scopeId}></div>`);
              }
              _push2(`<div class="mr-[10px] flex grow flex-col"${_scopeId}><span class="text-sm font-medium uppercase text-white"${_scopeId}>${ssrInterpolate(asset.assetName)}</span><span class="text-gray-hover"${_scopeId}>${ssrInterpolate(asset.assetFullName)}</span></div>`);
              _push2(ssrRenderComponent(unref(StarIcon), { class: "size-5 text-sm font-normal text-gray-hover" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "ml-[-12px] overflow-y-auto px-6 py-2" }, [
                unref(searchValue).length && !unref(searchedAssets).length ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "block w-full text-center text-gray-hover"
                }, "Assets not found.")) : createCommentVNode("", true),
                !unref(searchValue).length && !unref(searchedAssets).length ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: "block w-full text-center text-gray-hover"
                }, "No assets now.")) : createCommentVNode("", true),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(searchedAssets), (asset, idx) => {
                  return openBlock(), createBlock("div", {
                    key: idx,
                    class: "flex cursor-pointer items-center rounded-lg px-3 py-2 transition-colors hover:bg-black",
                    onClick: ($event) => emit("on-asset-selected", asset.assetName)
                  }, [
                    unref(binanceCryptoIcons).has(asset.assetName.toLocaleLowerCase()) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mr-[10px] shrink-0 [&>svg]:size-5",
                      innerHTML: unref(binanceCryptoIcons).get(asset.assetName.toLocaleLowerCase())
                    }, null, 8, ["innerHTML"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "mr-[10px] size-5 shrink-0 rounded-full bg-gray-200"
                    }, [
                      createVNode("img", {
                        src: _imports_0,
                        alt: asset.assetFullName
                      }, null, 8, ["alt"])
                    ])),
                    createVNode("div", { class: "mr-[10px] flex grow flex-col" }, [
                      createVNode("span", { class: "text-sm font-medium uppercase text-white" }, toDisplayString(asset.assetName), 1),
                      createVNode("span", { class: "text-gray-hover" }, toDisplayString(asset.assetFullName), 1)
                    ]),
                    createVNode(unref(StarIcon), { class: "size-5 text-sm font-normal text-gray-hover" })
                  ], 8, ["onClick"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/assets-dialog/index.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<button${ssrRenderAttrs(mergeProps({ class: "rounded-lg bg-primary px-2 py-[6px] font-normal text-binance transition-colors hover:bg-primary-hover active:bg-primary-active disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</button>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/app-button/index.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const appButton = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender]]);
const API_URL = "https://api.binance.com";
const API_KEY = "NDvcdHve3wbb3n9jX9X11lUjvx7zIknMTFpLpIVZjebIRM67arI8S0hPs107MHcg";
const BASE_FROM_ASSET = "USDT";
const BASE_TO_ASSET = "BTC";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  props: {
    badge: {},
    modelValue: {},
    assetName: {},
    priceInUsd: {},
    isError: { type: Boolean },
    placeholder: {},
    maxAmount: {},
    minAmount: {}
  },
  emits: ["change-asset", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const isInputFocused = ref(false);
    const props = __props;
    const isMinAmountValid = computed(() => {
      if (props.modelValue.length && props.minAmount && props.modelValue < props.minAmount) {
        return true;
      }
      return false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex w-full flex-col items-start justify-start" }, _attrs))}><div class="${ssrRenderClass([{ "!border-focused-input": unref(isInputFocused), "!border-red-500": _ctx.isError || unref(isMinAmountValid) }, "flex w-full flex-col gap-4 rounded-xl border border-main-gray p-4 caret-focused-input transition-colors hover:border-gray-hover"])}"><div class="flex items-center justify-between gap-3"><span class="capitalize text-white">${ssrInterpolate((_a = _ctx.badge) != null ? _a : "-")}</span><span class="text-white">Balance:\xA0--\xA0${ssrInterpolate((_b = _ctx.assetName) != null ? _b : "-")}</span></div><div class="flex w-full items-center justify-between"><div class="relative flex w-full flex-col"><input${ssrRenderAttr("value", _ctx.modelValue)} autocomplete="off"${ssrRenderAttr("placeholder", (_c = _ctx.placeholder) != null ? _c : "0.00 - 00000")} class="h-7 w-full border-none bg-transparent text-xl font-medium text-white outline-none placeholder:text-gray-hover">`);
      if (_ctx.assetName !== unref(BASE_FROM_ASSET)) {
        _push(`<span class="text-xs font-normal text-gray-hover">\u2248\xA0$${ssrInterpolate(_ctx.modelValue.length && !isNaN(parseFloat(_ctx.priceInUsd)) ? parseFloat((Number(_ctx.modelValue) * Number(_ctx.priceInUsd)).toFixed(8)) : "0.00")}</span>`);
      } else {
        _push(`<span class="text-xs font-normal text-gray-hover">\u2248\xA0$${ssrInterpolate(_ctx.modelValue.length ? parseFloat(Number(_ctx.modelValue).toFixed(8)) : "0.00")}</span>`);
      }
      _push(`</div><button type="button" class="flex w-max shrink-0 items-center justify-end [&amp;&gt;svg]:hover:text-white" tabindex="-1">`);
      if (unref(binanceCryptoIcons).has(_ctx.assetName.toLocaleLowerCase())) {
        _push(`<div class="mr-[10px] shrink-0 [&amp;&gt;svg]:size-5">${(_d = unref(binanceCryptoIcons).get(_ctx.assetName.toLocaleLowerCase())) != null ? _d : ""}</div>`);
      } else {
        _push(`<div class="mr-[10px] size-5 shrink-0 rounded-full bg-gray-200"><img${ssrRenderAttr("src", _imports_0)}${ssrRenderAttr("alt", _ctx.assetName + "token")}></div>`);
      }
      _push(`<span class="text-base font-medium text-white">${ssrInterpolate(_ctx.assetName.toUpperCase())}</span>`);
      _push(ssrRenderComponent(unref(ChevronDownIcon), { class: "ml-2 size-5 shrink-0 text-gray-hover transition-colors" }, null, _parent));
      _push(`</button></div></div>`);
      if (unref(isMinAmountValid)) {
        _push(`<span class="block font-light text-red-500">Amount is less than the minimum amount (${ssrInterpolate(_ctx.minAmount)} ${ssrInterpolate(_ctx.assetName)}).</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/app-input/index.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (_ctx.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed flex h-screen w-screen items-center justify-center bg-black/50" }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/app-modal/index.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const getAllAssets = async () => {
  return await $fetch(`${API_URL}/sapi/v1/margin/allAssets`, {
    method: "GET",
    headers: {
      "X-MBX-APIKEY": API_KEY
    }
  });
};
const getConvertPairs = async () => {
  return await $fetch(`${API_URL}/sapi/v1/convert/exchangeInfo?`);
};
const getConvertPairsPrice = async () => {
  return await $fetch(`${API_URL}/api/v3/ticker/price`);
};
var FieldType = /* @__PURE__ */ ((FieldType2) => {
  FieldType2["FROM"] = "From";
  FieldType2["TO"] = "To";
  return FieldType2;
})(FieldType || {});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fromAsset = ref(BASE_FROM_ASSET);
    const toAsset = ref(BASE_TO_ASSET);
    const assetSource = ref(null);
    const assetDialog = ref(false);
    const isInvalidConvertPair = ref(false);
    const isReversed = ref(false);
    const fromAssetValue = ref("");
    const toAssetValue = ref("");
    const pairObj = ref({
      fromAsset: fromAsset.value,
      toAsset: toAsset.value,
      fromAssetMinAmount: "0",
      fromAssetMaxAmount: "0",
      toAssetMinAmount: "0",
      toAssetMaxAmount: "0",
      fromIsBase: false
    });
    const router = useRouter();
    const route = useRoute();
    const { data: marginAssets } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("margin-assets", getAllAssets)), __temp = await __temp, __restore(), __temp);
    const { data: convertPairs } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("convert-pair", getConvertPairs)), __temp = await __temp, __restore(), __temp);
    const { data: convertPairsPrice } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("convert-pairs-price", getConvertPairsPrice)), __temp = await __temp, __restore(), __temp);
    const onAssetSelected = (assetName) => {
      switch (assetSource.value) {
        case FieldType.FROM:
          fromAsset.value = assetName;
          assetDialog.value = false;
          assetSource.value = null;
          break;
        case FieldType.TO:
          toAsset.value = assetName;
          assetDialog.value = false;
          assetSource.value = null;
          break;
        default:
          throw new Error("Unexpected error.");
      }
    };
    const onAssetChange = (source) => {
      assetSource.value = source;
      assetDialog.value = true;
    };
    const setInitialConvertPair = () => {
      var _a, _b;
      if (((_a = route.query) == null ? void 0 : _a.from) && ((_b = route.query) == null ? void 0 : _b.to)) {
        fromAsset.value = String(route.query.from);
        toAsset.value = String(route.query.to);
      }
    };
    const onFromAssetChange = (e) => {
      const inputValue = e.target.value;
      fromAssetValue.value = inputValue;
      if (assetPrice.value && fromAssetValue.value && fromAssetValue.value <= pairObj.value.fromAssetMaxAmount) {
        if (pairObj.value.fromIsBase) {
          toAssetValue.value = (Number(fromAssetValue.value) * Number(assetPrice.value)).toFixed(8);
        } else {
          toAssetValue.value = (Number(fromAssetValue.value) / Number(assetPrice.value)).toFixed(8);
        }
      } else {
        toAssetValue.value = "";
      }
    };
    const onToAssetChange = (e) => {
      const inputValue = e.target.value;
      toAssetValue.value = inputValue;
      if (assetPrice.value && toAssetValue.value && toAssetValue.value <= pairObj.value.toAssetMaxAmount) {
        if (pairObj.value.fromIsBase) {
          fromAssetValue.value = (Number(toAssetValue.value) / Number(assetPrice.value)).toFixed(8);
        } else {
          fromAssetValue.value = (Number(toAssetValue.value) * Number(assetPrice.value)).toFixed(8);
        }
      } else {
        fromAssetValue.value = "";
      }
    };
    setInitialConvertPair();
    const assetPrice = computed(() => {
      var _a;
      const priceItem = (_a = convertPairsPrice.value) == null ? void 0 : _a.find(
        (priceItem2) => priceItem2.symbol === `${fromAsset.value}${toAsset.value}` || priceItem2.symbol === `${toAsset.value}${fromAsset.value}`
      );
      return priceItem ? priceItem.price : "N/A";
    });
    const assetPriceMessage = computed(() => {
      const baseAsset = pairObj.value.fromIsBase ? pairObj.value.fromAsset : pairObj.value.toAsset;
      const targetAsset = pairObj.value.fromIsBase ? pairObj.value.toAsset : pairObj.value.fromAsset;
      return `1 ${baseAsset} \u2248 ${assetPrice.value} ${targetAsset}`;
    });
    watchEffect(() => {
      if (convertPairs.value) {
        const pair = convertPairs.value.find((asset) => {
          if (isReversed.value) {
            return asset.fromAsset === toAsset.value && asset.toAsset === fromAsset.value;
          }
          return asset.fromAsset === fromAsset.value && asset.toAsset === toAsset.value;
        });
        if (pair) {
          isInvalidConvertPair.value = false;
          pairObj.value = {
            ...pair
          };
        } else {
          isInvalidConvertPair.value = true;
        }
      }
    });
    watch(
      [pairObj, isReversed],
      () => {
        if (isReversed.value) {
          router.replace({ query: { from: toAsset.value, to: fromAsset.value } });
        } else {
          router.replace({ query: { from: fromAsset.value, to: toAsset.value } });
        }
      },
      { deep: true }
    );
    watch(
      pairObj,
      () => {
        if (fromAssetValue.value || toAssetValue.value) {
          fromAssetValue.value = "";
          toAssetValue.value = "";
        }
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="w-full max-w-[432px]">`);
      _push(ssrRenderComponent(unref(_sfc_main$3), {
        badge: unref(FieldType).FROM,
        "asset-name": unref(pairObj).fromAsset,
        "is-error": unref(isInvalidConvertPair),
        placeholder: `${unref(pairObj).fromAssetMinAmount} - ${unref(pairObj).fromAssetMaxAmount}`,
        "price-in-usd": unref(assetPrice),
        "model-value": unref(fromAssetValue),
        "max-amount": unref(pairObj).fromAssetMaxAmount,
        "min-amount": unref(pairObj).fromAssetMinAmount,
        onInput: onFromAssetChange,
        onChangeAsset: ($event) => onAssetChange(unref(FieldType).FROM)
      }, null, _parent));
      _push(`<button type="button" class="flex w-full items-center justify-center bg-transparent py-4 text-gray-hover transition-colors hover:text-white" tabindex="-1"><svg class="size-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 3h3v18.5l-7-7h4V3zM16.5 21h-3V2.5l7 7h-4V21z" fill="currentColor"></path></svg></button>`);
      _push(ssrRenderComponent(unref(_sfc_main$3), {
        "model-value": unref(toAssetValue),
        badge: unref(FieldType).TO,
        "asset-name": unref(pairObj).toAsset,
        "is-error": unref(isInvalidConvertPair),
        placeholder: `${unref(pairObj).toAssetMinAmount} - ${unref(pairObj).toAssetMaxAmount}`,
        class: "mb-6",
        "price-in-usd": unref(assetPrice),
        "max-amount": unref(pairObj).toAssetMaxAmount,
        "min-amount": unref(pairObj).toAssetMinAmount,
        onChangeAsset: ($event) => onAssetChange(unref(FieldType).TO),
        onInput: onToAssetChange
      }, null, _parent));
      if (!unref(isInvalidConvertPair)) {
        _push(`<div class="mb-6 flex w-full items-center justify-between gap-2 text-sm font-normal text-white"><span>Price:</span><span class="text-right">${ssrInterpolate(unref(assetPriceMessage))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(appButton), {
        disabled: "",
        type: "button",
        class: "h-12 w-full truncate",
        tabindex: "-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Enter Amount`);
          } else {
            return [
              createTextVNode("Enter Amount")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(isInvalidConvertPair)) {
        _push(`<span class="block text-center text-red-500">Invalid convert pair.</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: unref(assetDialog),
        "onUpdate:modelValue": ($event) => isRef(assetDialog) ? assetDialog.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$5, {
              assets: (_a = unref(marginAssets)) != null ? _a : [],
              onOnAssetSelected: onAssetSelected,
              onCloseDialog: ($event) => assetDialog.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$5, {
                assets: (_b = unref(marginAssets)) != null ? _b : [],
                onOnAssetSelected: onAssetSelected,
                onCloseDialog: ($event) => assetDialog.value = false
              }, null, 8, ["assets", "onCloseDialog"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/converter/index.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full items-center justify-center px-3" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dd-sxnuR.mjs.map
