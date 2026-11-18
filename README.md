# WorkStreamSkills

A skill pack for [WorkStream](https://github.com/void-universe/WorkStream) groups: the ad crew — a director, a scene
planner, a story editor and a storyboard artist — plus the two handbooks they work from.

## What is in here

| File | Purpose |
| --- | --- |
| `registry.json` | Skill registry in the WorkStream Market format (`schema: 1`): slug, name, summary, `body_url`. |
| `bundle.json` | The deployable pack: a group name, the skill bodies, and the agents with their system prompts. |
| `skills/ad-director.md` | The director handbook: 3-second shots, one camera verb per shot, a verbatim style lock, brand hierarchy, delivery discipline. |
| `skills/h3-render.md` | How the local renderer consumes `广告分镜.json` and returns `渲染回执.md`. |

## Pinning

Use a tag in the address, not `main`. Caches key on the moving ref, so `main` can keep serving an older copy after a
push:

```
https://gh-proxy.com/https://raw.githubusercontent.com/void-universe/WorkStreamSkills/v1.0.0/bundle.json
https://gh-proxy.com/https://raw.githubusercontent.com/void-universe/WorkStreamSkills/v1.0.0/registry.json
```

The `gh-proxy.com/` prefix is not decoration: `raw.githubusercontent.com` is unreachable from mainland China, and
jsDelivr answers markdown with a 301 back to raw. gh-proxy returns the bytes directly and works for the index, the
bundle and the skill bodies alike. Outside that network, the raw URL under the prefix works as well.

## Two ways to use it

**Market → Teams (whole crew).** Paste the `bundle.json` address, press *Preview* to see the group, the employees and
the skill files, then *Deploy group*. Four employees are created and the group opens with them in it.

**Market → Skills (one skill).** Add the `registry.json` address as a source; each skill lists on its own and installs
onto one employee.

## Model configuration

This pack carries **no credentials**. Employees created from it inherit the deployment's model configuration, set once:

```
WORKSTREAM_MODEL_BASE_URL=https://api.deepseek.com/v1
WORKSTREAM_MODEL_NAME=deepseek-flash
WORKSTREAM_MODEL_KEY=sk-...        # never committed, never in this repo
```

The key stays in the deployment environment, is sealed into `agents.api_key_cipher`, and every read endpoint returns
the masked tail only. Deploying without the configuration fails with `model_config_missing` instead of creating an
employee with an empty endpoint.

## License

The text in this repository is published so WorkStream deployments can load it. The MiniMax H3 weights it references
are **not** included here and carry their own community license, which restricts commercial use by region — check it
before shipping anything made with the renderer.
