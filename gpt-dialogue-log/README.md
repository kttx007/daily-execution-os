# GPT Dialogue Log

这个目录用于承接 ChatGPT 每日对话摘要、跨项目事项索引和每周复盘。

## 目录结构

```text
gpt-dialogue-log/
  README.md
  index.md
  daily/
    YYYY-MM-DD.md
  weekly/
    YYYY-Www.md
  templates/
    daily-template.md
    weekly-template.md
```

## 使用规则

1. 每日摘要文件放入 `daily/YYYY-MM-DD.md`。
2. 每周六 09:00 周报放入 `weekly/YYYY-Www.md`。
3. `index.md` 只记录索引、项目入口和长期待办，不塞完整流水账。
4. 涉及客户、价格、谈判、项目决策的信息，先写入每日摘要；只有长期有效的信息才建议写入 ChatGPT Memory。
5. 如果某些跨对话内容不可访问，必须在日志中标注“不可访问/缺失”，不要补猜。

## 推荐工作流

- ChatGPT 输出每日摘要后，直接追加/更新到对应日期 MD。
- 周报优先读取本周每日 MD，再汇总项目、客户、工具和待办。
- Codex、Claude Code、Trae 等工具需要接手时，先读 `index.md` 和最近 7 天 `daily/` 文件。
