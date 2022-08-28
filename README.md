# Restful API Dropbox - NodeJS

## Quickstart

1. Clonar repositorio.

```sh
$ git clone <URL>
```
2. Crear `.env` en la raíz y copiar las variables de `.env.example`

```sh
$ cd dbx-api
$ copy .example.env .env
```
3. Instalar dependencias.

```bash
$ npm install
```
4. **Opcional.** Actualizar `src/main.ts` de ser necesario.

```ts
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
<br>

> Si se va a utilizar el endpoint `auth/register` (donde el api se encarga de vincular la cuenta de dropbox)<br>
> se tiene que registrar en la aplicación que dropbox el siguiente **Redirect URI**:<br>
> 
> {HTTP_PROTOCOL}://hostname:{PORT}/auth/register&nbsp;&nbsp;&nbsp;&nbsp;_(omitir puerto en producción)_<br>
> 
> <ins>Ejemplo en local:</ins><br>
> _http://localhost:5000/auth/register_

<br>
5. Iniciar.

```bash
$ npm build
$ npm run start:prod
```

Realizar una prueba de conexión rapida.

```s
$ curl.exe -X POST -H "Content-type: application/json" -d '{\"user\":\"test\",\"domain\":\"http:\\example.com\"}' 'https://<hostname>/auth/link_account'
```

<br>

> Para que el api se encarge de levantar el form (segundo metodo) se tiene que pasa el<br>
> parametro "init" con cualquier valor en el body.<br>
> 
```bash
curl -X POST https://<host>/auth/register
	--header "Content-Type": "application/x-www-form-urlencoded"
	-d	\
	user: = "test",
	domain = "https://example.com/dashboard",
	init = true
```

<br>

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

## Dropbox Scopes

&emsp; **<ins>Account Info</ins>**<br>
&emsp; &#9745; account_info.write<br>
&emsp; &#9745; account_info.read

&emsp; **<ins>Files and folders</ins>**<br>
&emsp; &#9745; files.metadata.write<br>
&emsp; &#9745; files.metadata.read<br>
&emsp; &#9745; files.content.write<br>
&emsp; &#9745; files.content.read

&emsp; **<ins>Collaboration</ins>**<br>
&emsp; &#9745; sharing.read<br>
&emsp; &#9745; file_requests.write<br>
&emsp; &#9745; file_requests.read<br>
&emsp; &#9745; contacts.write<br>
&emsp; &#9745; contacts.read

## Pasos

* Crear app en [dropbox](https://www.dropbox.com/developers/apps/create) y obtener las credenciales.
* Registrar **Redirect URIs** en la sección OAuth2.
* Obtener URI del host de la base de datos de MongoDB.
* Registrar las variables de entorno en el archivo `.env`
* Instalar las dependecias.
* Actualizar `main.ts`, `app.config.ts` o `app.module.ts` de ser requerido.
* Iniciar.


<!-- ## License -->
