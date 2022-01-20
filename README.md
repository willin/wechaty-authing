# wechaty-authing

- [wechaty-authing](#wechaty-authing)
  - [Usage](#usage)
  - [LICENSE](#license)

## Usage

POC Example: <https://github.com/Authing/wechaty-authing-poc>

```ts
import { WechatyAuthing, type WechatyAuthingConfig } from 'wechaty-authing';

const config: WechatyAuthingConfig = {
  userPoolId: 'xxxxxxxxxx',
  secret: 'xxxxxxxxxxx'
};

const authing = WechatyAuthing(config);
```

## LICENSE

Apache 2.0
