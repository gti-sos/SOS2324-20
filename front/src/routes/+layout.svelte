<script>
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
</script>
<Header/>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<hr>
<slot></slot>
<hr>
<Footer/>

