<template>
  <Select v-model="value" @on-change="onChange" :clearable="clearable" :placeholder="placeholder?placeholder:'请选择'">
    <Option v-for="(option, index) in list" :value="option.id.toString()" :key="index">{{option.name}}</Option>
  </Select>
</template>

<script>
  import $SupplierService from './../service/supplier'
  export default {
    name: "SupplierSelect",
    data(){
      return {
        isLoading:false,
        value:[],
        list:[]
      }
    },
    model:{
      prop:'supplierId',
      event:'change'
    },
    props:['supplierId','clearable','placeholder'],
    watch: {
      supplierId(newValue) {
        this.value=newValue
      }
    },
    mounted(){
      $SupplierService.select({ps:1000}).then(res=>{
        if (res.code===1){
          this.list=res.data.records
          if (this.supplierId){
            let record=res.data.records.find(item=>item.id.toString()===this.supplierId)
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
      searchSupplier(){

      }
    }
  }
</script>

<style scoped>

</style>
