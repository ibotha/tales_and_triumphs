{
  /* <template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="data.me !== null">{{ $router.push("/home") }}</div>
  <SideHeader vcentered="true" right-fraction="1fr" v-else>
    <template v-slot:header>
      <nav style="margin: auto; margin-top: minmax(2em, auto)">
        <h1 style="margin-bottom: 1em">
          Welcome <br />to Tales &amp; Triumphs
        </h1>
        <router-link class="btn" :to="'login'">login</router-link>
        <router-link class="btn" :to="'register'">register</router-link>
      </nav>
    </template>
    <RouterView style="margin: auto" />
  </SideHeader>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { RouterView } from "vue-router";
import SideHeader from "../components/structure/SideHeader.vue";

const { fetching: fetching, data: data } = useQuery({
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

<style scoped lang="scss">
header {
  display: flex;

  text-align: center;
  flex-flow: column;
  justify-content: space-around;
}

main {
  display: flex;
  text-align: center;
  flex-flow: column;
  justify-content: space-around;
}
</style> */
}

import React from "react";
import { Link, Outlet } from "react-router-dom";
import SideHeader from "../components/structure/SideHeader";

type Props = {};

function LandingPage({}: Props) {
  return (
    <SideHeader
      vCentered={true}
      rightFraction="1fr"
      header={
        <nav style={{ margin: "auto", marginTop: "minmax(2em, auto)" }}>
          <h1 style={{ marginBottom: "1em" }}>
            Welcome <br />
            to Tales & Triumphs
          </h1>
          <Link className="btn" to="login">
            login
          </Link>
          <Link className="btn" to="register">
            register
          </Link>
        </nav>
      }
    >
      <Outlet />
    </SideHeader>
  );
}

export default LandingPage;
