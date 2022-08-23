# Restful API Dropbox - NodeJS

## Quickstart

1. Clonar repositorio.

```bash
$ git clone <URL>
```
2. Crear `.env` en la raíz y copiar las variables de `.env.example`

```bash
$ cd dbx-api
$ copy .example.env .env
```
3. Instalar dependencias.

```bash
$ npm install
```

4. **Opcional.** Actualizar `src/main.ts` de ser necesario.

```js
const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const config = app.get(ConfigService);
	const NODE_ENV = config.get<string>("enviroment");
	const HOST = config.get<string>("http.host");
	const PORT = parseInt(config.get<string>("http.port"), 10) 

	const corsOptions: CorsOptions = {
		origin: '*',
		methods: ["GET", "POST", "PATCH", "HEAD", "PUT", "DELETE"]
		// credentials: true,
		// preflightContinue: false
	};
	
	....
}
```

5. Iniciar.

```bash
$ npm build
$ npm run start:prod
```

Realizar una prueba de conexión rapida.

```bash
$ curl.exe -X POST -H "Content-type: application/json" -d '{\"user\":\"test\",\"domain\":\"http:\\example.com\"}' 'https://<hostname>/auth/link_account'
```

## Environment Variables

| KEY                  | Description                                |
| -------------------- | ------------------------------------------ |
| `APP_HOST`           | Host.                                      |
| `APP_PORT`           | Puerto.                                    |
| `MONGO_URI`          | Connection String del host de MongoDB.     |
| `DB_NAME`            | Nombre de la base de datos.                |
| `APP_KEY`            | El app key de tu dropbox app.              |
| `APP_SECRET`         | El app secret de tu dropbox app.           |
| `URL_SWAGGER_APP`    | **Opcional** Host principal para Swagger.  |
| `URL_SWAGGER_SERVER` | **Opcional** Host secundario para Swagger. |

## Pasos

* Crear app en [dropbox](https://www.dropbox.com/developers/apps/create) y obtener las credenciales.
* Registrar **Redirect URIs** en la sección OAuth2.
* Obtener URI del host de la base de datos de MongoDB.
* Registrar las variables de entorno en el archivo `.env`
* Instalar las dependecias.
* Actualizar `main.ts`, `app.config.ts` o `app.module.ts` de ser requerido.
* Iniciar.


<!-- ## License -->
