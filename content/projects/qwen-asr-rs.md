+++
title = "Qwen ASR RS"
description = "A Rust port of Qwen3-ASR for CPU speech-to-text."

[extra]
repo = "https://github.com/gicrisf/qwen-asr-rs"
language = ["Rust"]
+++

Qwen ASR RS is a Rust port of [antirez/qwen-asr](https://github.com/antirez/qwen-asr), a CPU inference engine for Qwen3-ASR speech-to-text models. It uses [candle](https://github.com/huggingface/candle) for the neural network work and keeps the original's CPU-first design.

## Pipeline

A WAV file is converted to a log-mel spectrogram, passed through the audio encoder, combined with prompt embeddings, and decoded into text tokens. The crate supports Qwen3-ASR-0.6B and Qwen3-ASR-1.7B, detecting the model variant from the model directory.

The command-line tool transcribes a WAV file and prints text to stdout with timing on stderr. A separate benchmark binary measures the full pipeline or the encoder alone. The crate is also usable as a library through `Pipeline::load`, `transcribe`, and `transcribe_timed`.

## Where it sits

This is a standalone Rust implementation rather than a wrapper around the Python model. Model weights come from Hugging Face, and the [repository](https://github.com/gicrisf/qwen-asr-rs) includes download and build scripts for the supported models.
