<template>
  <Select v-model="value" @on-change="onChange" :clearable="clearable">
    <Option v-for="(option, index) in list" :value="option.id.toString()" :key="index">{{option.name}}</Option>
  </Select>
</template>

<script>
  import $BrandService from './../service/brand'
  export default {
    name: "BrandSelect",
    data(){
      return {
        isLoading:false,
        value:[],
        list:[]
      }
    },
    model:{
      prop:'brandId',
      event:'change'
    },
    props:['brandId','clearable'],
    watch: {
      brandId(newValue) {
        this.value=newValue
      }
    },
    mounted(){
      $BrandService.select({ps:1000}).then(res=>{
        if (res.code===1){
          this.list=res.data.records
          if (this.brandId){
            let record=res.data.records.find(item=>item.id.toString()===this.brandId)
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
      searchBrand(){

      }
    }
  }
</script>

<style scoped>

</style>
