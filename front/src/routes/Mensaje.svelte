<script>
	export let tipo;
	export let mensaje;
</script>

<div class={tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error'}>
	{mensaje}
</div>

<style>
	.mensaje-exito,
	.mensaje-error {
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
		color: #fff;
		font-weight: bold;
	}

	.mensaje-exito {
		background-color: #5cb85c; /* Verde */
	}

	.mensaje-error {
		background-color: #d9534f; /* Rojo */
	}
</style>
