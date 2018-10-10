# gondolin

System requirments:

- docker
- docker-compose
- g++
- postgresql-server-dev-10
- node-gyp (via `npm install node-gyp -g`)

Setup:

1. Create a `passport.ts` in the config folder. The file contains the
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

2. Start the database and pgAdmin: `docker-compose --f docker-compose-dev.yml up`

3. Run `npm install` and then `npm start` and gondolin will be available at `http://localhost:3000`.


## Run via docker / docker-compose

```
docker build -t gondolin-server .

docker-compose up
```