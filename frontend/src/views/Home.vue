<script setup lang="ts">
import { gql, useQuery } from "@urql/vue";
import LogoutButton from "../components/Auth/LogoutButton.vue";

const { fetching, data, error } = useQuery({
  query: gql`
    {
      me {
        id
        username
      }
    }
  `,
});
</script>

<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else-if="data.me === null">{{ $router.push("/landing") }}</div>
  <div v-else class="container">
    <header>
      <div>
        <h1 style="margin-top: 1em">Welcome {{ data.me?.username }}</h1>

        <LogoutButton />
      </div>
    </header>
    <hr />
    <main>
      <div class="page">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est expedita,
          dolorem doloremque assumenda neque eligendi. Odit aperiam distinctio
          porro rerum cumque corporis veniam amet ratione consectetur! Alias
          minima deserunt eveniet.
        </p>
      </div>
      <div class="page">
        <p>
          Earum placeat hic excepturi vero, labore asperiores assumenda, sunt
          culpa temporibus nobis iure deserunt a ipsa laudantium, dignissimos
          adipisci illum id harum pariatur repudiandae neque sequi consequatur?
          Non, totam odit?
        </p>
      </div>
      <div class="page">
        <p>
          Molestias facilis non officiis repellendus excepturi saepe, sint
          corrupti beatae pariatur natus voluptatum aut nesciunt laboriosam
          harum. Veniam, numquam animi! Cum labore quasi distinctio ducimus qui
          perspiciatis esse, sint repellat?
        </p>
      </div>
      <div class="page">
        <p>
          Eligendi culpa magnam fugiat? Beatae veniam eius reprehenderit
          repudiandae error, quasi culpa itaque velit expedita! Alias culpa
          autem quae impedit, ducimus cupiditate voluptates libero, aliquid at
          quasi consequatur nostrum esse.
        </p>
      </div>
      <div class="page">
        <p>
          Optio dolore numquam consequatur atque eos hic. Distinctio possimus
          fugiat sit quae nesciunt veritatis assumenda rem reprehenderit enim
          non? Voluptatum nesciunt consequatur molestias aliquid, voluptatibus
          vitae sint minima iure tempore.
        </p>
      </div>
      <div class="page">
        <p>
          Optio dolore numquam consequatur atque eos hic. Distinctio possimus
          fugiat sit quae nesciunt veritatis assumenda rem reprehenderit enim
          non? Voluptatum nesciunt consequatur molestias aliquid, voluptatibus
          vitae sint minima iure tempore.
        </p>
      </div>
      <div class="page">
        <p>
          Optio dolore numquam consequatur atque eos hic. Distinctio possimus
          fugiat sit quae nesciunt veritatis assumenda rem reprehenderit enim
          non? Voluptatum nesciunt consequatur molestias aliquid, voluptatibus
          vitae sint minima iure tempore.
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: grid;

  grid-template-columns: 1fr 1px 2fr;
  gap: 2em;
  @media (max-width: 800px) {
    grid-template-columns: none;
  }
}

header {
  display: flex;

  text-align: center;
  flex-flow: column;
  justify-content: space-around;
}

main {
  text-align: center;
  flex-flow: column;
  justify-content: space-around;
  height: 100vh;
  overflow-y: auto;
  padding: 1em 2em;

  @media (max-width: 800px) {
    height: auto;
    overflow-y: none;
  }
}
</style>
