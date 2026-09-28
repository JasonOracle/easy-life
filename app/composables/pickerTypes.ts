// [变更日志] 2026-09-28: AddPayload / TrayOption 两个弹层共享类型从各自 .uvue 迁入本 .ts——
//       Web(H5) 编译器不把跨 .uvue 的 import type 当类型擦除（变换产物成值导入），
//       而 .uvue 的 export type 再导出被擦除，导致首页「does not provide an export named 'AddPayload'」白屏；
//       类型只放 .ts/.uts 才三端安全（同 stores/food.ts 的 FoodBase/OptGroup 已验证通道）。App/微信端行为不变。

/** 公共添加食物弹层确认回传（AddFood → FoodPicker → 宿主页） */
export type AddPayload = {
  foodId: string
  amount: number
  unit: string
  meal: string
  sweets: Record<string, string>
  extraKcal: number
  kcal: number
}

/** 底槽选项（OptionTray 单格：器皿/甜度/加料共用） */
export type TrayOption = {
  key: string
  label: string
  sub: string
  art: string
  artW: number
  artH: number
  /** 并排颗数（砝码类 1/2/3 颗；常规为 1） */
  count: number
  /** 接触宽系数（设计实测：瓶0.93/罐0.93/碗0.64/盘0.49/杯0.64/串0.13） */
  contact: number
  /** 实心不透明素材（未选中压暗 0.85 而非 0.62） */
  solid: boolean
}
