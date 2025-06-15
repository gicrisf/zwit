+++
title = "Zeeman: a minimalistic periodic table focused on isotopes"
author = ["Giovanni Crisalfi"]
date = 2025-06-15
draft = false
[taxonomies]
  tags = ["react", "d3"]
  categories = ["web", "gui", "chem", "projects"]
+++

There’s a peculiar frustration familiar to anyone who’s worked with spectroscopic techniques like EPR or NMR: the hunt for isotopic data. You need both the spin and natural abundance of every isotope for an element, but these critical numbers are scattered across PDFs, paper tables, or, even worse, different websites. It takes _minutes_ to look them up! My programmer heart couldn’t bear such inefficiency.

<!-- more -->

# Genesis

This _profoundly_ inhuman struggle haunted me daily during my master’s thesis in Pharmaceutical Chemistry at the University of Bologna. Working with Prof. Lucarini’s group, we studied supramolecular compounds built from:
- An organic host with a _stable_ radical
- An inorganic metallic guest

The stable radical made these compounds perfect for EPR spectroscopy, but the metal guests often had multiple isotopes, each with its own spin. While rewriting a DOS Monte Carlo simulator in Rust (a side project called [_Esrafel_](https://github.com/gicrisf/esrafel)), I needed to simulate EPR spectra, which meant constantly cross-referencing isotope spins and abundances. My solution at the time? A Python CLI script that spat out isotope tables.

For the script, I paired a pristine natural abundance ASCII table from NIST with something far rougher: a _hand-rolled_ dataset for spins I built from scratch. No tidy dataset existed, just inconsistent Wikipedia tables and textbook footnotes. I scraped, cleaned, and manually verified the values. Since I only cared about lab-relevant isotopes, I ignored the exotic ones only detectable in particle accelerators.

It worked fine, but it was CLI-only (fine for me, useless for anyone else). Years later, as a professional software developer, I was looking for a project to test my own abilities in representing data with a beautiful library, `D3.js`, especially using custom arcs and curves. Also, I thought that a table gets the job done, but a _visual_ representation could make spin distributions intuitive at a glance. I envisioned a double pie chart: inner rings for isotopic abundance, outer arcs clustering isotopes by spin. The idea _galvanized_ me, I had to build it.

So I did. Today I’m happy to finally share _Zeeman_: a free, interactive web app to make isotopic data as intuitive as a periodic table should be.

# How It Works

Like any periodic table, start selecting an element; the central panel will update instantly with:
- The element’s symbol
- Its atomic number
- A colorful thick inner ring
- A sleek black outer ring

The inner ring displays isotopic abundances, while the outer ring represents nuclear spin clusters.

### Navigation

- *Show Help*: Explains the visualization logic.
- *Show Legend*: Maps colors to nuclear spins.
- *Show Table*, unlocks raw isotope data, displaying for each isotope:
  - Mass number
  - Relative atomic mass
  - Spin
  - Half-life
  - Isotopic composition

- Finally, the *About* button opens an about section.

### Design Philosophy
Brutalist foundations: 
- Immediate, information-dense visualizations. 
- Flat, vibrant colors (no gradients)
- High-contrast combinations

# Under the Hood

For the tech-curious, this is the stack:
- *[React](https://react.dev/)* - UI library (doesn't need introductions)
- *[Zustand/Immer](https://zustand.docs.pmnd.rs/)* - state management with surgical updates and immutable safety
- *[D3.js](https://d3js.org/)* - powers my custom visualizations

[I've already written about the beautiful Zustand/Immer combination](/posts/20250301173228-building-robust-react-apps-with-zustand-and-immer).

By the way, [Zeeman is open-source on GitHub](https://github.com/gicrisf/zeeman). Contributions and forks are all welcome. Leave a star if you like the project!

### On D3.js

Speaking of D3.js, it's not just another charting library, it's one of the most elegant libraries in the entire JavaScript ecosystem. New to it?
1. Explore live examples on [Observable](https://observablehq.com)
2. Read the creator's canonical post [Thinking with Joins](https://bost.ocks.org/mike/join/) to understand its data-binding paradigm

*About that last link:* While it references an older D3 version, every single line of the post remains relevant. The newer APIs simply wrap the same core logic more elegantly. As I use D3 for other work too, we'll likely discuss it again here.

# Who’s Zeeman For?

- *Students* exploring NMR/EPR isotope effects
- *Researchers* needing quick access to isotope data
- *Educators* creating interactive lessons

# Where Next?

- *Mobile flow*: Smoother touch interactions for lab tablets/phones
- *Desktop port*: A single executable for offline use
- *Keyboard shortcuts*: Faster navigation on desktop
- *Export*: High-res graph images for publications

# The name

The name pays homage to [Pieter Zeeman](https://www.nobelprize.org/prizes/physics/1902/zeeman/biographical/), whose work on magnetic fields and atomic spectra laid the foundation for modern NMR/EPR techniques.

# Conclusions

*_Zeeman_* bridges the gap between raw isotopic data and human intuition (no more scavenging through PDFs or wrestling with tables). It’s the tool I wish I’d had during my thesis, now polished for everyone from students to researchers. 

[Start exploring isotopes →](https://zeeman-table.netlify.app/)
