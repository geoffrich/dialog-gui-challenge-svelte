<script>
	import Dialog from './lib/Dialog.svelte';
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import { easeElastic3 } from './lib/easing';

	/** @type {Dialog} */
	let megaDialog;
	/** @type {Dialog} */
	let miniDialog;
	let id = 1;
	let toRemove;
	let fileInput;

	function openMegaDialog() {
		megaDialog.open();
	}

	function promptRemove(e, id) {
		const removeButton = e.target;
		miniDialog.open(removeButton);
		toRemove = id;
	}

	function removeUser({ detail }) {
		if (detail.returnValue === 'confirm') {
			const index = users.findIndex((u) => u.id === toRemove);
			users.splice(index, 1);
			users = users;
		}
	}

	function handleFile({ detail }) {
		let files = fileInput.files;
		if (detail.returnValue === 'confirm' && files.length > 0 && files[0].size) {
			const reader = new FileReader();
			reader.addEventListener(
				'load',
				(e) => {
					addUser(e.target.result);
				},
				false
			);
			reader.readAsDataURL(files[0]);
			fileInput.form.reset();
		}
	}

	function addUser(src) {
		users.push({ src, id: id++ });
		users = users;
	}

	let users = [
		{
			src: 'https://doodleipsum.com/700x700/avatar-5?i=e49dd48962488beade4c44491e56a5a9',
			id: id++
		},
		{
			src: 'https://doodleipsum.com/700x700/avatar-5?i=ca71b901f3ad2ce77d50ab296aff3f5f',
			id: id++
		},
		{
			src: 'https://doodleipsum.com/700x700/avatar-5?i=c7c8fdafb02f85e5960dda582db1af88',
			id: id++
		},
		{ src: 'https://doodleipsum.com/700x700/avatar-5?i=7df0ae04112bf5365a7086f0b418a4a4', id: id++ }
	];
</script>

<Dialog mode="mega" bind:this={megaDialog} on:closed={handleFile}>
	<section class="icon-headline" slot="header">
		<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
			<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="8.5" cy="7" r="4" />
			<line x1="20" y1="8" x2="20" y2="14" />
			<line x1="23" y1="11" x2="17" y2="11" />
		</svg>
		<h3>New User</h3>
	</section>
	<svelte:fragment slot="content">
		<section class="labelled-input">
			<label for="userimage">Upload an image</label>
			<input id="userimage" name="userimage" type="file" bind:this={fileInput} />
		</section>
		<small><b>*</b> Maximum upload 1mb</small>
	</svelte:fragment>
	<menu slot="menu">
		<button type="reset" value="clear">Clear</button>
	</menu>
</Dialog>

<Dialog mode="mini" bind:this={miniDialog} on:closing={removeUser}>
	<svelte:fragment slot="content">
		<section class="warning-message">
			<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
				<title>A warning icon</title>
				<path
					d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
				/>
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>
			<p>Are you sure you want to remove this user?</p>
		</section>
	</svelte:fragment>
</Dialog>

<main>
	<!-- Add an empty user to the end that will act as a button
			This way we can apply FLIP to the button as well -->
	{#each [...users, { id: -1, src: null }] as user (user.id)}
		<div animate:flip={{ duration: 400 }}>
			{#if user.src}
				<div class="user" in:fly={{ y: -120, easing: easeElastic3 }} out:scale={{ start: 0.75 }}>
					<img src={user.src} alt="" />
					<button title="Remove user" on:click={(e) => promptRemove(e, user.id)}>
						<svg width="24" height="24" viewBox="0 0 24 24">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
			{:else}
				<button class="user" on:click={openMegaDialog}>
					<svg width="24" height="24" viewBox="0 0 24 24">
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
				</button>
			{/if}
		</div>
	{/each}
</main>

<style>
	:global(body) {
		display: grid;
		place-content: center;
		padding-inline: var(--size-5);
	}

	main {
		display: flex;
		flex-wrap: wrap;
		place-content: center;
		gap: var(--size-5);
	}

	.user {
		inline-size: var(--size-fluid-7);
		aspect-ratio: var(--ratio-square);
		border-radius: var(--radius-round);
		border: var(--border-size-1) solid var(--surface-4);
		display: flex;
		align-items: stretch;
		justify-content: stretch;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	button.user > svg {
		--_icon-size: var(--size-fluid-4);
	}

	.user > button {
		position: absolute;
		inset-block-start: 0;
		inset-inline-end: 0;
		border-radius: var(--radius-round);
		padding: 0.75ch;
		aspect-ratio: 1;
		flex-shrink: 0;
	}

	.user img {
		border-radius: inherit;
	}

	.labelled-input {
		display: flex;
		gap: var(--size-3);
		flex-wrap: wrap;
		align-items: center;
	}

	.warning-message {
		display: grid;
		grid-template-columns: var(--size-fluid-3) 1fr;
		gap: var(--size-3);
		align-items: center;
	}

	.warning-message > svg {
		inline-size: 100%;
		stroke: var(--text-2);
	}

	.icon-headline {
		display: flex;
		gap: var(--size-3);
		align-items: center;
	}

	.icon-headline > svg {
		inline-size: 2em;
		stroke: var(--text-2);
	}

	@media (max-width: 768px) {
		input[type='file'] {
			inline-size: 100%;
		}
	}
</style>
