<script setup lang="ts">

  import { ElAmap } from '@vuemap/vue-amap'
  import { ref } from 'vue'

  const zoom = ref(4)
  const center = ref([121.599_96, 31.197_646])
  const show = ref(false)

  let map = null

  const markers = ref([
    {
      position: [116.965_890_6, 39.124_567_5],
      label: '出发地',
    }, {
      position: [80.402_959_8, 44.250_344],
      label: '目的地',
    },
  ])
  const init = (e: any) => {
    map = e
  }
  const layerStyle = ref({
    unit: 'meter',
    dash: [40_000, 0, 40_000, 0],
    lineWidth () {
      return [20_000, 1000]
    },
    height (index: number, feat: any) {
      return feat.distance / 3 + 10
    },
    // altitude: 1000,
    smoothSteps: 30,
    speed (index: number, prop: any) {
      return 1000 + Math.random() * 200_000
    },
    flowLength: 100_000,
    lineColors (index: number, feat: any) {
      return ['rgb(255,228,105)', 'rgb(255,164,105)', 'rgba(1, 34, 249,1)']
    },
    maxHeightScale: 0.3, // 弧顶位置比例
    headColor: 'rgba(255, 255, 0, 1)',
    trailColor: 'rgba(255, 255,0,0)',
  })

  const visible = ref(true)
  const sourceData = ref({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          type: 0,
          ratio: 0.0369,
          lineWidthRatio: 1,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [116.965_890_6, 39.124_567_5],
            [80.402_959_8, 44.250_344],
          ],
        },
      },
    ],
  })
  const initLoca = (loca: any) => {
    loca.animate.start()
  }
</script>

<template>
  <v-responsive height="400px">
    <v-skeleton-loader v-show="!show" type="image" />
    <el-amap
      v-show="show"
      :center="center"
      :zoom="zoom"
      @complete="show = true"
      @init="init"
    >
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :label="marker.label"
        :position="marker.position"
      />
      <el-amap-loca @init="initLoca">
        <el-amap-loca-pulse-link
          :layer-style="layerStyle"
          :source-data="sourceData"
          :visible="visible"
          :visible-duration="500"
        />
      </el-amap-loca>
    </el-amap>
  </v-responsive>
</template>

<style scoped>

</style>
