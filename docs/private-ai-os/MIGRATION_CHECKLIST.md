# Private AI OS Migration Checklist

## A. 需要用户完成的唯一前置动作

当前 GitHub Connector 可以读写已有仓库，但不能创建新仓库或修改仓库可见性。

请在 GitHub 网页完成：

1. 点击右上角 `+` → `New repository`；
2. Repository name：`private-ai-os`；
3. Visibility：选择 `Private`；
4. 勾选 `Add a README file`；
5. 点击 `Create repository`；
6. 确保 ChatGPT GitHub App 对该仓库有访问权限。

完成后，目标仓库应为：

```text
kttx007/private-ai-os
```

## B. 创建后由 AI 执行

- [ ] 验证仓库可见性为 private；
- [ ] 验证 ChatGPT Connector 具备 push 权限；
- [ ] 建立顶层目录和 Agent 控制文件；
- [ ] 迁移 `gpt-dialogue-log/`；
- [ ] 更新每日/周报自动任务目标仓库；
- [ ] 建立产品知识目录与模板；
- [ ] 创建首批产品事实卡；
- [ ] 建立证据索引和缺失资料清单；
- [ ] 建立客户、售后、阿里、官网、社媒、竞品、AI Skill 分区；
- [ ] 创建 `AGENTS.md`、`CODEX.md`、`CLAUDE.md`；
- [ ] 创建 `CURRENT_STATE.md` 与 `NEXT_WORK_PACKAGE.md`；
- [ ] 验证读取、写入、更新和索引维护。

## C. 迁移原则

### 迁移

- 已有每日/周报；
- 已确认的业务事实；
- 已验证的产品参数；
- 可重复使用的 SOP、Skill、Prompt；
- 当前进行中的项目状态；
- 证据索引与外部文件链接。

### 暂不迁移

- 未消化的收藏夹内容；
- 重复版本；
- 无来源的 AI 长文；
- 所有历史聊天全文；
- 大视频、原始素材和无索引的大型 PDF；
- 已过期且没有历史价值的临时文件。

## D. 旧仓库处理

`kttx007/daily-execution-os` 保持为应用代码仓库。

迁移完成后：

- 删除或停止在公开仓库继续写入业务对话日志；
- 公开仓库只保留非敏感架构文档或将 bootstrap 文档归档；
- 自动任务全部改指向 `private-ai-os`；
- 代码项目需要业务上下文时，只通过精简的 Context Pack 引用私有仓库，不复制客户与价格数据。

## E. 验收标准

迁移完成必须满足：

1. 随机读取一份产品事实卡，能追溯到证据编号；
2. 随机读取一份每日摘要，能定位对应项目或对话主题；
3. 周报能读取本周每日文件并生成项目优先级；
4. Codex/Claude 启动时能按规定读取最小上下文；
5. 产品资料缺证据时显示 `UNKNOWN`，不会自动脑补；
6. 公开仓库中不存在客户、成本、报价、合同等敏感信息。
