# Neko Charts

Universal React Native charts library (works on react-native, react-native-web and react).

## Install

```
yarn add @neko-os/charts
```

### Mobile

```
yarn add react-native-svg
```

### Web or native-web

```
yarn add react-native-web react-native-svg-web
```

### Vite config

vite.config.js:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    },
    extensions: ['.web.js', '.js', '.jsx', '.json'],
  },
})
```

## Usage

```js
import { SimpleLinesChart } from '@neko-os/charts

const DATA = [
  {
    serie: 'A',
    data: [
      { x: 'Jan', y: 50 },
      { x: 'Feb', y: 80 },
      { x: 'Mar', y: 40 },
      { x: 'Apr', y: 120 },
      { x: 'May', y: 70 },
    ],
  },
  {
    serie: 'B',
    data: [
      { x: 'Jan', y: 30 },
      { x: 'Feb', y: 60 },
      { x: 'Mar', y: 90 },
      { x: 'Apr', y: 75 },
      { x: 'May', y: 100 },
    ],
  },

  {
    serie: 'C',
    data: [
      { x: 'Jan', y: 3 },
      { x: 'Feb', y: 6 },
      { x: 'Mar', y: 9 },
      { x: 'Apr', y: 7 },
      { x: 'May', y: 10 },
    ],
  },
]


<SimpleLinesChart data={DATA} />
```
