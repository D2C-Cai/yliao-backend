<template>
  <Select v-model="value" filterable  remote :remote-method="searchMember" :loading="isLoading" @on-change="onChange" :clearable="clearable" :placeholder="!memberId?'请输入手机号查找':memberId">
    <Option v-for="(option, index) in list" :value="option.id.toString()" :key="index">{{option.name+' '+option.account}}</Option>
  </Select>
</template>

<script>
  import $MemberService from './../service/member'
  import _ from 'lodash'

  export default {
    name: "MemberSelect",
    data(){
      return {
        isLoading:false,
        value:[],
        list:[]
      }
    },
    model:{
      prop:'memberId',
      event:'change'
    },
    props:['memberId','clearable'],
    watch: {
      memberId(newValue) {
        this.value=newValue
      }
    },
    created(){

    },
    methods:{
      searchMember:_.debounce(function(query){
        if (query!=''){
          this.isLoading=true
          $MemberService.select({p:1,size:20,account:query}).then(res=>{
            this.isLoading=false
            if (res.code===1){
              this.list=res.data.records.map(item=>{
                return {
                  name:item.nickname,
                  account:item.account,
                  id:item.id
                }
              })
              console.log(this.list)
            }
          })
        }
      },600),
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
