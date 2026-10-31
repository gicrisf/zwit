+++
title = "Zeeman"
description = "A minimal periodic table focused on isotope data."

[extra]
repo = "https://github.com/gicrisf/zeeman"
language = ["JavaScript"]
+++

Zeeman is an interactive periodic table for people who work with isotopes. Selecting an element shows its symbol, atomic number, isotopic abundances, and nuclear spin clusters in a compact visualisation designed to make the data readable at a glance.

## Why

Isotope data is scattered across PDFs, paper tables, and websites. For anyone doing EPR or NMR work, looking up the spin and natural abundance of every isotope for an element can take minutes. Zeeman collects those numbers into a single interface and presents them as a visual map rather than another dense table.

## Design

The interface follows a brutalist direction: information-dense visualisations, flat high-contrast colours, and no gradients. The inner ring of the chart shows isotopic abundances; the outer arcs group isotopes by nuclear spin. A legend, raw data table, and help panel explain the encoding without getting in the way.

The app is built with React, Zustand/Immer for state management, and D3.js for the custom visualisations. The [repository](https://github.com/gicrisf/zeeman) is open source.
