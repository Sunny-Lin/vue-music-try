<template>
    <Scroll ref="listview"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            :data="data"
            @scroll="scroll"
            class="listview"
    >
      <ul>
        <li v-for="group in data" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li v-for="item in group.items" @click="selItem(item)" class="list-group-item">
              <img v-lazy="item.avatar" class="avatar">
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
<!--      shortList快速入口-->
<!--      stop.prevent阻止冒泡：阻止外层scroll也滚动-->
      <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
          <li v-for="(item,index) in shortcutList" :data-index="index" class="item">{{item}}</li>
        </ul>
      </div>
    </Scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { getData } from 'common/js/dom'

  const ANCHOR_HEIGHT = 18

  export default {
        name: "listview",
        components: {
          Scroll
        },
        props: {
          data: {
            type: Array,
            default: []
          }
        },
        created(){
          this.probeType = 3
          this.listenScroll = true
          this.touch = {};
          this.listHeight = []      //存字母组每个歌手组的高度
        },
        computed:{
          shortcutList(){
            return this.data.map(group => {
                return group.title.substr(0,1)
            })
          },
        },
        data(){
          return{
            scrollY: -1,
          }
        },
        methods:{
          selItem(item){
            this.$emit('select',item)
          },

          //快速入口touchstart事件
          onShortcutTouchStart(e){
            console.log('11111')
            //获取dom上的'data-index'属性的值，得到点击的快捷入口item的index
            let anchorIndex = getData(e.target,'index')
            console.log('TouchStart index--',anchorIndex)
            let firstTouch = e.touches[0];
            this.touch.y1 = firstTouch.pageY;
            this.touch.startIndex = anchorIndex;
            this._scrollTo(anchorIndex)
          },

          //快速入口touchmove事件
          onShortcutTouchMove(e){
            let firstTouch = e.touches[0];
            this.touch.y2 = firstTouch.pageY;
            let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0     //或0转换为数字
            let anchorIndex = this.touch.startIndex + delta
            this._scrollTo(anchorIndex)
          },


          //滚动到字母对应的歌手组合区域
          _scrollTo(index){
            if(!index && index !== 0){
              return
            }
            //往上回滚
            else if(index < 0){
              index = 0
            }
            //index是最后一个组的index
            else if(index > this.listHeight.length - 2){
              index =  this.listHeight.length - 2
            }
            //滚动后同步当前的scrollY
            this.scrollY = -this.listHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
          },
          //计算每一个快捷入口组的起始y位置，第一个是0
          _calculateHeight(){
            let list = this.$refs.listGroup;
            let height = 0;
            this.listHeight.push(height)

            list.forEach((li,k) => {
              if(k < list.length){
                height += li.clientHeight;
              }
              this.listHeight.push(height)
            })
            console.log('listheight--',this.listHeight,this.listHeight.length)
          },
          //滚动实时监听位置
          scroll(pos){
            this.scrollY = pos.y;
          },
        },
        watch:{
          data(newVal){
            this.$nextTick(() => {
              this._calculateHeight(newVal);
            })
          },
        },
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
