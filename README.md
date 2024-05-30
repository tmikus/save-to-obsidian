# Save to Obsidian Chrome Extension

## Development

To build and run the plugin locally you first need to install node packages:

```bash
npm i
```

Once you have packages installed you can run the build in watch mode. To do that run these commands in separate
terminal tabs:

```bash
# Run this in the first tab
npm run watch

# Then this in another tab
npx tailwindcss -i ./src/input.css -o ./dist/style.css --watch
```
