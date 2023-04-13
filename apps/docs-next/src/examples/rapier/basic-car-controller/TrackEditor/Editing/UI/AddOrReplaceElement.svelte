<script lang="ts">
  import {
    TrackElementCategory,
    TrackElementPrototypeType,
    trackElementPrototypes
  } from '../../../TrackElements/elements'
  import Button from '../../../UI/components/Button.svelte'
  import { useTrackEditor } from '../context'

  const { trackData, currentlySelectedElement } = useTrackEditor()
  const validated = trackData.validated

  type Category = {
    name: TrackElementCategory
    previewImage: string
    elements: TrackElementPrototypeType[]
  }

  let selectedCategory: Category | undefined = undefined

  const categories: Category[] = []

  Object.entries(trackElementPrototypes).forEach(([key, value]) => {
    const category = categories.find((category) => category.name === value.category)

    if (category) {
      category.elements.push(key)
    } else {
      categories.push({
        name: value.category,
        previewImage: `/assets/basic-vehicle-controller/TrackElements/images/${key}.png`,
        elements: [key]
      })
    }
  })
</script>

<div class="flex flex-row items-start gap-[2px]">
  {#each categories as category, index}
    <div class="flex flex-col gap-[2px]">
      <Button
        on:click={() => {
          if (selectedCategory === category) {
            selectedCategory = undefined
          } else {
            selectedCategory = category
          }
        }}
        forceFocusOnMount={index === 0 && !$validated}
        class="!px-0"
        disabled={$validated}
      >
        <img
          src={category.previewImage}
          alt={category.name}
          class="!h-[60px] !w-[60px]"
        />
      </Button>

      {#if selectedCategory === category}
        {#each category.elements as element, index}
          <Button
            class="!px-0"
            disabled={$validated}
            forceFocusOnMount={index === 0 && !$validated}
            on:click={() => {
              if ($currentlySelectedElement) {
                trackData.setTrackElementType($currentlySelectedElement.id, element)
              } else {
                const newTrackElement = trackData.addTrackElement(element)
                currentlySelectedElement.set(newTrackElement)
              }
            }}
          >
            <img
              src="/assets/basic-vehicle-controller/TrackElements/images/{element}.png"
              alt={element}
              class="!h-[60px] !w-[60px]"
            />
          </Button>
        {/each}
      {/if}
    </div>
  {/each}
</div>
