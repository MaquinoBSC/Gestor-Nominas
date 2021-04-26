<template>
  <div class="basic-layout">
      <Menu></Menu>
      <div class="ui container">
          <!-- <slot />Renderiza todo lo que se encuentre entre el componente BasicLayout, el lugar donde se importa -->
          <slot />
      </div>
  </div>
</template>

<script>
import Menu from '../components/Menu';

export default {
  components: {
    Menu
  }
}
</script>

<style>

</style>