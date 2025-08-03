+++
title = "Building Testable Telegram Bots with Zustand"
author = ["Giovanni Crisalfi"]
date = 2025-08-04
draft = false
[taxonomies]
  tags = ["typescript", "bot", "test"]
  categories = ["web", "projects"]
+++

When most developers think of Zustand, they picture React hooks and component state. But what if I told you that Zustand's vanilla store could power a sophisticated Telegram bot with predictable state management and reactive behavior? 

<!-- more -->

## How It All Started

This project began with two unrelated moments that collided perfectly. I was deep-diving into Zustand's internals, trying to understand how `createStore` worked under the hood (the vanilla API that powers React hooks). Around the same time, my girlfriend complained about yet another obnoxious QR code website with ads, paywalls, and questionable privacy practices.

"Challenge accepted!" I announced to my reflection in the black screen of my laptop. The challenge hadn't even been issued. I was literally having a conversation with myself, in my mind, and it totally changed the trajectory of my next few days. But that's how the best projects start, with a completely unprompted moment of caffeinated hubris at 2 AM.

But instead of building another web app, I thought: *What if I made this a Telegram bot?* It would be easier for her whole team to use than deploying a desktop app or a website and it would be easier for me to craft, since I wouldn't need to worry about UI niceties.

## Bot Complexity Gets Messy Fast

Building a Telegram bot seems simple at first. Handle a message, generate a response, send it back. But as features grow, you quickly encounter:

- **Stateful conversations** (settings modes, multi-step flows)
- **Async operations** (file I/O, in this case: QR generation)
- **Request tracking** (knowing what's processing, completed, or failed)
- **User preferences** (per-chat settings, format choices)

I considered existing libraries and frameworks, but I had a specific goal: **I wanted something heavily testable from day one**. My girlfriend's team would depend on this for their workflow, so I couldn't risk shipping something buggy or unreliable. Moreover, I was pretty busy with work, so I had just a weekend to make it operational and leave it live on my server before Monday. I needed architectural patterns that would give me confidence in the code's correctness.

The question became urgent during the initial development phase when I asked myself: *How do you unit-test a bot?* Traditional bot code is a nightmare to test: it's all side effects, network calls, and stateful interactions mixed together. Of course, **pure functions are infinitely easier to test** than side-effect heavy code.

After some studying, I thought that the Elm unidirectional pattern would work perfectly not only for UIs, but for bots too. *(Don't worry if you're not familiar with Elm, I'll explain the pattern in the next section.)* Writing a backend in Elm isn't that immediate and I wanted a dynamic language with a rich library system to go as fast as possible.

I considered TypeScript; it would give me the type safety I wanted while keeping the flexibility of a dynamic ecosystem. But then it hit me: I had been using [Zustand](https://zustand-demo.pmnd.rs/) to encapsulate business logic in React apps through pure state actions (I wrote about this approach in detail in my post on [Building Robust React Apps with Zustand and Immer](/posts/20250301173228-building_robust_react_apps_with_zustand_and_immer/)). What if I could apply the same approach to a bot? Zustand's vanilla `createStore` API could give me pure functions for business logic while keeping all the messy I/O operations separate and reactive.

This looked like the perfect occasion to practice TypeScript and explore Zustand outside React. I was curious whether Zustand's specific advantages (vanilla store API, Immer integration, reactive subscriptions) could bring the same clarity to bot development that they bring to React apps.

What started as a quick weekend project became an architectural experiment that showed me how Zustand could work beautifully in backend contexts.

Let me walk you through what I experimented.

## Zustand in the outer world

Zustand's `createStore` function works perfectly outside React:

```typescript
import { createStore } from 'zustand/vanilla';
import { produce } from 'immer';

export const store = createStore<State & Actions>((set, get) => ({
  // Initial state
  chats: [],
  requests: [],
  
  // Actions
  newRequest: ({ id, chatId, text, format }) => set(
    produce((state) => {
      state.requests.push({
        id, chatId, text, format,
        state: RequestState.New,
        response: null
      });
    })
  ),
  
  processRequest: (id) => set(
    produce((state) => {
      const req = state.requests.find(r => r.id === id);
      if (req) req.state = RequestState.Processing;
    })
  )
}));
```

No hooks, no components, just pure state management.

## The code is TEA!

![Anime character pouring tea into a cup](/img/anime-tea.gif)

The bot follows a unidirectional data flow that any Elm developer would recognize:

```
User Message → Update → Model → View (Bot Messages)
```

This is The [Elm Architecture](https://guide.elm-lang.org/architecture/) (TEA) adapted for Telegram: same principles, different runtime. If you're more familiar with **[Redux](https://redux.js.org/)**, it's the same pattern (Redux was inspired by Elm): actions trigger reducers that update state, which then triggers view updates (in this case, Telegram messages instead of DOM updates).

Here's how a QR request flows through the system:

```typescript
// 1. User sends message
bot.on('message', (msg) => {
  const { id, chat, text } = msg;
  
  // 2. Create request (triggers state change)
  store.getState().newRequest({ id, chatId: chat.id, text, format });
  
  // 3. Start processing (triggers another state change)
  store.getState().processRequest(id);
  
  // 4. Generate QR asynchronously
  store.getState().genQr({ text, format })
    .then(response => store.getState().completeRequest({ id, response }))
    .catch(error => store.getState().abortRequest({ id, error }));
});
```

(Yeah, I like sugarfree promises.)

## Reactive State Subscriptions

Instead of manually checking state or using callbacks, **the bot reacts to state changes**, like those mechanical turrets in Portal that snap the moment they detect your movements through the glass.

> ![Portal turret detecting movement](/img/portal-turret.gif)
>
> "Are you still there?"

First, we set up a subscription that listens for any changes to the store:

```typescript
store.subscribe((state) => {
  const currentRequests = state.requests;
  
  currentRequests.forEach(currentRequest => {
    const previousRequest = previousRequests.find(r => r.id === currentRequest.id);
    
    if (previousRequest?.state !== currentRequest.state) {
      handleStateChange(currentRequest, previousRequest);
    }
  });
  
  previousRequests = currentRequests;
});
```

This subscription fires whenever the store state changes. We compare the current requests with the previous snapshot to detect state transitions (when a request moves from `New` to `Processing`, or from `Processing` to `Completed`).

When a state change is detected, the bot automatically responds:

```typescript
const handleStateChange = (request, previous) => {
  switch (request.state) {
    case RequestState.Processing:
      bot.sendMessage(request.chatId, "🔄 Generating your QR code...");
      break;
      
    case RequestState.Completed:
      bot.sendPhoto(request.chatId, fs.createReadStream(request.response));
      break;
      
    case RequestState.Error:
      bot.sendMessage(request.chatId, "❌ Something went wrong!");
      break;
  }
};
```

> **Note:** This is a simplified representation. The actual implementation also manages animated loading indicators, handles file cleanup, and includes additional error recovery logic ([check the code](https://github.com/gicrisf/qrbot/) to see how).

## State Machine Pattern in Action

Each request follows a clear lifecycle:

```typescript
export enum RequestState {
  New = 0,
  Processing = 1,
  Completed = 2,
  Error = 3
}
```

These states create a simple but effective state machine that prevents invalid transitions and makes the bot's behavior predictable. You can't accidentally send a "completed" message for a request that's still processing.

Now that I think about it, there are more idiomatic ways to represent a `RequestState` in TypeScript, like string literal unions (`'new' | 'processing' | 'completed' | 'error'`), but I did like the idea of using a C-like enum when I wrote the bot, so... We'll leave it as it is.

## Multi-Mode Conversations

The bot supports different conversation modes (normal QR generation vs. settings configuration) through state:

```typescript
export enum ChatMode {
  Normal = 0,
  Settings = 1
}

// When user enters settings
bot.onText(/\/settings/, (msg) => {
  store.getState().setChatMode(msg.chat.id, ChatMode.Settings);
  
  // Bot commands change dynamically
  bot.setMyCommands([
    { command: '/set_png', description: 'Set PNG format' },
    { command: '/set_svg', description: 'Set SVG format' }
  ], { scope: { type: 'chat', chat_id: msg.chat.id } });
});
```

The store tracks each chat's mode, and the reactive subscription updates bot behavior accordingly.

## Testing: The Real Reason I Chose This Architecture

Traditional bot code mixes core logic with I/O operations:

```typescript
bot.on('message', async (msg) => {
  if (isProcessing[msg.chat.id]) return;
  
  isProcessing[msg.chat.id] = true;
  await bot.sendMessage(msg.chat.id, 'Processing...');
  
  try {
    const qr = await generateQR(msg.text);
    await bot.sendPhoto(msg.chat.id, qr);
  } catch (error) {
    await bot.sendMessage(msg.chat.id, 'Error!');
  }
  
  delete isProcessing[msg.chat.id];
});
```

Testing this requires mocking the bot, filesystem, and network calls:

```typescript
describe('Traditional Bot Handler', () => {
  let mockBot;
  let mockFs;
  
  beforeEach(() => {
    mockBot = {
      sendMessage: jest.fn().mockResolvedValue({}),
      sendPhoto: jest.fn().mockResolvedValue({})
    };
    mockFs = {
      writeFile: jest.fn().mockResolvedValue(undefined)
    };
    isProcessing = {}; // Reset global state
  });

  it('should handle message processing', async () => {
    const msg = { chat: { id: 123 }, text: 'test' };
    
    // Test becomes complex due to async operations and mocks
    await messageHandler(msg);
    
    expect(mockBot.sendMessage).toHaveBeenCalledWith(123, 'Processing...');
    // How do we test the QR generation without actual file I/O?
    // How do we verify the processing state without exposing internals?
    // How do we test error scenarios without triggering real network failures?
  });
});
```

The traditional approach forces you to mock everything and makes it difficult to isolate application logic from side effects.

With Zustand's pure functions, testing becomes straightforward:

```typescript
describe('QR Request Lifecycle', () => {
  beforeEach(() => {
    store.setState(store.getInitialState());
  });

  it('should handle request lifecycle correctly', () => {
    store.getState().newRequest({ 
      id: 1, chatId: 123, text: 'test', format: QrFormat.Png 
    });
    
    expect(store.getState().requests).toHaveLength(1);
    expect(store.getState().requests[0].state).toBe(RequestState.New);
    
    store.getState().processRequest(1);
    expect(store.getState().requests[0].state).toBe(RequestState.Processing);
    
    store.getState().completeRequest({ id: 1, response: '/path/to/qr.png' });
    expect(store.getState().requests[0].state).toBe(RequestState.Completed);
    expect(store.getState().requests[0].response).toBe('/path/to/qr.png');
  });

  it('should prevent overload', () => {
    // Create 5 requests (hitting the limit)
    for (let i = 1; i <= 5; i++) {
      store.getState().newRequest({ 
        id: i, chatId: 123, text: `test${i}`, format: QrFormat.Png 
      });
    }
    
    expect(store.getState().state).toBe(BotState.Idle);
    
    // 6th request should trigger overload
    store.getState().newRequest({ 
      id: 6, chatId: 123, text: 'test6', format: QrFormat.Png 
    });
    
    expect(store.getState().state).toBe(BotState.Overloaded);
  });
});
```

### Why This Works

My philosophy was simple: don't test Telegram APIs (that's their job), test my core functionality.

Predictable Testing:
- **No side effects** - Functions only change state, nothing else
- **No mocking** - No external dependencies to stub
- **Fast execution** - No network calls or file I/O in core operations
- **Deterministic** - Same input always produces same output

Separation of Concerns:
- **Application logic** lives in pure store actions
- **Side effects** (Telegram API calls, file generation) happen in reactions
- **Easy isolation** - Test core logic separately from integration

This testing approach caught several bugs during development:
- Edge cases in overload handling
- Invalid state transitions that could crash the bot
- Race conditions in concurrent request processing
- Subtle bugs in request lifecycle management

## Built for the Future

The beautiful part? This architecture seems scalable. Same store, different clients. Same logic, different interfaces. The store that powers the Telegram bot could power:

- A CLI tool
- A React web interface for bulk QR generation

and other React-based UIs like Electron-ish desktop apps or React Native mobile apps.

The core logic (request lifecycle, QR generation, state management) remains identical across all clients.

## Library Choice

You might be wondering about my library choice. I used the lower-level **[node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)** rather than the higher-level **[Telegraf](https://telegraf.js.org/)**. This decision actually reinforces the architectural approach.

I chose the lower-level **node-telegram-bot-api**:

```typescript
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome!');
});

bot.on('message', (msg) => {
  // Raw message handling - you build the patterns
});
```

Compare that to Telegraf's opinionated patterns:

```typescript
import { Telegraf } from 'telegraf';

const bot = new Telegraf(token);

bot.start(ctx => ctx.reply('Welcome!'));
bot.on('text', async (ctx) => {
  await ctx.reply('Processing...');
  try {
    const qr = await generateQR(ctx.message.text);
    await ctx.replyWithPhoto({ source: qr });
  } catch (error) {
    await ctx.reply('Error!');
  }
});
```

Why node-telegram-bot-api?
- Unopinionated
- Direct mapping to Telegram Bot API
- Lightweight
- **Composable primitives** (simple functions you can combine your own way)

Why Telegraf?
- Battle-tested patterns
- **Rich middleware ecosystem** (sessions, rate limiting, analytics)
- Built-in error handling and recovery


### Where Zustand/TEA Architecture Shines

We've already covered the **testing advantages** extensively. Beyond that, this architectural approach provides two key benefits that framework solutions typically can't match:

**1. Multi-Client Architecture**
```typescript
// Same store powers bot AND future React web app
const store = createStore(/* ... */);

// Bot uses it
store.subscribe(handleBotStateChanges);

// React app uses it too
function useQRStore() {
  return useStore(store);
}
```

**2. Observable State Machine**

The reactive architecture makes it trivial to add new capabilities. Want to build a dashboard to monitor all bot activity? Just add another subscription:
```typescript
// Every state transition is visible and reactive
store.subscribe((state) => {
  currentRequests.forEach(request => {
    if (request.state === RequestState.Completed) {
      sendQRToUser(request);
      logAnalytics(request);
      updateDashboard(request);
    }
  });
});
```

### The Trade-off

Custom Architecture (with low-level APIs):
- Control over every architectural decision
- Support for every client type (bot + web + CLI)
- Tracking for every state transition
- Testing for every business rule
- Maintainability for every future change
- Setup for every pattern you need
- Building for every abstraction you want

Telegraf Framework:
- Rapid development
- Rich ecosystem (middleware, scenes)
- Battle-tested patterns
- Built-in error handling
- Framework lock-in
- Less architectural flexibility
- Harder to extend beyond bots

You could theoretically use Telegraf for the Telegram plumbing while keeping your state architecture, but at that point, it would be more reasonable to just embrace the framework style. I think the hybrid approach would add complexity without clear benefits.


## Conclusions

Functional programming patterns aren't just for pure functional languages and some frontend libraries aren't just for frontend projects. State management, reactive programming, and unidirectional data flow solve problems wherever complex state exists, including bots.

The choice between framework convenience (Telegraf) and architectural control (custom Zustand) depends on your long-term goals. If you're building a system, not just a bot, the architectural investment provides a solid substrate for building complex systems.

**Next time you're building something stateful outside the browser, consider bringing your frontend toolkit along.**

---

*Want to see the full implementation? Check out the [source code](https://github.com/gicrisf/qrbot) and experiment with Zustand in your next non-React project.*
