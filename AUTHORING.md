# Skill authoring boundary: secrets go in tools, never in prompts

For anyone publishing a skill pack. This boundary does more than encryption, because **encryption cannot protect what the model must read to do the work**.

## The fact to start from

Skill bodies, system prompts, recent transcript and employee memories are sent to the model endpoint on every turn. With a hosted model (DeepSeek / OpenAI / any API), that content **passes through the provider's servers** and may land in their logs and prompt cache.

Encrypting at rest, returning only a masked tail, never shipping the body to the client — all of that constrains **your customers**, not **the model provider**.

## How to decide

Before writing anything into a skill, ask:

| Question | If yes | Do this |
| --- | --- | --- |
| Would the provider seeing this destroy commercial value? | yes | **Do not put it in the skill body** |
| Does the model need to understand it to decide? | no | Put it in a **tool**; the model sees the tool description only |
| Is it a fixed process, a field format, a rule of judgement? | yes | Fine in the skill — that is not secret |
| Is it specific data (customer names, prices, keys, internal thresholds)? | yes | Keep it in **server-side data**, fetched through a tool |

## The correct split

- **Skill body**: how to do the job — process, field constraints, failure handling, judging criteria.
- **Tool**: the part that must stay secret — querying internal stores, computing prices, calling internal APIs, reading tenant data. The model only sees a name, parameters and a return value.
- **Never in a prompt**: keys, passwords, customer lists, real prices, internal thresholds, internal endpoints.

## An example

Do not write:

> Pricing rule: cost × 1.35, no discount under 2000; customer A's floor is 1800.

Write instead:

> When quoting, call the `quote_price` tool with the item and quantity; it returns the price you may quote. Do not estimate a price yourself, and do not explain the calculation.

The model now knows only that a tool must be called; the multipliers and the floor price stay on your server.

## Checklist before publishing

- [ ] No keys, tokens or connection strings in the body
- [ ] No real customer names, real prices or internal endpoints
- [ ] Numbers in the body are examples, not production values
- [ ] Every step that needs a secret calculation points at a tool, not at a formula
- [ ] Read it once assuming the provider publishes the whole text — can you live with that?

That last one is the only test that actually holds: **assume it will be published**, then decide what to write.
