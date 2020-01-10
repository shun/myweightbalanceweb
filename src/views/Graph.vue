<template>
  <div class="graph">
    <GraphComp/>
  </div>
</template>

<script>
// @ is an alias to /src
import GraphComp from '@/components/GraphComp.vue'

export default {
  name: 'graphcomp',
  components: {
    GraphComp
  }
}
</script>
