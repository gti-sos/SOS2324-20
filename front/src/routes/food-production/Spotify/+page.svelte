<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Button, Table, Form, FormGroup, Label, Input } from '@sveltestrap/sveltestrap';
	import { Buffer } from 'buffer';

	var client_id_spotify = '';
	var client_secret_spotify = '';
	var access_token_spotify = null;
	var refresh_token_spotify = null;

	const AUTHORIZE = 'https://accounts.spotify.com/authorize';
	const TOKEN = 'https://accounts.spotify.com/api/token';
	const PLAYLISTS = 'https://api.spotify.com/v1/me/playlists';

	//let redirect_uri = 'https://sos2324-20-415018.ew.r.appspot.com/food-production/Spotify';
	let redirect_uri = 'http://localhost:5173/food-production/Spotify';

	let playlists = [];
	let show_token_section = false;
	let show_playlists_section = false;
	let selectedPlaylistId = null;
	let songs = [];

	onMount(async () => {
		onPageLoad();
	});

	async function onPageLoad() {
		client_id_spotify = localStorage.getItem('client_id_spotify');
		client_secret_spotify = localStorage.getItem('client_secret_spotify');
		if (window.location.search.length > 0) {
			handleRedirect();
		} else {
			access_token_spotify = localStorage.getItem('access_token_spotify');
			if (access_token_spotify == null) {
				show_token_section = true;
			} else {
				show_token_section = false;
				show_playlists_section = true;
				refreshPlaylists();
			}
		}
	}
	async function handleRedirect() {
		let code = await getCode();
		fetchAccessToken(code);
		window.history.pushState('', '', redirect_uri); // remove param from url
	}
	async function getCode() {
		let code = null;
		const queryString = window.location.search;
		if (queryString.length > 0) {
			const urlParams = new URLSearchParams(queryString);
			code = urlParams.get('code');
		}
		return code;
	}
	async function fetchAccessToken(code) {
		let body = 'grant_type=authorization_code';
		body += '&code=' + code;
		body += '&redirect_uri=' + encodeURI(redirect_uri);
		body += '&client_id=' + client_id_spotify;
		body += '&client_secret=' + client_secret_spotify;
		callAuthorizationApi(body);
	}

	async function callAuthorizationApi(body) {
		fetch(TOKEN, {
			method: 'POST',
			body: body,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization:
					'Basic ' +
					new Buffer.from(client_id_spotify + ':' + client_secret_spotify).toString('base64')
			}
		})
			.then((response) => {
				handleAuthorizationResponse(response);
			})
			.catch((error) => {
				console.error('There was a problem with the fetch operation:', error);
			});
	}
	async function handleAuthorizationResponse(data) {
		const status = await data.status;
		if (status == 200) {
			const data_res = await data.json();
			if (data_res.access_token != undefined) {
				access_token_spotify = data_res.access_token;
				localStorage.setItem('access_token_spotify', access_token_spotify);
			}
			if (data_res.refresh_token != undefined) {
				refresh_token_spotify = data_res.refresh_token;
				localStorage.setItem('refresh_token_spotify', refresh_token_spotify);
			}
			onPageLoad();
		} else {
			console.log(status);
		}
	}

	async function callApi(method, url, body) {
		const res = await fetch(url, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + access_token_spotify
			},
			body: body
		});
		const status = await res.status;
		if (status == 200) {
			const data = await res.json();
			playlists = [];
			data.items.forEach((item) => addPlaylist(item));
		} else if (status === 401) {
			refreshAccessToken();
		} else {
			console.log(status);
		}
	}
	async function addPlaylist(item) {
		console.log(item);
		const tracksTotal = item.tracks ? item.tracks.total : 0; // Verificar si tracks está definido
		playlists.push({
			id: item.id,
			name: item.name,
			tracks: tracksTotal,
			url_image: item.images[0].url
		});
	}

	async function refreshAccessToken() {
		refresh_token_spotify = localStorage.getItem('refresh_token_spotify');
		let body = 'grant_type=refresh_token';
		body += '&refresh_token=' + refresh_token_spotify;
		body += '&client_id=' + client_id_spotify;
		callAuthorizationApi(body);
	}
	async function refreshPlaylists() {
		callApi('GET', PLAYLISTS, null);
	}
	async function requestAuthorization() {
		localStorage.setItem('client_id_spotify', client_id_spotify);
		localStorage.setItem('client_secret_spotify', client_secret_spotify); // In a real app you should not expose your client_secret to the user
		let url = AUTHORIZE;
		url += '?client_id=' + client_id_spotify;
		url += '&response_type=code';
		url += '&redirect_uri=' + encodeURI(redirect_uri);
		url += '&show_dialog=true';
		url += '&scope=playlist-read-private';
		window.location.href = url; // Show Spotify's authorization screen
	}
	async function revokeAcces() {
		localStorage.removeItem('client_id_spotify');
		localStorage.removeItem('client_secret_spotify');
		localStorage.removeItem('access_token_spotify');
		localStorage.removeItem('refresh_token_spotify');
		show_token_section = true;
		show_playlists_section = false;
		client_id_spotify = '';
		client_secret_spotify = '';
		access_token_spotify = null;
		refresh_token_spotify = null;
	}
	async function callApi2(method, url, body) {
		try {
			const res = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + access_token_spotify
				},
				body: body
			});
			if (!res.ok) {
				throw new Error('La respuesta de la API no fue exitosa. Código de estado: ' + res.status);
			}
			return res; // Devuelve la respuesta para ser procesada posteriormente
		} catch (error) {
			console.error('Hubo un error al llamar a la API:', error);
			throw error; // Reenvía el error para que pueda ser manejado por el bloque catch externo
		}
	}

	async function refreshSongs() {
		if (!selectedPlaylistId) return; // Si no hay una playlist seleccionada, no hagas nada
		const url = `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`;
		callApi2('GET', url, null)
			.then(async (data) => {
				const response = await data.json();
				if (response.items) {
					// Limpiar la lista de canciones
					songs = [];
					// Iterar sobre cada elemento (canción) recibido
					response.items.forEach((item) => {
						// Obtener el nombre de la canción y agregarlo a la lista de canciones
						const songName = item.track.name;
						songs.push({ name: songName });
					});
				} else {
					console.error('No se recibieron canciones de la playlist.');
				}
			})
			.catch((error) => {
				console.error('Hubo un error al obtener las canciones:', error);
			});
	}
</script>

<main>
	<div class="container" style="margin-top: 1%;">
		{#if show_token_section == true}
			<div class="row" style="margin-bottom: 1%;">
				<h2>Listar tus playlist de spotify usando OAUTH2.0</h2>
				<p>
					Para poder usar esta funcionalidad, tienes que ir a la página de desarrolladores de
					spotify: <a href="https://developer.spotify.com/dashboard/applications"
						>https://developer.spotify.com/dashboard/applications</a
					>, Tienes que crear una APP para obtener el Client Id y Secret y añadir la URL
					<strong>https://sos2324-20-415018.ew.r.appspot.com/food-production/Spotify</strong> en el campo
					"Redirect URIs".
				</p>
			</div>
			<Form class="mb-3">
				<FormGroup class="mb-3">
					<Label for="clientId">Client Id</Label>
					<Input type="textarea" name="text" id="clientId" bind:value={client_id_spotify} />
				</FormGroup>
				<FormGroup class="mb-3">
					<Label for="clientSecret">Client Secret</Label>
					<Input type="textarea" name="text" id="clientSecret" bind:value={client_secret_spotify} />
				</FormGroup>
				<FormGroup>
					<Button color="primary" on:click={requestAuthorization}>Pedir autorización</Button>
				</FormGroup>
			</Form>
		{/if}
		{#if show_playlists_section == true}
			<div class="row">
				<div class="col-md-6">
					<Form class="mb-3">
						<FormGroup>
							<Label for="playlistSelect">Selecciona una Playlist</Label>
							<Input
								type="select"
								id="playlistSelect"
								bind:value={selectedPlaylistId}
								on:change={refreshSongs}
							>
								<option value="">Selecciona una Playlist</option>
								{#each playlists as playlist}
									<option value={playlist.id}>{playlist.name}</option>
								{/each}
							</Input>
						</FormGroup>
					</Form>
				</div>
			</div>
			<!-- Agregar una lista para mostrar las canciones -->
			<div class="row">
				<div class="col-md-6">
					<ul>
						{#each songs as song}
							<li>{song.name}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	th {
		background-color: #1e90ff;
		color: white;
		font-weight: bold;
		display: flex;
	}
	img {
		width: 50px;
		height: 50px;
		border-radius: 25%;
	}
</style>
