# gondolin

System requirments: 

- docker
- docker-compose
- g++
- postgresql-server-dev-10
- node-gyp (via `npm install node-gyp -g`)

Setup:

1. Create a `passport.js` in the config folder. The file contains the
secret for the passport authentification.

```
/**
 * This file should not be pushed to public repositories as it contains the
 * jwt secret!
 */
module.exports = {
  'secretOrKey': 'mellon'
}
```