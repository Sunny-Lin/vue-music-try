<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item,index) in dots"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    name: 'slider',
    props:{
      loop: {
       type: Boolean,
       default: true,
      },
      autoPlay: {
        type: Boolean,
        default: true,
      },
      interVal:{
        type: Number,
        default: 4000
      }

    },
    data(){
      return{
        dots: [],
        currentPageIndex: 0,
        children: [],
      }
    },
    activated(){
      if(this.autoPlay){
        this._play()
      }
    },
    mounted(){
        //确保DOM成功渲染 也可以用&nextTick
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        if(this.autoPlay){
          this._play();
        }
        window.addEventListener('resize',() => {
          if(!this.slider)
            return
          this._setSliderWidth(true);
          this.slider.refresh()
        })

      },20)
    },
    methods:{
      //设置slider宽度
      _setSliderWidth(isResize){
        this.children = this.$refs.sliderGroup.children;
        //获取slider宽度
        //计算总宽度
        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for(let i = 0;i < this.children.length;i++){
          let child = this.children[i]
          child.style.width = sliderWidth + 'px'
          addClass(child,'slider-item')
          width += sliderWidth
        }
        if(this.loop && !isResize){
          width += 2*sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider(){
        this.slider = new BScroll(this.$refs.slider,{
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapSpeed: 400,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          // click: true   //因为安装了fastclick，betterscroll的click会被fastClick拦截
        })
        this.slider.on('scrollEnd',() => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          if(this.loop)
            pageIndex -= 1;
          this.currentPageIndex = pageIndex;
          if(this.autoPlay){
            clearTimeout(this.timer)
            this._play();
          }

        })
      },
      _initDots(){
        this.dots = new Array(this.children.length);
      },
      _play(){
        //获取页数
        //goToPage  自动播放setTimeout()
        let pageIndex = this.currentPageIndex + 1;
        if(this.loop)
          pageIndex += 1;


        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex,0,400)
        },this.interVal)

      },
    },
    destroyed () {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
