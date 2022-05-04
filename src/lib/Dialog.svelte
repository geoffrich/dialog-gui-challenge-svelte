<script>
	import { onMount, createEventDispatcher, tick } from 'svelte';
	
	export let mode = 'mega';
	export let topOffset = -1;
	export let leftOffset = -1;
	
	const dispatch = createEventDispatcher();
	
	let dialog, cancelButton;
	let loading = true;
	let isOpen = false;

	let clientHeight, clientWidth, innerWidth;
	
	onMount(() => { loading = false; });
	
	const animationsComplete = element =>
		Promise.allSettled(
			element.getAnimations().map(animation => 
				animation.finished));
	
	function close() {
		dialog.close('close');
	}
	
	async function closeDialog() {
		isOpen = false;
		let { returnValue } = dialog;
		dispatch('closing', { returnValue });
		await animationsComplete(dialog);
		dispatch('closed', { returnValue });
	}

	function lightDismiss({target}) {
		if (target.nodeName === 'DIALOG') {
			dialog.close('dismiss');
		}
	}
	
	export function open() {
		dialog.showModal();
		isOpen = true;
		tick().then(() => cancelButton.focus());
	}

	$: offsetModal = topOffset >= 0 && leftOffset >= 0;
</script>

<svelte:window bind:innerWidth></svelte:window>
<dialog 
	inert={isOpen ? undefined : ''} 
	loading={loading ? '' : undefined} 
	modal-mode={mode} 
	bind:this={dialog}
	style:margin-top={offsetModal ? `${topOffset - clientHeight - 15}px` : null}
	style:margin-left={offsetModal && innerWidth >= 768 ? `${leftOffset - clientWidth / 2}px` : null}
	on:close={closeDialog}
	on:click={lightDismiss}
	bind:clientHeight
	bind:clientWidth
	> 
	<form method="dialog">
		{#if mode === 'mega'}
		<header> 
			<slot name="header"></slot>
			<button on:click={close} type="button" title="Close dialog"> 
				<title>Close dialog icon</title>
				<svg width="24" height="24" viewBox="0 0 24 24">
					<line x1="18" y1="6" x2="6" y2="18"/>
					<line x1="6" y1="6" x2="18" y2="18"/>
				</svg>
			</button>
		</header>
		{/if}
		<article>
			<slot name="content"></slot>
		</article>
		<footer>
			<slot name="menu"></slot>
			<menu>
				<button bind:this={cancelButton} type="button" on:click={close}>Cancel</button>
				<button type="submit" value="confirm">Confirm</button>
			</menu>
		</footer>
	</form>
</dialog>

<style>
	:global(html):has(dialog[open][modal-mode="mega"]) {
		overflow: hidden;
	}

	dialog {
		display: grid;
		background: var(--surface-2);
		color: var(--text-1);
		max-inline-size: min(90vw, var(--size-content-3));
		max-block-size: min(80vh, 100%);
		max-block-size: min(80dvb, 100%);
		margin: auto;
		padding: 0;
		position: fixed;
		inset: 0;
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-6);
		z-index: var(--layer-important);
		overflow: hidden;
		transition: opacity .5s var(--ease-3);
	}
	
	@media (prefers-reduced-motion: no-preference) {
		dialog {
			animation: var(--animation-scale-down) forwards;
			animation-timing-function: var(--ease-squish-3);
		}
	}
	
	@media (prefers-color-scheme: dark) {
		dialog {
			border-block-start: var(--border-size-1) solid var(--surface-3);
		}
	}
	
	@media (max-width: 768px) {
		dialog[modal-mode="mega"] {
				margin-block-end: 0;
				border-end-end-radius: 0;
				border-end-start-radius: 0;
		}
	}
	
	@media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
		dialog[modal-mode="mega"] {
			animation: var(--animation-slide-out-down) forwards;
			animation-timing-function: var(--ease-squish-2);
		}
	}
	
	@media (prefers-reduced-motion: no-preference) {
		dialog[open] {
			animation: var(--animation-slide-in-up) forwards;
		}
	}

	dialog:not([open]) {
		pointer-events: none;
		opacity: 0;
	}

	dialog[modal-mode="mega"]::backdrop {
		backdrop-filter: blur(25px);
	}

	dialog[modal-mode="mini"]::backdrop {
		backdrop-filter: none;
	}

	dialog::backdrop {
		transition: backdrop-filter .5s ease;
	}

	dialog[loading] {
		visibility: hidden;
	}
	
	form {
		display: grid;
		grid-template-rows: auto 1fr auto;
		align-items: start;
		max-block-size: 80vh;
		max-block-size: 80dvb;
	}
	
	article {
		overflow-y: auto; 
		max-block-size: 100%; /* safari */
		overscroll-behavior-y: contain;
		display: grid;
		justify-items: flex-start;
		gap: var(--size-3);
		box-shadow: var(--shadow-2);
		z-index: var(--layer-1);
		padding-inline: var(--size-5);
		padding-block: var(--size-3);
	}
	
	@media (prefers-color-scheme: light) {
		article {
			background: var(--surface-1);
		}
		
		article::-webkit-scrollbar {
			background: var(--surface-1);
		}
	}
	
	@media (prefers-color-scheme: dark) {
		article {
			border-block-start: var(--border-size-1) solid var(--surface-3);
		}
	}
	
	header {
		display: flex;
		gap: var(--size-3);
		justify-content: space-between;
		align-items: flex-start;
		padding-block: var(--size-3);
		padding-inline: var(--size-5);
	}
	
	header > button {
		border-radius: var(--radius-round);
		padding: .75ch;
		aspect-ratio: 1;
		flex-shrink: 0;
		place-items: center;
		stroke: currentColor;
		stroke-width: 3px;
	}
	
	footer {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-3);
		justify-content: space-between;
		align-items: flex-start;
		padding-inline: var(--size-5);
		padding-block: var(--size-3);
	}
	
	menu {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-3);
		padding-inline-start: 0;
	}
	
	menu:only-child {
		margin-inline-start: auto;
	}
	

	
	:is(header, footer) {
		background-color: var(--surface-2);
	}
	
	@media (prefers-color-scheme: dark) {
		:is(header, footer) {
			background-color: var(--surface-1);
		}
	}
</style>
