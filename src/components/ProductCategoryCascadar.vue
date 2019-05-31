<template>
    <Cascader :data="categoryList" v-model="value" @on-change="onChange" :clearable="clearable"></Cascader>
</template>

<script>
  import $ProductCategoryService from './../service/productCategory'
  export default {
    name: "ProductCategoryCascadar",
    data(){
      return {
        value:[],
        categoryList:this.LocalStorage.getItem('CATEGORY_LIST') || [],
        cleanCategory:this.LocalStorage.getItem('CLEAN_CATEGORY') || []
      }
    },
    model:{
      prop:'categoryId',
      event:'change'
    },
    props:['categoryId','clearable'],
    watch: {
      categoryId() {
        setTimeout(()=>{
          this.findCategoryPath()
        },50)
      }
    },
    created(){
        if (this.categoryList.length==0||this.cleanCategory.length==0){
            $ProductCategoryService.select({ps:1000}).then(res=>{
                if (res.code===1){
                    var cleanCategory=[],categoryList=[],secondCategory=[]
                    res.data.records.forEach(item=>{
                        cleanCategory.push({
                            id:item.id,
                            value:item.id.toString(),
                            level:item.level,
                            name:item.name,
                            label:item.name,
                            parentId:item.parentId,
                            sort:item.sort
                        })
                    })
                    cleanCategory.sort((a,b)=>b.sort-a.sort)
                    this.cleanCategory=cleanCategory
                    categoryList=cleanCategory.filter(item=>item.level===1)
                    categoryList.forEach(item=>{
                        item.children=[]
                    })
                    secondCategory=cleanCategory.filter(item=>item.level===2)
                    categoryList.map(item=>{
                        var i=secondCategory.filter(element=>(element.parentId.toString()===item.id.toString()))
                        if (i.length>0) {
                            item.children=i
                        }else{
                            delete item.children
                        }
                    })

                    this.categoryList=categoryList
                    this.LocalStorage.setItem('CATEGORY_LIST',categoryList)
                    this.LocalStorage.setItem('CLEAN_CATEGORY',cleanCategory)
                    this.findCategoryPath()
                }
            })
        }else{
            this.findCategoryPath()
        }

    },
    methods:{
      findCategoryPath(){
        if (this.categoryId) {
          var currentCategory = this.cleanCategory.find(item => item.id.toString() === this.categoryId)
          this.value.push(currentCategory.value)
          if (currentCategory.parentId) {
            var parentCategory = this.cleanCategory.find(item => item.id.toString() === currentCategory.parentId.toString())
            this.value.unshift(parentCategory.value)
          }
        }else{
          this.value=[]
        }

      },
      onChange(value){
        this.$emit('change', value[value.length-1])
      }
    }

  }
</script>

<style scoped>

</style>
