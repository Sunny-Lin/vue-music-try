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
          <li v-for="(item,index) in shortcutList"
              :data-index="index"
              class="item"
              :class="{'current': currentIndex === index}"
          >{{item}}</li>
        </ul>
      </div>
<!--      fix title-->
      <div class="list-fixed" v-show="fixedTitle" ref="fixed">
        <div class="fixed-title">{{fixedTitle}}</div>
      </div>
<!--      loading-->
      <div v-show="!data.length" class="loading-container">
        <Loading></Loading>
      </div>
    </Scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { getData } from 'common/js/dom'
  import Loading from 'base/loading/loading'

  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18

  export default {
        name: "listview",
        components: {
          Scroll,
          Loading
        },
        props: {
          data: {
            type: Array,
            default: []
          }
        },
        created(){
          this.probeType = 3    //为了使滑动过程中，可以监听到派发的scroll事件的滚动位置
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
          fixedTitle(){
            if(this.scrollY > 0){
              return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''

          },
        },
        data(){
          return{
            scrollY: -1,
            currentIndex: 0,
            diff: -1,
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
              //listheight包括首尾
              this.listHeight.push(height)
            })
            console.log('listheight--',this.listHeight.length,list.length,this.listHeight,)
          },
          //滚动实时监听位置
          scroll(pos){
            this.scrollY = pos.y;
            console.log('实时滚动位置--',this.scrollY,pos.y)
          },

          //、点击入口上下方要不能滚动
          //scrollY变化，currentIndex    ok
          //title fix在顶部
          //优化进入loading     ok

        },
        watch:{
          data(newVal){
            this.$nextTick(() => {
              this._calculateHeight(newVal);
            })
          },
          //快速入口高亮，根据滑动距离得出落在的index范围
          scrollY(newY){
            console.log('newY--',newY)
            //顶部上拉时
            if(newY > 0){
              this.currentIndex = 0;
              console.log('curr--',this.currentIndex)
              return
            }
            //滚动在中间范围时
            for(let i=0;i< this.listHeight.length - 1;i++){
              let height1 = this.listHeight[i],
                  height2 = this.listHeight[i+1];

              if(-newY >= height1 && -newY < height2){
                this.currentIndex = i
                this.diff = height2 + newY
                console.log('curr--',this.currentIndex)
                return;
              }
            }
            //滚动在最底下超过最后一个的index时:
            // -2是因为一开始push进去一个0，this.listHeight.length - 1是最后一个的下标，所以-2才是快速入口最后一个的下标
            this.currentIndex = this.listHeight.length - 2;
            console.log('curr--',this.currentIndex)
          },

          //滚动的title与fixed title重合时，fixed title上移
          diff(newVal){

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
