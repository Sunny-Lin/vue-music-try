<template>
    <div class="singer" ref="singer"></div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import axios from 'axios'

  export default {
    name: 'singer',
    data(){
      return{
        singers: [],
      }
    },
    created () {
      console.log('singer page')
      this._getSingerList()
    },
    methods:{

      _getSingerList(){
        // debugger
        getSingerList().then((res) => {
          console.log(res)
          try{
            console.log('111111')
            if(res.code === ERR_OK){
              this.singers = res.data.list
            }
            console.log('111',res.data.list)

          }catch(err){
            console.log(err)
          }
        })

        // this.$axios.get({        //19.9.1
        //   channel: 'singer',
        //   page: 'list',
        //   key: 'all_all_all',
        //   pagesize: 100,
        //   pagenum: 1,
        //   hostUin: 0,
        //   needNewCode: 0,
        //   platform: 'yqq',
        //   g_tk: 1664029744,
        //   inCharset: 'utf-8',
        //   outCharset: 'utf-8',
        //   notice: 0,
        //   format: 'jsonp'
        // }).then((res) => {
        //   console.log(res)
        //   try{
        //     console.log('111111')
        //     if(res.code === ERR_OK){
        //       console.log('111',res.data.list)
        //       this.singers = res.data.list
        //     }
        //   }catch(err){
        //     console.log(err)
        //   }
        // })

      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
