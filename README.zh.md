# WorkStreamSkills（中文）

给 [WorkStream](https://github.com/void-universe/WorkStream) 群组用的技能包：一支广告创作组——导演、场景规划、
剧情编导、分镜四个人，再加上他们照着干活的两份手册。

## 里面有什么

| 文件 | 用途 |
| --- | --- |
| `registry.json` | WorkStream 市场的技能源格式（`schema: 1`）：slug、名称、摘要、`body_url`。 |
| `bundle.json` | 可一键部署的包：群名、技能正文、以及带系统提示词的员工定义。 |
| `skills/ad-director.md` | 导演手册：3 秒一镜、一镜一个运镜、风格锁逐字复用、品牌层级、交付纪律。 |
| `skills/h3-render.md` | 本机渲染器怎么读 `广告分镜.json`、怎么回 `渲染回执.md`。 |

## 按版本固定

地址里用 tag，不要用 `main`。缓存按动引用（moving ref）建键，`main` 在推送之后可能还返回旧内容：

```
https://gh-proxy.com/https://raw.githubusercontent.com/void-universe/WorkStreamSkills/v1.0.0/bundle.json
https://gh-proxy.com/https://raw.githubusercontent.com/void-universe/WorkStreamSkills/v1.0.0/registry.json
```

`gh-proxy.com/` 这个前缀不是装饰：`raw.githubusercontent.com` 在国内不可达，而 jsDelivr 对 markdown 会 301 回 raw。
gh-proxy 直接返回字节，index、bundle 和技能正文都能取。墙外环境同样可用。

## 两种用法

**Market → 团队（整队部署）。** 贴 `bundle.json` 地址，先点「预览」看会建哪个群、哪些员工、装哪些技能，再点
「一键建组」。四个员工建好，群直接开出来。

**Market → 技能（单个技能）。** 把 `registry.json` 地址加成技能源，每条技能单独出现，可以装到某一位员工名下。

## 模型配置

这个包**不带任何凭据**。从它创建出来的员工走部署方统一配好的模型配置：

```
WORKSTREAM_MODEL_BASE_URL=https://api.deepseek.com/v1
WORKSTREAM_MODEL_NAME=deepseek-flash
WORKSTREAM_MODEL_KEY=sk-...        # 不进仓库、不进群、不以明文落库
```

密钥只在部署环境里，加密进 `agents.api_key_cipher`，读取接口只回尾号。没配就直接报 `model_config_missing`，
不会建出一个空端点的员工。

## 许可

仓库里的文字公开，供各 WorkStream 部署加载。它引用的 MiniMax H3 权重**不在**这里，适用其社区许可（按地域限制
商用），出片前请自行确认。
