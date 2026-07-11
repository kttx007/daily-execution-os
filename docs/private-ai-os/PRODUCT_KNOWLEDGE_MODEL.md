# Product Knowledge Model

> 适用范围：开腾通讯 / GUANGYAN 产品知识库
> 原则：证据优先、型号隔离、版本可追溯、对外口径需审核。

## 1. 为什么不能只建一个“产品资料文件夹”

产品知识至少包含四种不同性质的内容：

1. **原始证据**：说明书、规格书、实拍图、测试报告、证书、包装数据、客户测试记录；
2. **权威事实**：经过核对后冻结的参数、功能、版本、适用范围；
3. **业务口径**：允许怎么卖、不能怎么承诺、与其他型号如何区分；
4. **衍生资产**：官网、阿里详情页、PDF、社媒脚本、客户回复、培训题库。

这四类内容不能混在同一个文档里，否则 AI 会把旧资料、推断、营销表达和真实参数混用。

## 2. 单产品目录标准

```text
20_areas/product-knowledge/
└── fusion-splicers/
    └── M6/
        ├── README.md
        ├── FACT_CARD.md
        ├── VARIANTS.md
        ├── CLAIMS_AND_BOUNDARIES.md
        ├── EVIDENCE_INDEX.md
        ├── FAQ.md
        ├── AFTER_SALES.md
        ├── PACKAGING.md
        ├── CHANGELOG.md
        └── archive/
```

其他分类示例：

```text
product-knowledge/
├── fusion-splicers/
├── optical-power-meters/
├── multifunction-testers/
├── vfl/
├── otdr/
├── fiber-identifiers/
├── cleavers/
├── light-sources/
├── rangefinders/
└── accessories-and-spares/
```

## 3. 各文件职责

### `FACT_CARD.md`

产品当前权威事实。只放经过确认、可作为其他内容源头的数据。

### `VARIANTS.md`

版本、配置、国家定制、颜色、通信协议、包装组合等差异，防止把不同版本混写。

### `CLAIMS_AND_BOUNDARIES.md`

允许对外宣称的卖点、禁止表述、适用条件、尚未验证的口径。

### `EVIDENCE_INDEX.md`

记录证据名称、版本、文件位置、来源、验证日期、可见范围、对应事实字段。

### `FAQ.md`

销售与客户常见问题。答案必须引用事实卡或售后规则，不自行增加参数。

### `AFTER_SALES.md`

常见故障、诊断顺序、保修边界、备件、升级风险、必须转人工的情况。

### `PACKAGING.md`

标准配置、包装数量、箱规、重量、电池运输、唛头与可选配件。

### `CHANGELOG.md`

参数、配置、价格规则、说明书或口径变化记录。禁止静默覆盖。

## 4. 权威链路

```text
原始证据
  ↓ 核对
EVIDENCE_INDEX
  ↓ 批准
FACT_CARD / VARIANTS
  ↓ 形成业务边界
CLAIMS_AND_BOUNDARIES / AFTER_SALES / PACKAGING
  ↓ 生成
30_assets/spec-sheets / sales-copy / website / alibaba / social / training
```

下游内容发现参数错误时，不应只改宣传稿；必须回到事实卡或证据索引确认源头，再同步所有受影响资产。

## 5. 型号隔离规则

1. 每个型号单独目录，禁止建立一份超长“全部产品事实表”作为唯一事实源。
2. 跨型号共性放在分类级 `COMMON_FACTS.md`，型号文件只引用。
3. 参数对比必须从各型号事实卡提取，不手工复制粘贴。
4. 同名产品若存在硬件或固件版本差异，必须建立版本表。
5. 未确认字段写 `UNKNOWN`，不能用近似型号补齐。

## 6. 建议元数据

每个权威文件顶部使用 YAML：

```yaml
---
product_id: KT-FS-M6
model: M6
category: fusion-splicer
status: active
knowledge_status: approved
version: 1.0.0
owner: Anping Liao
last_verified: 2026-07-11
review_due: 2026-10-11
confidentiality: internal
source_of_truth: true
---
```

建议固定字段：

- `product_id`
- `model`
- `category`
- `status`
- `knowledge_status`
- `version`
- `owner`
- `last_verified`
- `review_due`
- `confidentiality`
- `source_of_truth`

## 7. 产品事实卡必备内容

- 产品身份：型号、类别、生命周期状态；
- 核心定位：面向谁、解决什么问题；
- 冻结参数：屏幕、电池、速度、波长、接口、功率等；
- 功能与条件：默认功能、选配功能、地区/协议限制；
- 标准配置与包装；
- 认证与证据状态；
- 对外卖点；
- 禁止承诺；
- 售后与保修口径；
- 兼容性与关联产品；
- 已知冲突；
- `UNKNOWN` 待补字段；
- 修改记录。

## 8. 内容资产如何引用产品知识

每份对外资产顶部建议保留内部元数据：

```yaml
source_products:
  - KT-FS-M6@1.0.0
source_files:
  - 20_areas/product-knowledge/fusion-splicers/M6/FACT_CARD.md
  - 20_areas/product-knowledge/fusion-splicers/M6/CLAIMS_AND_BOUNDARIES.md
last_fact_check: 2026-07-11
channel: alibaba
language: en
approval_status: draft
```

这样产品参数变更后，可以定位哪些官网、阿里、PDF、社媒资产需要重审。

## 9. 产品知识的审核状态

- `draft`：正在整理，不可作为正式口径；
- `needs_evidence`：有说法但缺证据；
- `conflict`：多个来源冲突；
- `approved`：负责人已确认；
- `deprecated`：旧版，禁止新内容引用；
- `retired`：产品或口径已退役。

## 10. 首批落地范围

不要一次性把全部产品搬进来。首批建议：

1. M6
2. K6
3. K5
4. M5
5. K3S
6. Y12
7. Y9
8. G12/G10/G1000
9. B5/B5G
10. S2
11. W2S
12. Q1/Q1S

优先顺序按：正在成交、正在制作资料、最容易串参数、售后风险最高。
