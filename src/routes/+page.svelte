<script>
    import {base} from '$app/paths';

    export let data;
    export let form;

    let measure = form?.weightType ?? 'lbs';
    let sex = data.sex;
</script>

{#if form}
<p>
    Your baby {form.sex ==='female' ? 'girl' : 'boy'} is {form.daysOld} days old, with a weight of {form.weightType === 'kg' ? `${form.kg}kg` : `${form.lb}lb, ${form.oz}oz`} your baby is in the {form.percent} percentile.
</p>
{/if}

<form action="{base}" method="post">
    <fieldset>
        <legend>
            date of birth
        </legend>
        <input type="date" name="date-birth" value={data.dob} />
    </fieldset>
    <br />

    <fieldset>
        <legend>
            date of weight check
        </legend>
        <input type="date" name="date-weight" value={data.today} />
    </fieldset>
    <br />

    <fieldset>
        <legend>Weight</legend>
        {#if measure === 'lbs'}
            <input type="number" name="lbs" step="0.001" value={form?.lb} /> lbs <input type="number" name="oz" step="0.1" value={form?.oz}/> oz
        {:else}
            <input type="number" name="weight" step="0.001" value={form?.kg} />
        {/if}
        {#each ['kg', 'lbs'] as format}
            <label>
                <input type="radio" name="measurement" value={format} bind:group={measure} />
                {#if format === 'lbs'}
                    lbs / ozs
                {:else}
                    kg
                {/if}
            </label>
        {/each}
    </fieldset>
    <br />

    <fieldset>
        <legend>Assigned Sex at Birth</legend>
        {#each ['female', 'male'] as s}
            <label>
                <input type="radio" name="sex" value={s} bind:group={sex} />
                {s}
            </label>
        {/each}
    </fieldset>
    <br />
    <button>Calculate</button>
</form>
