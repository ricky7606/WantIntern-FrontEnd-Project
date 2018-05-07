<template lang="html">
  <div class="wi-footer flex-col">
    <div class="content flex-col">
      <div class="links flex-row flex-center">
        友情链接：
        <a :href="`#/${item}`" class="lk" v-for="item in links">
          {{item}}
        </a>
      </div>
      <div class="message flex-row flex-center">
        联系地址: 北京朝阳区太阳宫中路冠捷大厦3层302   联系电话：010-84150633京公网安备11010502032801
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      links: '酉米科技 上海人才网 上海培训 上海一对一辅导 上海汽车报价 上海人才网 上海招工信息 上海地铁 上海事业单位 上海体检'.split(' ')
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../less/common.less";

  .wi-footer {
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #404A61;
    text-align: center;
    height: 114px;

    .content {
      display: inline-block;
      width: @MIN-WIDTH;
      min-width: @MIN-WIDTH;
    }

    .links {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 14px;
      margin-top: 20px;
      text-align: center;

      a {
        text-decoration: none;
        color: inherit;
        display: inline-block;
        margin-right: 12px;
      }
    }
    .message {
      margin-top: 16px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 14px;
    }
  }
</style>
