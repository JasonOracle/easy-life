"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_food = require("../../stores/food.js");
const stores_goal = require("../../stores/goal.js");
if (!Math) {
  (common_vendor.unref(Tabbar) + common_vendor.unref(FoodPicker) + common_vendor.unref(AddFood) + common_vendor.unref(SettleBadge) + common_vendor.unref(GoalModal))();
}
const Tabbar = () => "../../components/Tabbar.js";
const AddFood = () => "../../components/AddFood.js";
const FoodPicker = () => "../../components/FoodPicker.js";
const SettleBadge = () => "../../components/SettleBadge.js";
const GoalModal = () => "../../components/GoalModal.js";
class MealRow extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          img: { type: String, optional: false },
          name: { type: String, optional: false },
          portion: { type: String, optional: false },
          kcal: { type: Number, optional: false }
        };
      },
      name: "MealRow"
    };
  }
  constructor(options, metadata = MealRow.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.img = this.__props__.img;
    this.name = this.__props__.name;
    this.portion = this.__props__.portion;
    this.kcal = this.__props__.kcal;
    delete this.__props__;
  }
}
class Meal extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          key: { type: String, optional: false },
          icon: { type: String, optional: false },
          name: { type: String, optional: false },
          time: { type: String, optional: false },
          totalKcal: { type: Number, optional: false },
          rows: { type: common_vendor.UTS.UTSType.withGenerics(Array, [MealRow]), optional: false }
        };
      },
      name: "Meal"
    };
  }
  constructor(options, metadata = Meal.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.key = this.__props__.key;
    this.icon = this.__props__.icon;
    this.name = this.__props__.name;
    this.time = this.__props__.time;
    this.totalKcal = this.__props__.totalKcal;
    this.rows = this.__props__.rows;
    delete this.__props__;
  }
}
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "Home",
  setup(__props) {
    var _a, _b;
    let sbH = 0;
    try {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      sbH = (_a = sysInfo.statusBarHeight) !== null && _a !== void 0 ? _a : 0;
    } catch (e) {
      sbH = 0;
    }
    const tabFade = common_vendor.ref(0);
    common_vendor.onPageScroll((e = null) => {
      let q = e.scrollTop / 60;
      if (q > 1)
        q = 1;
      const fq = Math.round(q * 20) / 20;
      if (fq !== tabFade.value)
        tabFade.value = fq;
    });
    const fabRight = common_vendor.ref("14px");
    const fabTop = common_vendor.ref("2px");
    try {
      const sys = common_vendor.index.getSystemInfoSync();
      const capsule = common_vendor.index.getMenuButtonBoundingClientRect();
      if (capsule != null && capsule.left > 0) {
        fabRight.value = sys.windowWidth - capsule.left + 10 + "px";
        fabTop.value = capsule.top - ((_b = sys.statusBarHeight) !== null && _b !== void 0 ? _b : 0) + "px";
      }
    } catch (e) {
    }
    const food = stores_food.useFoodStore();
    const goal = stores_goal.useGoalStore();
    const remainCal = common_vendor.computed(() => {
      return goal.calorieGoal - food.totalCal;
    });
    const macroP = common_vendor.computed(() => {
      return Math.round(food.totalProtein);
    });
    const macroC = common_vendor.computed(() => {
      return Math.round(food.totalCarbs);
    });
    const macroF = common_vendor.computed(() => {
      return Math.round(food.totalFat);
    });
    const MEAL_ICONS = {
      breakfast: "/static/home/meal_sun.png",
      lunch: "/static/home/meal_sun_l.png",
      dinner: "/static/home/meal_moon.png"
    };
    const pickerShow = common_vendor.ref(false);
    const addShow = common_vendor.ref(false);
    const addFoodId = common_vendor.ref("");
    const settleShow = common_vendor.ref(false);
    const settleKcal = common_vendor.ref(0);
    const settleAfter = common_vendor.ref(0);
    const settleMeal = common_vendor.ref("");
    const goalShow = common_vendor.ref(false);
    function openGoal() {
      goalShow.value = true;
    }
    function openRecords() {
      common_vendor.index.navigateTo({ url: "/pages/records/Records" });
    }
    const MEAL_LABELS = {
      breakfast: "早餐",
      lunch: "午餐",
      dinner: "晚餐",
      snack: "夜宵"
    };
    function openAdd() {
      pickerShow.value = true;
    }
    function onPickFood(id) {
      addFoodId.value = id;
      addShow.value = true;
    }
    function onAddChange() {
      addShow.value = false;
      pickerShow.value = true;
    }
    function onAddConfirm(payload = null) {
      var _a2;
      addShow.value = false;
      const f = stores_food.getFoodById(payload.foodId);
      if (f != null)
        food.addEntry(stores_food.computeEntry(f, payload.amount, payload.unit, payload.meal, payload.extraKcal));
      settleKcal.value = payload.kcal;
      settleAfter.value = food.totalCal;
      settleMeal.value = (_a2 = MEAL_LABELS[payload.meal]) !== null && _a2 !== void 0 ? _a2 : "";
      settleShow.value = true;
    }
    const showDinner = common_vendor.ref(false);
    function toggleDinner() {
      showDinner.value = !showDinner.value;
    }
    const meals = common_vendor.computed(() => {
      return food.mealRows.filter((m) => {
        return m.key === "breakfast" || m.key === "lunch" || m.key === "dinner";
      }).map((m) => {
        var _a2;
        return new common_vendor.UTSJSONObject({
          key: m.key,
          icon: (_a2 = MEAL_ICONS[m.key]) !== null && _a2 !== void 0 ? _a2 : "/static/home/meal_sun.png",
          name: m.name,
          time: m.time,
          totalKcal: typeof m.cal === "number" ? m.cal : 0,
          rows: m.details.map((d) => {
            return new common_vendor.UTSJSONObject({
              img: "/static/icons/" + d.img,
              name: d.name,
              portion: d.amountText,
              kcal: d.kcal
            });
          })
        });
      });
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: fabRight.value,
        b: fabTop.value,
        c: common_vendor.o(openAdd, "eb"),
        d: common_vendor.unref(sbH) + 64 + "px",
        e: common_vendor.unref(sbH) + "px",
        f: common_vendor.unref(sbH) + 64 + "px",
        g: common_vendor.t(remainCal.value),
        h: common_vendor.t(common_vendor.unref(food).totalCal),
        i: common_vendor.t(common_vendor.unref(goal).calorieGoal),
        j: common_vendor.o(openRecords, "7a"),
        k: common_vendor.t(common_vendor.unref(goal).calorieGoal),
        l: common_vendor.o(openGoal, "29"),
        m: common_vendor.t(macroP.value),
        n: common_vendor.t(macroC.value),
        o: common_vendor.t(macroF.value),
        p: common_vendor.f(meals.value, (meal, mealIdx, i0) => {
          return common_vendor.e({
            a: meal.icon,
            b: mealIdx < meals.value.length - 1
          }, mealIdx < meals.value.length - 1 ? {} : {}, {
            c: common_vendor.t(meal.name),
            d: common_vendor.t(meal.time),
            e: common_vendor.t(meal.totalKcal),
            f: meal.key !== "dinner" || showDinner.value
          }, meal.key !== "dinner" || showDinner.value ? {
            g: common_vendor.f(meal.rows, (rowItem, rowIdx, i1) => {
              return common_vendor.e({
                a: rowItem.img,
                b: common_vendor.t(rowItem.name),
                c: common_vendor.t(rowItem.portion),
                d: common_vendor.t(rowItem.kcal),
                e: rowIdx < meal.rows.length - 1
              }, rowIdx < meal.rows.length - 1 ? {} : {}, {
                f: rowIdx
              });
            })
          } : {}, {
            h: meal.key === "dinner" && !showDinner.value
          }, meal.key === "dinner" && !showDinner.value ? {
            i: common_vendor.o(toggleDinner, mealIdx)
          } : {}, {
            j: mealIdx
          });
        }),
        q: common_vendor.p({
          active: "home",
          fade: tabFade.value
        }),
        r: common_vendor.o(onPickFood, "99"),
        s: common_vendor.o(($event) => {
          return pickerShow.value = $event;
        }, "2a"),
        t: common_vendor.p({
          ["selected-id"]: addFoodId.value,
          show: pickerShow.value
        }),
        v: common_vendor.o(onAddConfirm, "92"),
        w: common_vendor.o(onAddChange, "d5"),
        x: common_vendor.o(($event) => {
          return addShow.value = $event;
        }, "9a"),
        y: common_vendor.p({
          ["food-id"]: addFoodId.value,
          show: addShow.value
        }),
        z: common_vendor.o(($event) => {
          return settleShow.value = $event;
        }, "11"),
        A: common_vendor.p({
          kcal: settleKcal.value,
          after: settleAfter.value,
          goal: common_vendor.unref(goal).calorieGoal,
          meal: settleMeal.value,
          show: settleShow.value
        }),
        B: common_vendor.o(common_vendor.unref(goal).setGoal, "5d"),
        C: common_vendor.o(($event) => {
          return goalShow.value = $event;
        }, "cd"),
        D: common_vendor.p({
          initial: common_vendor.unref(goal).calorieGoal,
          show: goalShow.value
        }),
        E: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        F: `${_ctx.u_s_b_h}px`,
        G: `${_ctx.u_s_a_i_b}px`,
        H: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
wx.createPage(_sfc_defineComponent);
