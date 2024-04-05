<script>
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
</script>

<svelte:head>
	<title> Proyecto realizado por el grupo 20 </title>
</svelte:head>

<Header />

<main>
	<hr />
	<slot />
	<hr />
</main>

<Footer />

<style>
	main {
		padding: 1em;
		font-family: Arial, sans-serif;
		line-height: 1.6;
		color: #333;
	}

	hr {
		border: none;
		border-top: 1px solid #ddd;
		margin: 2em 0;
	}
</style>
