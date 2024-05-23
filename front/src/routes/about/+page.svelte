<script>
	// Define el ID del video de YouTube que quieres insertar
	const videoIdRMP = 'tffcv_NmcCM'; // Reemplaza esto con el ID del video de YouTube que quieras insertar
	const videoId = 'dQw4w9WgXcQ';
	const videoIdAFO = 'uZF-GIi78oY';
	const videoIdFSP = 'YojxkhqNzd0';
</script>

<main>
	<h1>Rufino Moreno Pachecho</h1>
	<div class="video-container">
		<iframe
			title="Video integraciones y usos RMP"
			width="560"
			height="315"
			src={`https://www.youtube.com/embed/${videoIdRMP}`}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>

	<h1>Alejandro Fernández Orozco</h1>
	<div class="video-container">
		<iframe
			src={`https://www.youtube.com/embed/${videoIdAFO}`}
			width="560"
			height="315"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			frameborder="0"
		></iframe>

	</div>
	<h1>Francisco Sáez Pérez</h1>
	<div class="video-container">
		<iframe
			title="Video integraciones y usos FSP"
			width="560"
			height="315"
			src={`https://www.youtube.com/embed/${videoIdFSP}`}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>
</main>

<style>
	.video-container {
		position: relative;
		padding-bottom: 56.25%; /* Aspect ratio 16:9 */
		height: 0;
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	main {
		padding: 1em;
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
	}

	h1 {
		font-size: 1.5em;
		margin-bottom: 1em;
	}
</style>
