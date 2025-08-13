+++
title = "Kaomel: a snappy kaomoji picker for Emacs"
author = ["Giovanni Crisalfi"]
date = 2025-08-13
draft = false
[taxonomies]
  tags = ["emacs", "lisp"]
  categories = ["projects"]
+++

I always liked kaomojis, but I never liked using the mouse to pick an emoji of any kind. Actually, I just don't like using the mouse. So I thought I could access the kaomoji world through Emacs keymagic. What started as "wouldn't it be nice to have a kaomoji picker in Emacs?" became a journey that would consume more weekends than initially planned.

<!-- more -->

## Origins

The idea struck me in July 2023, but considering Emacs's long history, I knew someone had probably built something like this already. Sure enough, I found [kaomoji.el](https://github.com/kuanyui/kaomoji.el), but its dataset was much smaller than my local collection, and it required Helm while I was using Vertico.

I could have forked it, but that would mean rewriting the interface layer and adapting to their dataset structure: basically everything. So I chose to design from scratch.

In my mind, the real goal was bigger: plug my dataset into any input interface. Why not **dmenu**? Why not [windmenu](https://github.com/gicrisf/windmenu)? (I'm working on it.) Why not the CLI? I want my kaomojis everywhere. Sure, I prefer staying in Emacs, but we all know sometimes you're forced to venture outside your parentheses-wrapped sanctuary.

Before diving into implementation, I had to establish the non-negotiables. Two constraints would drive every subsequent decision: **interface flexibility** and **dataset extensibility**. These weren't features you could retrofit; they were architectural decisions that needed to be right from the start.

The first concept seemed simple enough: parse a JSON dataset of kaomojis, present them through a fuzzy-searchable interface, then insert the selection at point or copy to clipboard. These problems could have adapted perfectly to any textual interface.

But as I dove into the implementation, what seemed like a weekend project revealed layers of interesting problems that would define the entire architecture.

## Architecture

- *Completion flexibility* meant the package had to work equally well with Vertico, Helm, or any future completion framework. This wasn't about supporting every possible interface, it was about designing abstractions that didn't lock users (and developers) into specific tools.

- *Dataset extensibility* meant the structure had to accommodate languages I hadn't thought of yet. Today it's Japanese, English and Italian; tomorrow it might need Arabic script or emoji modifiers. The data model needed to be future-proof.

## Dataset

My first challenge was the data itself. I looked around for existing kaomoji datasets, hoping someone had already solved this problem. What I found was a constellation of different approaches. Projects like [kao](https://github.com/fand/kao) used structured text files that were clean and human-readable, serving their Japanese-focused community well:

```
@?          （？〜？         顔文字
@あ?        (๑•ૅㅁ•๑)ぁ？    顔文字
@あめ       ⋰⋰ ☂ (ృ ˘ ꒳ ˘  ృ 　)ु  ⋱⋱    顔文字
@ありがとう  (*ゝω・)ﾉ ｱﾘｶﾞ㌧♪    顔文字
```

This wouldn't work for my multilingual ambitions (someone searching for "thank you" or "grazie" would find nothing) but I appreciated the clarity of the tab-separated format.

The dataset that came closest to my vision was from the [kaomoji-vscode](https://github.com/Coiven/kaomoji-vscode) extension. It had the structured JSON I wanted, with tags that could support search.

The original extension was designed to randomly pick one kaomoji from the array when a user selected a tag. This made sense for their use case—users would get variety without having to choose between dozens of similar emoticons. But what caught my attention wasn't the random selection; it was how the structure kept the dataset maintainable and compact by grouping related kaomojis under semantic tags.

From the beginning, I knew the JSON would just be a source format, a way to organize and maintain the data that I'd transform into an optimized Emacs Lisp vector at runtime. This pre-processing approach gave me the freedom to make the dataset more compact and maintainable without being constrained by the original structure in the Lisp realm:

```json
[{
    "tag": "laugh 笑 哈哈",
    "yan": [
        "o(*≧▽≦)ツ┏━┓",
        "(/≥▽≤/)",
        "ヾ(o◕∀◕)ﾉ"
    ]
}]
```

But even this felt limited: tags weren't atomic; instead, they contained multiple languages and concepts in a single string. The "yan" field (containing the actual kaomojis) was an array, meaning each tag mapped to multiple emoticons. Having multiple kaomojis per semantic tag actually made sense: why should "laugh" map to just one emoticon when there are dozens of ways to express laughter?

The original VSCode extension would randomly select one kaomoji from this array when users picked a tag, adding an element of surprise and preventing the interface from becoming overwhelming. But I wanted users to see and choose from all available options (the whole point was having that rich, searchable collection at your fingertips).

This led me to think about the final Emacs Lisp structure: a vector where every kaomoji would have its full context available for instant search. In Emacs, users expect instant fuzzy matching across everything. That meant I needed a flat, searchable structure. The redundancy would be worth the maintainability.

Here's what a single processed entry looks like in the Emacs Lisp data structure (hash-table metadata stripped for clarity):

```lisp
#s(hash-table data 
  ("tag" [
    #s(hash-table data ("orig" "laugh " "hira" "laugh " "kana" "laugh " 
                        "hepburn" "laugh " "kunrei" "laugh " "passport" "laugh "
                        "en" "laugh " "it" "ridere"))
    #s(hash-table data ("orig" "笑" "hira" "わらい" "kana" "ワライ" 
                        "hepburn" "warai" "kunrei" "warai" "passport" "warai"
                        "en" "笑" "it" "笑"))
    #s(hash-table data ("orig" "哈" "hira" "ごう" "kana" "ゴウ" 
                        "hepburn" "gou" "kunrei" "gou" "passport" "gou"
                        "en" "哈" "it" "哈"))
  ])
  ("yan" ["o(*≧▽≦)ツ┏━┓" "(/≥▽≤/)" "ヾ(o◕∀◕)ﾉ"]))
```

The kaomoji got tagged not just with "laugh" in English, but with わらい in hiragana, ワライ in katakana, and "ridere" in Italian. 

This dataset structure made it trivial to add new languages later. Want French support? The mapping system is already there - just add "rire" to the semantic space alongside "laugh" and "わらい". The beauty is that users can mix and match these language preferences without any structural changes to the core data.

This multilingual-first approach became crucial when I realized different users would want different tag languages displayed. Some prefer English for readability, others want the original Japanese for authenticity, and some want romanization for typing efficiency. This new model had the proper flexibility from the beginning, making it straightforward to support all these preferences simultaneously.

## Romanization

Early in development, I got excited about romanization. Why not convert "笑" to "warai" automatically, making the dataset searchable by romaji? My first approach was to integrate Python bindings for the [Romkan package](https://pypi.org/project/romkan/) directly into the runtime vector build process: every time kaomel loaded, it would generate romanized versions on the fly.

<!-- Keep in mind in this time I didn't mean to ship the package; of course the python solution was meant for my own use. -->
But this felt heavy. Why introduce Python dependencies when I could handle romanization in pure Emacs Lisp? This led me to create [romkan.el](https://github.com/gicrisf/romkan.el/), my own package for Japanese-romaji conversion that worked entirely within Emacs.

Even after building a working Emacs Lisp solution, I realized there was an even cleaner approach. Instead of adding romkan as a runtime dependency (requiring users to install another package) I used it as a development tool. I ran the conversions once during dataset preparation, then baked the romanized results directly into the static dataset. This kept kaomel completely dependency-free while still providing full romanization support.

At this point, could I have done it all with the Python Romkan? Yes. Do I care? No.

## Completion flexibility

The Emacs ecosystem has been shifting toward `completing-read` and frameworks like Vertico, but many packages still assume Helm as the primary interface. Helm, while powerful (and honestly beautiful), is essentially a parallel universe with its own conventions and complexity.

I decided to embrace the modern direction both because I think it represents the cleaner architectural path (and, as I said before, because I was using Vertico myself), while still supporting both approaches.

So I built kaomel with automatic Helm detection when available. The package picks Helm if it finds it, but users can force `completing-read` via `kaomel-avoid-helm`. This way, whether you're team Vertico or team Helm, kaomel works seamlessly with your preferred completion framework.

## Text Alignment

One detail that consumed far more time than expected: text alignment. When you're displaying both English tags and kaomojis, string length calculations become tricky. The tag "laugh 笑" and the kaomoji "(/≥▽≤/)" don't behave the same way in terms of display width.

Emacs provides `string-width` for display-aware measurements, which was the key to solving this. Instead of naive character counting, I used `string-width` to calculate actual display width, then padded everything to achieve consistent alignment. Whether you're looking at "laugh 笑" or "ಠ_ಠ disapproval", the spacing stays visually consistent. These details matter when you're building something people use dozens of times per day.

## Configuration

The configuration system turned out to be more important than I initially expected. I tried to provide a high degree of customization while building what I thought were sensible defaults. Instead of hard-coding interface choices, I made the key aspects customizable:

- Which completion framework to use (`kaomel-force-completing-read`)
- Which tag languages to display (`kaomel-tag-langs`) - supporting original, hiragana, katakana, English, Italian, and romanization formats
- Whether to filter ASCII-only tags (`kaomel-only-ascii-tags`)
- How aggressive tag trimming should be (`kaomel-heavy-trim-tags`)
- Visual formatting options like separators (`kaomel-tag-val-separator`, `kaomel-tag-tag-separator`)
- Custom prompts (`kaomel-prompt`) and candidate limits (`kaomel-candidate-number-limit`)

This was user-friendly design that happened to encourage clean abstractions. By making these choices configurable, I had to ensure the code worked correctly regardless of user preferences, which led to a more robust implementation.

For detailed documentation of each configuration option, see the Configuration section in the [README](https://github.com/gicrisf/kaomel).

## Literate Programming

The early development followed a literate programming approach, with all exploration happening in an org-mode document mixing prose, code blocks, and results. This wasn't just note-taking, it was thinking through code, documenting each decision as it happened.

Each code block could be evaluated in place, with results appearing inline. Want to test JSON parsing? Write a block, execute it, see the output. Need to try different data structures? Compare approaches side-by-side with immediate feedback. This resembles the classic Lisp **REPL** workflow but with all the organizational benefits of [org-mode](https://orgmode.org/). The development document became a living laboratory.

This approach proved invaluable for a project involving data transformations. Instead of jumping between files, everything lived in one navigable document. The prose explained the reasoning, the code showed the implementation, and the results validated the approach.

Developing in Emacs Lisp has a unique rhythm, and literate programming amplifies it. The edit-eval-test cycle is instant, encouraging experimental development. When I could test a search query instantly, I noticed performance issues early. When I could try different tag arrangements in real-time, I found the most readable format quickly. The org document is a thinking space where ideas can be explored, tested, refined, and documented simultaneously.

What's interesting is how this approach naturally captured feature evolution (which led to this blog post). 

## Tooling

As the lisp snippets crystallized into a proper package, I found myself needing tools that could work outside my personal Emacs environment.

I'm traditionally a shell person when developing anything, and I like keeping that solid shell alternative in Emacs development too. No surprise I'm a [Doom Emacs](https://github.com/doomemacs/doomemacs) admirer: there's something deeply satisfying about typing `./doom doctor` and watching it methodically check your entire configuration, so I initially adopted that approach for kaomel.

```bash
# I used it to regenerate kaomel-data.el
# It just wrapped the `kaomel-dev-regenerate-data` batch call
./kaomel-data-gen.sh gen
```

But I further simplified this by embracing eldev fully. Eldev has [builders](https://emacs-eldev.github.io/eldev/#custom-builders) specifically designed for generating files from sources, and I always prefer writing Lisp instead of bash wrappers:

```elisp
(eldev-defbuilder kaomel-data-generator (source target)
  :short-name     "data"
  :source-files   "kaomel-data.json"
  :targets        ("kaomel-data.json" -> "kaomel-data.el")
  :collect        ":default"
  (load-file "kaomel-utils.el")
  (kaomel-dev--generate-data-file source target))
```

This integrates perfectly with eldev's build system:

```bash
eldev build          # Generates kaomel-data.el if kaomel-data.json changed
eldev test           # Run tests
eldev lint           # Run linter
eldev compile        # Compile to bytecode
eldev clean data     # Clean generated files
```

This approach comes in handy for CI/CD too (no need to figure out how to invoke Emacs batch commands from scratch when you already have a working interface through eldev).

## Conclusions

After using it in my daily workflow and letting it mature through real-world use, it's time to share what became a surprisingly robust little package. The final package is focused: a main `.el` file plus a separate data file containing the processed kaomoji dataset. No complex dependencies beyond Emacs, no external processes, just pure Emacs Lisp doing what it does best: text manipulation and user interaction.

Kaomel try following principles I value in Emacs packages: focused functionality, standard-compliant interfaces, and respect for user choice. Instead of imposing a particular workflow, it integrates with whatever completion framework users prefer.

The current package works well for daily use and feels ready for a `1.0.0` release, but I think there's room for more features. During early phases, I sketched out several ideas that could add value: easier selection for frequently used kaomojis, usage statistics, more sophisticated tagging. The clean separation between data processing and interface presentation means adding new features wouldn't require fundamental changes to the core architecture (at least, they shouldn't).

What started as a simple utility became an occasion to explore different completion systems, Unicode strings handling, and (once again) the particular pleasures of lisp development. After using it daily for months, it's proven stable and useful enough to share. Also, I now have perfect kaomoji selection at my fingertips ｡◕‿◕｡

---

*Kaomel is available on GitHub and I've submitted the recipe to MELPA. If you're curious about the implementation details or want to contribute, the codebase is [here](https://github.com/gicrisf/kaomel).*
