"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_device = require("./stores/device.js");
if (!Math) {
  "./pages/home/Home.js";
  "./pages/profile/Profile.js";
  "./pages/settings/Settings.js";
  "./pages/records/Records.js";
  "./pages/records/DayDetail.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      stores_device.useDeviceStore();
    });
    return () => {
    };
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.createPinia());
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
