<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as sveltestrap from 'sveltestrap';

	let Button = sveltestrap.Button;
	let Table = sveltestrap.Table;
	let Form = sveltestrap.Form;
	let FormGroup = sveltestrap.FormGroup;
	let Label = sveltestrap.Label;
	let Input = sveltestrap.Input;
	import { Buffer } from 'buffer';

	var client_id_spotify = '';
	var client_secret_spotify = '';
	var access_token_spotify = null;
	var refresh_token_spotify = null;

	const AUTHORIZE = 'https://accounts.spotify.com/authorize';
	const TOKEN = 'https://accounts.spotify.com/api/token';
	const PLAYLISTS = 'https://api.spotify.com/v1/me/playlists';

	let redirect_uri = 'https://sos2324-20-415018.ew.r.appspot.com/food-production/Spotify';

	let playlists = [];
	let show_token_section = false;
	let show_playlists_section = false;

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
		playlists.push({
			id: item.id,
			name: item.name,
			tracks: item.tracks.total,
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
					>, Tienes que crear una APP para obtener el Client Id y Secret y añadirlos
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
					<Table bordered striped>
						<thead>
							<tr>
								<th>
									<h3 class="mb-3" style="color: #4CAF50;">Playlists</h3>
									<div class="d-flex">
										<Button class="me-3" color="warning" on:click={refreshPlaylists}
											>Recargar</Button
										>
										<Button color="danger" on:click={revokeAcces}>Limpiar credenciales</Button>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{#if playlists.length == 0}
								<tr>
									<td colspan="6"><p class="text-center">No hay datos.</p></td>
								</tr>
							{:else}
								{#each playlists as x}
									<tr>
										<td>
											<img src={x.url_image} alt="Imagen de {x.name}" class="me-3" />
											{x.name} ({x.tracks})
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</Table>
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
