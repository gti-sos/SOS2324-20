<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Button, Form, FormGroup, Label, Input } from '@sveltestrap/sveltestrap';

	let spotifyClientId = '';
	let spotifyClientSecret = '';
	let spotifyAccessToken = null;
	let spotifyRefreshToken = null;

	const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
	const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
	const SPOTIFY_PLAYLISTS_URL = 'https://api.spotify.com/v1/me/playlists';

	let appRedirectUri = 'https://sos2324-20-415018.ew.r.appspot.com/food-production/Spotify';

	let userPlaylists = [];
	let displayTokenSection = false;
	let displayPlaylistsSection = false;
	let selectedPlaylistId = null;
	let playlistSongs = [];

	onMount(async () => {
		initializePage();
	});

	async function initializePage() {
		spotifyClientId = localStorage.getItem('spotifyClientId');
		spotifyClientSecret = localStorage.getItem('spotifyClientSecret');
		if (window.location.search.length > 0) {
			handleRedirect();
		} else {
			spotifyAccessToken = localStorage.getItem('spotifyAccessToken');
			if (spotifyAccessToken == null) {
				displayTokenSection = true;
			} else {
				displayTokenSection = false;
				displayPlaylistsSection = true;
				updatePlaylists();
			}
		}
	}

	async function handleRedirect() {
		const code = await fetchAuthCode();
		fetchSpotifyAccessToken(code);
		window.history.pushState('', '', appRedirectUri);
	}

	async function fetchAuthCode() {
		const queryString = window.location.search;
		if (queryString.length > 0) {
			const urlParams = new URLSearchParams(queryString);
			return urlParams.get('code');
		}
		return null;
	}

	async function fetchSpotifyAccessToken(code) {
		const requestBody = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(appRedirectUri)}&client_id=${spotifyClientId}&client_secret=${spotifyClientSecret}`;
		callSpotifyApiForToken(requestBody);
	}

	async function callSpotifyApiForToken(requestBody) {
		const response = await fetch(SPOTIFY_TOKEN_URL, {
			method: 'POST',
			body: requestBody,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic ' + btoa(`${spotifyClientId}:${spotifyClientSecret}`)
			}
		});
		handleSpotifyTokenResponse(response);
	}

	async function handleSpotifyTokenResponse(response) {
		if (response.status === 200) {
			const data = await response.json();
			spotifyAccessToken = data.access_token;
			localStorage.setItem('spotifyAccessToken', spotifyAccessToken);
			if (data.refresh_token) {
				spotifyRefreshToken = data.refresh_token;
				localStorage.setItem('spotifyRefreshToken', spotifyRefreshToken);
			}
			initializePage();
		} else {
			console.error(response.status);
		}
	}

	async function callSpotifyApi(method, url, body = null) {
		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${spotifyAccessToken}`
			},
			body
		});
		if (response.status === 200) {
			const data = await response.json();
			userPlaylists = data.items.map((item) => ({
				id: item.id,
				name: item.name,
				tracks: item.tracks?.total || 0,
				imageUrl: item.images[0]?.url
			}));
		} else if (response.status === 401) {
			refreshSpotifyAccessToken();
		} else {
			console.error(response.status);
		}
	}

	async function refreshSpotifyAccessToken() {
		const requestBody = `grant_type=refresh_token&refresh_token=${spotifyRefreshToken}&client_id=${spotifyClientId}`;
		callSpotifyApiForToken(requestBody);
	}

	async function updatePlaylists() {
		callSpotifyApi('GET', SPOTIFY_PLAYLISTS_URL);
	}

	async function requestSpotifyAuthorization() {
		localStorage.setItem('spotifyClientId', spotifyClientId);
		localStorage.setItem('spotifyClientSecret', spotifyClientSecret);
		const url = `${SPOTIFY_AUTHORIZE_URL}?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURI(appRedirectUri)}&show_dialog=true&scope=playlist-read-private`;
		window.location.href = url;
	}

	async function updatePlaylistSongs() {
		if (!selectedPlaylistId) return;
		const url = `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${spotifyAccessToken}`
			}
		});
		if (response.ok) {
			const data = await response.json();
			playlistSongs = data.items.map((item) => ({ name: item.track.name }));
		} else {
			console.error('Error fetching songs:', response.status);
		}
	}
</script>

<main>
	<div class="container mt-4">
		{#if displayTokenSection}
			<div class="row mb-3">
				<h2>Listar tus playlists de Spotify usando OAUTH2.0</h2>
				<p>
					Para poder usar esta funcionalidad, tienes que ir a la página de desarrolladores de
					Spotify:
					<a href="https://developer.spotify.com/dashboard/applications" target="_blank"
						>https://developer.spotify.com/dashboard/applications</a
					>. Tienes que crear una APP para obtener el Client Id y Secret y añadir la URL
					<strong>{appRedirectUri}</strong> en el campo "Redirect URIs".
				</p>
			</div>
			<Form class="mb-3">
				<FormGroup class="mb-3">
					<Label for="clientId">Client Id</Label>
					<Input type="textarea" id="clientId" bind:value={spotifyClientId} />
				</FormGroup>
				<FormGroup class="mb-3">
					<Label for="clientSecret">Client Secret</Label>
					<Input type="textarea" id="clientSecret" bind:value={spotifyClientSecret} />
				</FormGroup>
				<FormGroup>
					<Button color="primary" on:click={requestSpotifyAuthorization}>Pedir autorización</Button>
				</FormGroup>
			</Form>
		{/if}
		{#if displayPlaylistsSection}
			<div class="row mb-3">
				<div class="col-md-6">
					<Form class="mb-3">
						<FormGroup>
							<Label for="playlistSelect">Selecciona una de tus Playlists</Label>
							<Input
								type="select"
								id="playlistSelect"
								bind:value={selectedPlaylistId}
								on:change={updatePlaylistSongs}
							>
								<option value="">Selecciona una Playlist</option>
								{#each userPlaylists as playlist}
									<option value={playlist.id}>{playlist.name} ({playlist.tracks} canciones)</option>
								{/each}
							</Input>
						</FormGroup>
					</Form>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6">
					<ul>
						{#each playlistSongs as song}
							<li>{song.name}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	html,
	body {
		font-family: Arial, sans-serif;
		background-color: #f5f5f5;
		color: #333;
		margin: 0;
		padding: 0;
	}

	h2 {
		color: #333;
	}

	a {
		color: #007bff;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.container {
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 20px;
		margin-top: 20px;
	}

	.row {
		margin-bottom: 1rem;
	}

	ul {
		list-style-type: none;
		padding: 5px 0; /* Agregamos un relleno interno al ul */
		margin: 0; /* Eliminamos el margen exterior */
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
	}

	li {
		background: #1a1a1a;
		color: #4caf50;
		margin-bottom: 5px; /* Mantenemos el margen inferior */
		border-radius: 4px;
		width: auto;
		
		padding: 5px; /* Eliminamos el relleno y agregamos un relleno uniforme alrededor del texto */
	}
</style>
