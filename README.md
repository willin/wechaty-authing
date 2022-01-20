# wechaty-authing

[![Maintainability](https://api.codeclimate.com/v1/badges/3e8c3f891b4a3adcb80d/maintainability)](https://codeclimate.com/github/Authing/wechaty-authing/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/3e8c3f891b4a3adcb80d/test_coverage)](https://codeclimate.com/github/Authing/wechaty-authing/test_coverage)

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
