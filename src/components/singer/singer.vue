<template>
    <div class="singer" ref="singer">
      <list-view :data="singers"></list-view>
    </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import listView from 'base/listview/listview'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    name: 'singer',
    components:{
      listView
    },
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
            this.singers = this._normalizeSinger(res.data.list)
          }catch(err){
            console.log(err)
          }
        })

      },
      _normalizeSinger(list){
        let map = {
          hot: {
            title: HOT_NAME,
            items: [],
          }
        };
        list.forEach((item,index) => {
          if(index < HOT_SINGER_LEN){
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex;
          if(!map[key]){
            map[key] = {
              title: key,
              items: [],
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        console.log('map--',map)

        let hot =[],
            ret = [],
            numArr = [];
        for(let key in map){
          let val = map[key]
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }else if(val.title === HOT_NAME){
            hot.push(val)
          }else if(val.title.match(/[0-9]/)){
            numArr.push(val)
          }
        }
        console.log('before sort--',ret,numArr)
        ret.sort((a,b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        numArr.sort((a,b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        console.log(hot.concat(ret).concat(numArr))
        return hot.concat(ret).concat(numArr)
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
