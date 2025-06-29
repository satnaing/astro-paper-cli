# AstroPaper CLI

A comprehensive CLI tool for [AstroPaper](https://github.com/satnaing/astro-paper) blog theme.

## Features

- Create new blog posts with proper frontmatter ✅
- Generate og images 🚧
- Add certain feature 👀

## Installation

```bash
# Using npm
npm install -g @astro-paper/cli

# Using yarn
yarn global add @astro-paper/cli

# Using pnpm
pnpm add -g @astro-paper/cli
```

## Usage

### Create a New Post

```bash
# Basic usage
astro-paper new

# With a title
astro-paper new "My New Blog Post"

# Create with default values
astro-paper new -y

# Create with all default values (including filename)
astro-paper new -Y

# Create a draft post
astro-paper new -d

# Create a featured post
astro-paper new -f

# Create post in a custom path
astro-paper new -p "./examples/posts"

# Combine options
astro-paper new "My New Post" -p "./posts" -d -f -y
```

### Command Options

| Option          | Alias | Description                                            |
| --------------- | ----- | ------------------------------------------------------ |
| `--yes`         | `-y`  | Create post with default values                        |
| `--yes-all`     | `-Y`  | Create post with default values and filename           |
| `--draft`       | `-d`  | Create as draft                                        |
| `--featured`    | `-f`  | Mark as featured                                       |
| `--path <path>` | `-p`  | The path to create the post (e.g. "./examples/posts/") |

## Post Frontmatter

The CLI will help you generate posts with the following frontmatter structure:

```yaml
---
title: New Post
author: John Doe
description: A brief description of this blog post.
slug: new-post
pubDatetime: 2025-06-29T10:06:31.006Z
tags:
  - others
draft: false
featured: false
---

Description

## Table of contents

## Intro

Content
```

## Requirements

- Node.js >= 18.0.0
- An AstroPaper project (the CLI will look for `astro.config.*` to identify the project root)

## Contributing

Feel free to suggest ideas or open issues. However, please don’t rush—this project yet as this is still in its early stages.

Please keep the following in mind:

- Focus on small bug fixes rather than large feature PRs
- Open an issue to discuss any new features before working on them
- Wait for feedback from the project maintainer before investing time in major changes

Thank you for your understanding and interest in contributing!

## License

MIT © [Sat Naing](https://github.com/satnaing)
