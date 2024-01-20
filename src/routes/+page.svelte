<script>
	import { base } from '$app/paths';
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	const measurementTypes = [
		['kg', 'kg'],
		['lbs', 'lbs/ozs']
	];
	const sexes = ['female', 'male'];

	$: measure = form?.weightType ?? 'lbs';
	$: sex = data.sex ?? form?.sex;
</script>

<svelte:head>
	<title>tbremer.com — Infant Weight Percentage Calculator</title>
</svelte:head>

<main class="p-4">
	<h1 class="text-xl font-bold text-stone-900">Infant Weight Percentile Calculator</h1>

	{#if form}
		<p>
			Your baby {form.sex === 'female' ? 'girl' : 'boy'} is {form.monthsOld} month{form.monthsOld ===
			1
				? ''
				: 's'} old, with a weight of {form.weightType === 'kg'
				? `${form.kg}kg`
				: `${form.lb}lb, ${form.oz}oz`} your baby is in the {form.percent} percentile.
		</p>
	{/if}

	<form
		action={base}
		class="p-4"
		method="post"
		use:enhance={() => {
			return ({ update }) => update({ reset: false });
		}}
	>
		<div
			class="grid grid-cols-3 divide-x-2 divide-stone-300 bg-stone-100 border border-stone-300 rounded *:py-2 *:px-4"
		>
			<section>
				<h2 class="font-medium text-base mb-2 text-pretty">Sex assigned at birth</h2>
				<!-- <fieldset> -->
				<!-- <legend class="p-2 ml-2 text-sm font-medium">Assigned Sex at Birth</legend> -->
				<div class="flex flex-col gap-1 text-sm">
					{#each sexes as s}
						<label>
							<input type="radio" name="sex" value={s} bind:group={sex} />
							<span class="capitalize">
								{s}
							</span>
						</label>
					{/each}
				</div>
				<!-- </fieldset> -->
			</section>

			<section>
				<h2 class="font-medium text-base mb-2">Dates</h2>
				<div class="space-y-4">
					<div>
						<p class="text-sm mb-1">Birth</p>
						<div
							class="rounded-md shadow-sm ring-1 ring-inset ring-stone-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:max-w-md bg-stone-50"
						>
							<input
								class="block w-full border-0 bg-transparent py-1.5 pl-1 text-stone-900 placeholder:text-stone-400 focus:ring-0 sm:text-sm sm:leading-6 outline-0"
								type="date"
								name="date-birth"
								value={data.dob}
							/>
						</div>
					</div>
					<div>
						<p class="text-sm mb-1">Weight Check</p>
						<div
							class="rounded-md shadow-sm ring-1 ring-inset ring-stone-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 sm:max-w-md bg-stone-50"
						>
							<input
								class="block w-full border-0 bg-transparent py-1.5 pl-1 text-stone-900 placeholder:text-stone-400 focus:ring-0 sm:text-sm sm:leading-6 outline-0"
								type="date"
								name="date-weight"
								value={data.today}
							/>
						</div>
					</div>
				</div>
			</section>

			<section>
				<fieldset class=" flex flex-col">
					<legend class="p-2 ml-2 text-sm font-medium">Weight</legend>
					<div>
						{#if measure === 'lbs'}
							<input type="number" name="lbs" step="0.001" value={form?.lb} /> lbs
							<input type="number" name="oz" step="0.1" max="15.9" min="0" value={form?.oz} /> oz
						{:else}
							<input type="number" name="weight" step="0.001" value={form?.kg} /> kg
						{/if}
					</div>
					<div class="flex gap-4">
						{#each measurementTypes as [format, label]}
							<label class:font-medium={measure === format}>
								<input type="radio" name="measurement" value={format} bind:group={measure} />
								{label}
							</label>
						{/each}
					</div>
				</fieldset>
			</section>
		</div>

		<button class="mt-4">Calculate</button>
	</form>

	<hr
		class="my-8 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-25 dark:opacity-100"
	/>

	<section class="text-sm text-stone-600 space-y-2">
		<h3 class="text-base text-stone-900">About the application:</h3>
		<p>
			The data for the calculations were taken from the <a
				href="https://www.who.int/tools/child-growth-standards/standards/weight-for-age#PageContent_C005_Col00"
				target="_blank">WHO Infant Weight Z-Score datasets</a
			>. Calculations are derived from the explanation of the
			<a
				href="https://www.cdc.gov/growthcharts/percentile_data_files.htm#:~:text=The%20LMS%20parameters%20are%20the,%2FL)%2C%20L%20%E2%89%A0%200"
				target="_blank">CDC percentile data files</a
			>. Z-Scores were chosen as the preferred method of measurement because they are more accurate
			at the extremes (&gt;97&percnt; or &lt;3&percnt;) of the growth curve.
		</p>
		<p>
			Formula for the Z-Score calculation is as follows:
			<span class="bg-stone-100 border border-stone-200 rounded-md py-1 px-2 font-mono text-xs">
				Z-Score = ((Weight/M)L - 1) / (L * S)
			</span>
		</p>
		<p>The Z-Scores are subsequently converted to percentages using a standard deviation table.</p>
	</section>

	{#if data.debug}
		<hr />
		<section class=" font-mono">
			<strong>data:</strong>
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<hr />
			<strong>form:</strong>
			<pre>{JSON.stringify(form, null, 2)}</pre>
		</section>
	{/if}
</main>
