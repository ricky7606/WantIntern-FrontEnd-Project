<template lang="html">
  <div class="time-selector">
    <div class="col">
      <input class="input-hour"
                  type="text"
                  @keyup="numberOnlyInput($event, 'hour')"
                  @blur="emit"
                  v-model="hour"
                  @change="timeChange" />:
           <input class="input-minute"
                  type="text"
                  @keyup="numberOnlyInput($event, 'minute')"
                  @blur="emit"
                  v-model="minute"
                  @change="timeChange" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DateTimeSelector',
    data () {
      return {
        hour: '00',
        minute: '00',
        inputingDate: false,
        inputDateBroken: false,
      }
    },
    watch: {
      hour () {
        this.emit()
      },
      minute () {
        this.emit()
      },
      value () {
        let value = this.value
        if (value.length === 5 || value.length === 8) {
          this.hour = value.substr(0, 2)
          this.minute = value.substr(3, 2)
        }
      },
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
      emit () {
        let value = this.combine()
        this.$emit('input', value.substr(0, 5))
      },
      combine () {
        let hour = `00${this.hour}`.substr(-2)
        let minute = `00${this.minute}`.substr(-2)
        let time = `${hour}:${minute}`

        return time
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
  .time-selector {
    display: block;

    .row {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
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

    display: block;
    border: 1px solid #E5E6EB;

    line-height: 32px;
    height: 32px;
    padding: 0 10px;
    font-size: 15px;
  }
</style>
