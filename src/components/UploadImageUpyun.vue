<template>
  <div :class="size">
    <div class="upload-list" v-for="(item, index) in imgList">
      <img :src="imgUrl+item+'!/both/200x200'">
      <div class="upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(item,index)"></Icon>
      </div>
    </div>
    <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :data="upyunSignature"
            multiple
            type="drag"
            action="//v0.api.upyun.com/yliao-static"
            v-if="imgList.length < maxLength"
            style="display:inline-block">
      <div>
        <Icon type="ios-camera"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible" footer-hide>
      <img :src="imgUrl + imgName" v-if="visible" style="width: 100%">
      <div>原图地址：{{imgUrl + imgName}}</div>
    </Modal>
  </div>
</template>

<script>
  import {upyunSignature} from '../utils'
  export default {
    name: "UploadImageUpyun",
    props: {
      size:{
        type:String,
        default:()=>'large'
      },
      imgList: Array,
      maxLength: {
        type: Number,
        default: () => 5
      }
    },
    data () {
      return {
        imgUrl:process.env.VUE_APP_IMG_URL,
        imgName: '',
        visible: false,
        uploadList: [],
        upyunSignature:upyunSignature()
      }
    },
    methods: {
      handleView (url) {
        this.imgName = url
        this.visible = true
      },
      handleRemove (file, index) {
        this.$emit('on-remove', index)
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      handleSuccess (res, file) {
        file.url = res.url
        this.$emit('on-success', file.url)
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        })
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          })
        }
        return check
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList
    }
  }
</script>

<style lang="less" scoped>
  .large {
    .upload-list,.ivu-upload {
      font-size:30px;
      width: 150px;height:150px;line-height: 150px;
    }
  }
  .normal {
    .upload-list,.ivu-upload {
      font-size:25px;
      width: 100px;height:100px;line-height: 100px;
    }
  }
  .small {
    .upload-list,.ivu-upload {
      font-size:20px;
      width: 60px;height:60px;line-height: 60px;
    }
  }
  .upload-list{
    display: inline-block;
    text-align: center;
    border: 2px solid transparent;
    border-radius: 2px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 0 2px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .upload-list img{
    width: 100%;
    height: 100%;
  }
  .upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .upload-list:hover .upload-list-cover{
    display: block;
  }
  .upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
