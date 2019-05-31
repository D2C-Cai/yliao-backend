<template>
  <Select v-model="value" @on-change="onChange" :clearable="clearable" :placeholder="placeholder?placeholder:'请选择'">
    <Option v-for="(option, index) in list" :value="option.id.toString()" :key="index">{{option.name}}</Option>
  </Select>
</template>

<script>
  import $P2PService from './../service/p2p'
  export default {
    name: "PlatformSelect",
    data(){
      return {
        isLoading:false,
        value:[],
        list:[]
      }
    },
    model:{
      prop:'p2pId',
      event:'change'
    },
    props:['p2pId','clearable','placeholder'],
    watch: {
      p2pId(newValue) {
        this.value=newValue
      }
    },
    mounted(){
      $P2PService.select({ps:1000}).then(res=>{
        if (res.code===1){
          this.list=res.data.records
          if (this.p2pId){
            let record=res.data.records.find(item=>item.id.toString()===this.p2pId)
            if (record){
              this.value=record.id.toString()
            }
          }
        }
      })
    },
    methods:{
      onChange(value){
        this.$emit('change', value)
      },
      searchP2P(){

      }
    }
  }
</script>

<style scoped>

</style>
