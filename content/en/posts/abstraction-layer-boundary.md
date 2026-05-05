---
title: "Add a Layer of Abstraction, But the Core Is Just One Layer"
date: 2026-02-06T20:28:00+08:00
description: "In software engineering, abstraction is a common tool for managing complexity, but what truly matters is not endlessly stacking abstraction layers, but consciously defining and limiting the boundaries of those layers."
categories: ["Workplace Insights"]
tags: ["Software Engineering", "Abstraction", "Architecture Design", "Complexity Management", "Systems Thinking"]
draft: false
---

In software engineering, there is a phrase that has been repeatedly validated and cited: any complex problem can be solved by adding another layer of abstraction.

This saying has endured because it holds true in countless real-world scenarios. Modularization, layered architecture, interfaces, and platformization are all practical manifestations of this principle.

For a long time, I believed in this logic without question. When a system got complex, I abstracted; when boundaries blurred, I added a layer; when changes came frequently, I wrapped it in yet another layer. Each abstraction brought a short-term sense of certainty: the structure became clearer, responsibilities more defined, and complexity seemed to be "tamed."

It wasn't until later that I gradually realized the real problem is often not insufficient abstraction, but uncontrolled abstraction.

The system didn't truly become simpler by adding layers; complexity was merely distributed, shifted, and hidden across more places. Each layer looked reasonable on its own, but the whole became increasingly difficult to understand, maintain, and evolve. That's when I started questioning myself: Were we really solving complexity, or were we using abstraction to postpone facing it?

The shift didn't come from a single failure, but from a renewed understanding of the concept of "abstraction layers" itself.

My default assumption used to be that abstraction is a capability you can keep stacking. If a problem is complex, abstract it up another level; if it's still complex, keep going. This process seemed to have no natural endpoint—as long as you were willing, you could always find a higher-level concept to wrap around the current problem.

But over time, I realized that the real key isn't "whether you can add another layer," but whether you have defined the boundaries of your abstraction layers.

It was here that my perspective fundamentally changed. The core isn't about adding abstraction; it's about defining *one* layer. By "one layer," I don't mean a literal single-layer structure, but a deliberately limited, finite hierarchy of layers.

Encapsulation and shielding only truly work when the number of abstraction layers is finite. If the hierarchy itself is open-ended and infinitely stackable, then so-called "hiding details" often just moves details from one place to another.

From a methodological standpoint, these are two completely different paths for handling complexity. One path fights complexity by endlessly adding abstractions, hoping that standing high enough will let you see everything clearly. The other path tames complexity by limiting abstraction layers, forcing yourself to make clear and difficult trade-offs within a finite set of layers.

The former relies more on cleverness; the latter relies more on restraint.

And what's truly difficult is the latter. Because it forces you to confront some unavoidable questions from the very beginning of the design: Which changes are worth absorbing into the system? Which changes must be exposed to the upper layers? Which uncertainties are the system's responsibility, and which should be left to the user or the business? These questions cannot be postponed by "adding another layer."

When you truly define a core layer, abstraction begins to carry weight.

This layer typically contains the fewest concepts but bears the most important commitments. It doesn't aim to cover every scenario; it aims for long-term stability. It doesn't pursue extreme flexibility; it provides clear boundaries. Below this layer, rapid evolution is allowed; above this layer, free combination of strategies is permitted. But this layer itself must be restrained enough, and firm enough.

Over time, I became increasingly convinced: The purpose of abstraction is never to hide complexity, but to constrain it.

You don't understand a problem because you abstract it; you abstract it because you already understand the problem well enough to know at which layer to abstract, and at which layer to stop.

So, the next time we quote that classic saying, perhaps we should mentally add a premise: Any complex problem can indeed be solved by adding another layer of abstraction—provided you are clear that this layer is the last one.

A mature methodology isn't about constantly adding more; it's about knowing when to stop. It's not about pursuing perfection in every layer, but about pursuing long-term comprehensibility and structural stability that can evolve.

In the end, my conclusion turned out to be quite simple: Adding a layer of abstraction is not difficult. What is truly difficult is stopping clearly and firmly at the right place.