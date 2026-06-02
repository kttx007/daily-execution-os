import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { AppData } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { useSyncStatus } from "@/hooks/useSync";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/field";

export function Settings({
  data,
  actions,
  user,
  login,
  register,
  logout,
  configured,
}: {
  data: AppData;
  actions: TaskActions;
  user: User | null;
  login: (email: string, password: string) => Promise<unknown>;
  register: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
  configured: boolean;
}) {
  const { online } = useSyncStatus();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [importText, setImportText] = useState("");
  const [busy, setBusy] = useState(false);
  const [authNotice, setAuthNotice] = useState("");

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
    } catch (error) {
      actions.setMessage(error instanceof Error ? error.message : "操作失败");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin() {
    setAuthNotice("");
    await login(email, password);
    setAuthNotice("登录成功。现在可以同步电脑和手机数据。");
  }

  async function handleRegister() {
    setAuthNotice("");
    await register(email, password);
    setAuthNotice("账号已创建。如 Supabase 开启了邮箱确认，请先到邮箱点击确认链接；如已关闭邮箱确认，会直接登录。");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">设置</h1>
        <p className="text-sm text-slate-500">本地优先使用，配置 Supabase 后可登录并同步。</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>账号与同步</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <span>Supabase：{configured ? "已配置" : "未配置"}</span>
              <span>网络：{online ? "在线" : "离线"}</span>
              <span>当前用户：{user?.email ?? "本地匿名使用"}</span>
              <span>同步模式：{user && configured ? "已开启同账号自动同步" : "本地优先，登录后开启联动"}</span>
            </div>
            {!user ? (
              <form className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]" onSubmit={(event) => { event.preventDefault(); run(handleLogin); }}>
                <Input type="email" placeholder="邮箱" value={email} onChange={(event) => setEmail(event.target.value)} disabled={!configured} />
                <Input type="password" placeholder="密码，至少 6 位" value={password} onChange={(event) => setPassword(event.target.value)} disabled={!configured} />
                <Button type="submit" disabled={!configured || busy}>{busy ? "处理中" : "登录"}</Button>
                <Button type="button" variant="outline" disabled={!configured || busy} onClick={() => run(handleRegister)}>注册</Button>
              </form>
            ) : (
              <Button variant="outline" onClick={() => run(logout)}>退出登录</Button>
            )}
            {authNotice && <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{authNotice}</p>}
            {!configured && <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">当前部署缺少 Supabase 环境变量，请在 Vercel 添加后重新部署。</p>}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={!user || busy} onClick={() => user && run(() => actions.syncNow(user.id))}>立即合并同步</Button>
              <Button variant="outline" disabled={!user || busy} onClick={() => user && run(() => actions.pushToCloud(user.id))}>仅推送本地到云端</Button>
              <Button variant="outline" disabled={!user || busy} onClick={() => user && run(() => actions.pullFromCloud(user.id))}>从云端拉取</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>复盘与通知</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="space-y-1.5 text-sm font-medium text-slate-700">默认复盘时间<Input type="time" value={data.user_settings.reminder_time} onChange={(event) => actions.updateSettings({ reminder_time: event.target.value })} /></label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700">主题预留<Select value={data.user_settings.theme} onChange={(event) => actions.updateSettings({ theme: event.target.value as AppData["user_settings"]["theme"] })}><option value="light">浅色</option><option value="dark">深色</option><option value="system">跟随系统</option></Select></label>
            <Button
              variant="outline"
              onClick={async () => {
                if (!("Notification" in window)) return actions.setMessage("当前浏览器不支持通知");
                const permission = await Notification.requestPermission();
                actions.updateSettings({ notification_enabled: permission === "granted" });
              }}
            >
              申请通知权限
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>数据导入导出</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={() => {
              const blob = new Blob([actions.exportJson()], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `daily-execution-os-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}>导出 JSON</Button>
            <textarea className="min-h-28 w-full rounded-md border border-slate-200 p-3 text-sm" placeholder="粘贴 JSON 后导入" value={importText} onChange={(event) => setImportText(event.target.value)} />
            <div className="flex gap-2"><Button variant="outline" onClick={() => importText && actions.importJson(importText)}>导入 JSON</Button><Button variant="danger" onClick={actions.clearLocal}>清空本地数据</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>PWA 安装</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
            <p>电脑端可在浏览器地址栏安装图标中添加到桌面；手机端用浏览器菜单选择“添加到主屏幕”。安装后会保留最近访问和本地数据，离线也能打开。</p>
            <p>第一版使用本地 service worker 缓存应用外壳，数据保存在浏览器本地存储中。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
