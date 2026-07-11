# Conversation Capture and Review Protocol

## 1. 现实边界

ChatGPT 定时任务可按时生成提醒或摘要草稿，但不能被视为一个拥有完整跨对话历史读取权、并保证持有 GitHub 写入工具的后台守护进程。

因此系统采用“两阶段闭环”，避免出现“看似自动、实际漏记”的假自动化。

## 2. 第一阶段：7 天可靠闭环

### 每个重要对话结束时

用户发送固定指令：

```text
归档本对话：提取事实、决策、待办、文件和可复用规则，写入 Private AI OS 的今日 Inbox；不要把未核实内容升级为事实。
```

交互式 ChatGPT 在当前对话中执行：

1. 识别对话主题与来源；
2. 生成结构化 Capture；
3. 写入：
   `00_inbox/conversations/YYYY-MM-DD/<topic-slug>.md`；
4. 更新当天 Inbox 索引；
5. 仅列出知识晋升候选，不直接修改权威事实卡。

### 每晚日结

定时任务负责生成日结草稿；用户打开任务结果后发送：

```text
执行日结并写入 Private AI OS。
```

交互式 ChatGPT 读取当天 Inbox 与可访问上下文，写入：

```text
60_reviews/daily/YYYY-MM-DD.md
```

### 每周六周审

定时任务负责提醒并生成初稿；用户打开后发送：

```text
执行周审：读取本周 daily 和 inbox，写周报，并处理知识晋升候选。
```

交互式 ChatGPT 执行：

1. 写入 `60_reviews/weekly/YYYY-Www.md`；
2. 更新进行中项目状态；
3. 将已核实内容晋升到 `20_areas/`；
4. 将已验证流程晋升到 `50_skills/`；
5. 将可直接复用输出晋升到 `30_assets/`；
6. 未确认内容继续留在 Inbox 或标记 `UNKNOWN`。

## 3. Capture 文件格式

```yaml
---
capture_id: CAP-YYYYMMDD-001
captured_at: YYYY-MM-DDTHH:MM:SS+08:00
source_type: chatgpt-conversation
source_title: UNKNOWN
source_url: UNKNOWN
project: UNKNOWN
confidentiality: internal
status: captured
---
```

正文必须包括：

- 对话主题；
- 来源位置；
- 已确认事实；
- 决策；
- 已完成事项；
- 待办与负责人；
- 文件/链接；
- 可复用规则；
- 知识晋升候选；
- `UNKNOWN` 与冲突；
- 下一动作。

## 4. 知识晋升规则

### 可晋升为权威事实

- 有原始文件、截图、实物测试、负责人确认或正式业务记录；
- 能明确适用型号、版本、客户或项目范围；
- 与已有事实不冲突，或冲突已记录并解决。

### 可晋升为 Skill

- 同类任务已重复执行至少 2–3 次；
- 输入、步骤、检查点、输出和人工确认节点清楚；
- 能在不同项目中复用；
- 有至少一次实际验收结果。

### 不晋升

- 未核实的 AI 建议；
- 一次性讨论；
- 无来源的参数与市场说法；
- 情绪化判断；
- 仍在变化的草案；
- 与权威文件冲突但未解决的内容。

## 5. 第二阶段：可选全自动采集器

只有第一阶段连续运行 7 天、字段稳定后，再开发：

```text
Chrome Extension / Userscript
        ↓
Capture API / Supabase
        ↓
Nightly Summarizer
        ↓
Private GitHub Repository
        ↓
Weekly Knowledge Promotion Queue
```

采集器功能：

- 在 ChatGPT 对话页提供“保存到 AI OS”按钮；
- 捕获标题、时间、URL 和用户选定的消息；
- 默认不自动抓取所有对话，避免隐私与噪声；
- 写入 Supabase Capture 表；
- 每晚由受控任务生成 Markdown 并提交私有仓库；
- 产品事实和客户决策仍需人工批准。

## 6. 验收指标

7 天试运行后检查：

- 重要对话漏记率是否低于 10%；
- 每日 Inbox 是否能在 10 分钟内完成整理；
- 周报是否能准确回到项目与待办；
- 是否出现重复事实、参数冲突或错误晋升；
- 至少形成 3 条可复用 Skill 或 SOP；
- 日志是否真正推动业务，而不是新增管理负担。
