<template>
    <div class="recommend" ref="recommend">
      <Scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <div v-if="recommend.length" class="slider-wrapper" ref="sliderWrapper">
            <!--slider-->
            <slider >
              <div v-for="(item,ind) in recommend" :key="ind">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl" @load="loadImage" alt="" class="needsclick">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)" v-for="item in discList" class="item">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </Scroll>
    </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {getRecommend,getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import slider from  'base/slider/slider'
  import loading from 'base/loading/loading'

  export default {
    name: 'recommend',
    components: {
      slider,
      Scroll,
      loading
    },
    data(){
      return{
        //note:Scroll组件传的data只传discList，一是因为getRecommend比较先请求也先返回数据，
        //二是因为slider区域的高度不仅取决于recommend数据，更是取决于数据里的图片的高度（picUrl 这也是一个异步过程）
        //所以在图片加载完成的时候也将scroll refresh一下
        //使用betterScroll要确保初始化的时候，dom是渲染完成了的，才可以计算到父子dom的高度差，计算出可滚动距离
        recommend: [],
        discList: [],
        checkloaded: false,
      }
    },
    created () {
      this._getRecommend();
      this._getDiscList();

    },
    methods: {
      _getRecommend(){
        getRecommend().then((res) => {
          console.log(res.code,'------------')
          if(res.code === ERR_OK){
            this.recommend = res.data.slider;
          }
        })
      },
      selectItem(){},
      _getDiscList(){
        getDiscList().then(res => {
          console.log(res)
          if(res.code === ERR_OK){
            this.discList = res.data.list;
          }
          console.log('getDisList--',res.data,res.data.list)
        })
      },
      loadImage(){
        if(!this.checkloaded){
          this.$refs.scroll.refresh()
          this.checkloaded = true;
        }
      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
