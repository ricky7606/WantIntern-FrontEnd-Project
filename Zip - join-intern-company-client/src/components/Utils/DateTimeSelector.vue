<template lang="html">
  <div class="date-time-selector">
    <!-- <div class="col">
      <input type="date" v-model="date" @change="dateChange" />
    </div> -->
    <div class="col date-picker">
      <datepicker v-model="date" language="zh" :format="'yyyy年MM月dd日'"></datepicker>
    </div>
    <div class="col">
      <input class="input-hour"
                  type="text"
                  @keyup="numberOnlyInput($event, 'hour')"
                  v-model="hour"
                  @change="timeChange" />:
           <input class="input-minute"
                  type="text"
                  @keyup="numberOnlyInput($event, 'minute')"
                  v-model="minute"
                  @change="timeChange" />
    </div>
    <!-- <div class="row">
      时间：<input class="input-hour"
                  type="text"
                  @keyup="numberOnlyInput($event, 'hour')"
                  v-model="hour"
                  @change="timeChange" />:
           <input class="input-minute"
                  type="text"
                  @keyup="numberOnlyInput($event, 'minute')"
                  v-model="minute"
                  @change="timeChange" />
    </div> -->
  </div>
</template>

<script>
  // 默认返回的时间格式， 2017-10-24 12:00:00
  import Datepicker from 'vuejs-datepicker'
  import moment from 'moment'

  export default {
    name: 'DateTimeSelector',
    data () {
      return {
        date: new Date(),
        hour: '00',
        minute: '00',
        inputingDate: false,
        inputDateBroken: false,
      }
    },
    watch: {
      date () {
        console.log(this.date)
        console.log(typeof this.date)
        this.emit()
      }
    },
    components: {
      Datepicker,
    },
    mounted () {
      let dateSelector = this.$refs['dateSelector']
      if (dateSelector && dateSelector.type === 'text') {
        this.inputDateBroken = true
      }
    },
    methods: {
      timeChange () {
        if (this.hour === '') this.hour = '00'
        if (this.minute === '') this.minute = '00'

        if (parseInt(this.hour) > 23) {
          this.hour = '23'
        }
        if (parseInt(this.minute) > 59) {
          this.minute = '59'
        }

        this.emit()
      },
      dateChange () {
        this.emit()
      },
      emit () {
        let value = this.combine()
        this.$emit('input', value)
      },
      combine () {
        let date = moment(this.date).format('YYYY-MM-DD')
        if (!date) return

        let hour = `00${this.hour}`.substr(-2)
        let minute = `00${this.minute}`.substr(-2)
        let time = `${hour}:${minute}:00`

        return `${date} ${time}`
      },
      numberOnlyInput (ev, tag) {
        let input = ev.target
        let value = input.value
        let m = value.match(/\d+/)

        if (m) {
          this[tag] = m[0].substr(0, 2)
        } else {
          this[tag] = ''
        }
      },
    },
    props: {
      mode: {
        type: String,
        default () {
          return 'DateTime'
        }
      },
      value: {
        type: String,
        default () {
          return ''
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .date-time-selector {
    display: block;

    .row {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
    }
    .date-picker {
      border-bottom: 1px solid black;
    }
    input {
      border-bottom: 1px solid gray;
    }
    .input-hour {
      width: 30px;
      text-align: center;
    }
    .input-minute {
      width: 30px;
      text-align: center;
    }
    .hint-text {
      font-size: 14px;
      line-height: 2em;
      margin-bottom: 1em;
    }
  }
</style>
