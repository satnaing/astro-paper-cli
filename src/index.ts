#!/usr/bin/env node

import packageJson from "../package.json" with { type: "json" };

console.log("Hello, World", packageJson.name);
