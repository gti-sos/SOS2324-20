<nav class="header">
	<a href="/">Home</a>
	<a href="/food-production">food-production</a>
	<a href="/life-expectancy">life-expectancy</a>
	<a href="/pharmaceutical-drugs-spending">pharmaceutical-drugs-spending</a>
	<a href="/integrations">Integraciones y usos</a>
	<a href="/about">About</a>
</nav>

<style>
	.header {
		background-color: #f8f9fa;
		padding: 1em 0;
		box-shadow: 0 0.2em 0.4em 0 rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	a {
		color: green;
		margin-right: 1em; /* Add a margin to the right of each link */
		text-decoration: none;
		font-size: 1.125em;
	}

	a:hover {
		color: darkgreen;
	}

	@media (max-width: 37.5em) {
		/* 600px/16px */
		.header {
			flex-direction: column;
		}

		a {
			margin-bottom: 1em;
		}
	}
</style>
