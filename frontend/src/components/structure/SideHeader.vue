<template>
  <div class="container">
    <header :class="vcentered ? 'flex' : ''">
      <slot name="header"></slot>
      <div v-if="$slots.dropdown" class="dropdown">
        <hr style="margin-top: 1em" />
        <div :class="'dropdown-content ' + (!showDropdown ? 'hidden' : '')">
          <slot class="" name="dropdown"></slot>
        </div>
        <div class="dropdown-toggle" @click="showDropdown = !showDropdown">
          Menu
        </div>
      </div>
    </header>
    <hr />
    <main :class="vcentered ? 'flex' : ''"><slot></slot></main>
  </div>
</template>

<script setup lang="ts">
import { ref, useCssVars } from "vue";

const props = defineProps(["vcentered", "rightFraction"]);
useCssVars(() => ({ "right-fraction": props.rightFraction || "4fr" }));

let showDropdown = ref(false);
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 1px var(--right-fraction);
  gap: 1em;
  height: 100vh;
  grid-template-rows: minmax(0, 1fr);
  padding: 1em;

  @media (max-width: 800px) {
    grid-template-columns: none;
    height: auto;
  }
}

header {
  text-align: center;
}

main {
  text-align: center;
  flex-flow: column;
  justify-content: space-around;
  overflow-y: auto;
  padding: 1em 2em;

  @media (max-width: 800px) {
    height: auto;
    overflow-y: none;
  }
}

.dropdown-content {
  display: block;

  &.hidden {
    @media (max-width: 800px) {
      display: none;
    }
  }
}

.dropdown-toggle {
  background-color: var(--color-background-soft);
  display: none;

  @media (max-width: 800px) {
    display: block;
  }
}
</style>
