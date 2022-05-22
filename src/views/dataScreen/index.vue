<template>
  <section class="data-screen" id="big-screen">
    <scaleBox :width="1920" :height="1080">
      <template slot="content">
        <section class="big-screen">
          <div class="header-wrapper">
            <div class="time">{{ moment().format('YYYY年MM月DD dddd HH:mm') }}</div>
            <div class="title">静电环境监控看板</div>
            <div @click="gofull" class="full">
              <img v-if="!isScreenFull" width="30" height="30" src="../../assets/full.png" alt />
              <img v-else width="30" height="30" src="../../assets/close_full.png" alt />
            </div>
          </div>
          <section class="main-wrapper">
            <section class="top-wrapper">
              <section>
                <section class="top-title">产线静电监控</section>
                <section class="status-wrapper">
                  <ul>
                    <li>
                      <img
                        class="circle"
                        src="../../assets/mat_online.png"
                        width="29px"
                        height="28px"
                        alt
                      />
                      <span>台垫</span>
                    </li>
                    <li>
                      <img
                        class="circle"
                        src="../../assets/online.png"
                        width="29px"
                        height="28px"
                        alt
                      />
                      <span>手环</span>
                    </li>
                    <li>
                      <img class="circle" src="../../assets/online_circle.png" alt />
                      <span>在线</span>
                    </li>
                    <li>
                      <img class="circle" src="../../assets/leave_circle.png" alt />
                      <span>暂离</span>
                    </li>
                    <li>
                      <img class="circle" src="../../assets/warning_circle.png" alt />
                      <span>报警</span>
                    </li>
                    <li>
                      <img class="circle" src="../../assets/offline_circle.png" alt />
                      <span>离线</span>
                    </li>
                  </ul>
                </section>
              </section>
              <section class="people-wrapper">
                <section v-for="(item, index) in peopleList" :key="item.deviceId" class="wrapper">
                  <img
                    class="pic"
                    :src="item.isPing ? showMat(Number(item.channel == 3 ? 2 : item.channel)): showStatus(Number(item.channel))"
                    alt
                  />
                  <span class="text">A0{{ 10 > (index + 1) ? '0'+ (index + 1): (index + 1) }}</span>
                </section>
              </section>
            </section>
            <section class="bottom-wrapper">
              <section class="bottom-left-wrapper">
                <section>
                  <section class="top-title">设备静电监控</section>
                  <section class="status-wrapper">
                    <ul>
                      <li>
                        <img class="circle" src="../../assets/online_circle.png" alt />
                        <span>在线</span>
                      </li>
                      <!-- <li>
                            <img class="circle" src="../../assets/leave_circle.png" alt="" />
                            <span>离岗</span>
                      </li>-->
                      <li>
                        <img class="circle" src="../../assets/warning_circle.png" alt />
                        <span>报警</span>
                      </li>
                      <li>
                        <img class="circle" src="../../assets/offline_circle.png" alt />
                        <span>离线</span>
                      </li>
                    </ul>
                  </section>
                </section>
                <section class="device-wrapper">
                  <template v-for="(item, index) in deviceList">
                    <div class="wrapper" :key="item.deviceId">
                      <img class="pic" :src="showDevice(Number(item.channel))" alt />
                      <div class="bg-wrapper">
                        <div>
                          <img class="img" :src="showLine(Number(item.channel1))" alt />
                          <span>
                            {{ String(item.channel1Res).split('.')[0] }}
                            <span>.{{ String(item.channel1Res).split('.')[1] }}Ω</span>
                          </span>
                        </div>
                        <div>
                          <img class="img" :src="showLine(Number(item.channel2))" alt />
                          <span>
                            {{ String(item.channel2Res).split('.')[0] }}
                            <span>.{{ String(item.channel2Res).split('.')[1] }}Ω</span>
                          </span>
                        </div>
                      </div>
                      <span class="text">A0{{ 10 > (index + 1) ? '0'+ (index + 1): (index + 1) }}</span>
                    </div>
                  </template>
                </section>
              </section>
              <section class="bottom-right-wrapper">
                <div class="top-title">告警及通知</div>

                <div class="alarm-wrapper">
                  <div class="wrapper">
                    <div class="left-wrapper">
                      <span class="title"></span>
                      <span class="time-title">时间</span>
                      <span class="device-title">设备名称编号</span>
                    </div>
                    <span class="result-title">告警</span>
                  </div>
                  <template v-for="item in alarmList">
                    <div class="wrapper" v-if="item.status === 1" :key="item.name">
                      <div class="left-wrapper">
                        <span class="red-circle"></span>
                        <span class="red-time">{{ item.time }}</span>
                        <span class="red-name">{{ item.name }}</span>
                      </div>
                      <span class="red-result">{{ item.result }}</span>
                    </div>
                    <div class="wrapper" v-else :key="item.deviceId">
                      <div class="left-wrapper">
                        <span class="normal-circle"></span>
                        <span class="normal-time">{{ item.time }}</span>
                        <span class="normal-name">{{ item.name }}</span>
                      </div>
                      <span class="normal-result">{{ item.result }}</span>
                    </div>
                  </template>
                </div>
              </section>
            </section>
          </section>
        </section>
      </template>
    </scaleBox>
  </section>
</template>

<script>
import scaleBox from '@/components/scaleBox'
import moment from 'moment'
import mqtt from 'mqtt'
import FullScrenn from '@/utils/fullScreen'
const MQTT_SERVICE = 'ws://47.100.249.123:8083/mqtt'
const CLIENT_ID = 'mqttjs_' + Math.random().toString(16).substring(2, 8)
var client
const options = {
  connectTimeout: 40000,
  clientId: CLIENT_ID,
  clean: true
}
client = mqtt.connect(MQTT_SERVICE, options)
export default {
  name: 'dataScreen',
  components: {
    scaleBox
  },
  data() {
    return {
      moment,
      isScreenFull: false,
      peopleList: [],
      deviceList: [],
      alarmList: []
    }
  },
  created() {
    for (let i = 0; i < 92; i++) {
      this.peopleList.push({
        channel: i % 2 == 0 ? 1 : i % 2 == 1 ? 0 : 255,
        channel1: i % 2 == 0 ? 1 : i % 2 == 1 ? 0 : 255,
        isPing: i % 6 == 0 && i != 0 ? true : false,
        deviceId: '30001_' + i
      })
    }
    for (let i = 0; i < 36; i++) {
      this.deviceList.push({
        channel: 255,
        channel1: 0,
        channel1Res: '0.00',
        channel2: 0,
        channel2Res: '0.00',
        deviceId: '400010' + i
      })
    }
    for (let i = 0; i < 7; i++) {
      this.alarmList.push({
        status: i % 2 == 0 ? 0 : 1,
        time: moment().format('HH:mm:ss'),
        name: '3000' + i,
        result: '温湿度异常'
      })
    }
    this.mqttMSG()
  },
  mounted() {
    const screenChange = (isFull) => {
      this.isScreenFull = isFull
    }
    //初始化
    FullScrenn.init(screenChange)
  },
  methods: {
    mqttMSG() {
      // mqtt连接
      client.on('connect', (e) => {
        console.log('连接成功:')
        client.subscribe('/status/#', { qos: 0 }, (error) => {
          if (!error) {
            console.log('status订阅成功')
          } else {
            console.log('status订阅失败')
          }
        })
        client.subscribe('/alarm/#', { qos: 0 }, (error) => {
          if (!error) {
            console.log('alarm订阅成功')
          } else {
            console.log('alarm订阅失败')
          }
        })
      })
      // 接收消息处理
      client.on('message', (topic, message) => {
        console.log('收到来自', topic, '的消息', message.toString())
        const msg = JSON.parse(message)
        // 接受订阅消息
        if (topic.indexOf('status')) {
          // 订阅工位
          if (topic.indexOf('XJ_SP-JD02A') > -1) {
            this.peopleList.forEach((item) => {
              if (item.deviceId === msg.deviceId) {
                this.$set(this.peopleList, 'channel', msg.channel)
                this.$set(this.peopleList, 'channel1', msg.channel1)
              }
            })
          }
          // 订阅设备
          if (topic.indexOf('SBJD01') > -1) {
            this.deviceList.forEach((item) => {
              if (item.deviceId === msg.deviceId) {
                this.$set(this.deviceList, 'channel', msg.channel)
                this.$set(this.deviceList, 'channel1', msg.channel1)
                this.$set(this.deviceList, 'channel1Res', msg.channel1Res)
                this.$set(this.deviceList, 'channel2', msg.channel2)
                this.$set(this.deviceList, 'channel2Res', msg.channel2Res)
              }
            })
          }
        }
        // 接收告警消息
        if (topic.indexOf('alarm')) {
          if (msg.alarmFlag == 1) {
            const list = [...this.alarmList]
            if (
              msg.alarmCode == 95 ||
              msg.alarmCode == 96 ||
              msg.alarmCode == 97 ||
              msg.alarmCode == 99
            ) {
              // 绿色
              list.push({
                status: 0,
                time: moment(msg.timestamp).format('HH:mm:ss'),
                name: msg.deviceId.replace(/_/g, '-'),
                result: msg.alarmInfo
              })
            } else {
              //红色
              list.push({
                status: 1,
                time: moment(msg.timestamp).format('HH:mm:ss'),
                name: msg.deviceId.replace(/_/g, '-'),
                result: msg.alarmInfo
              })
            }
            list.sort(function (a, b) {
              return b.time < a.time ? -1 : 1
            })
            if (list.length > 7) {
              list.splice(7, list.length)
            }
            this.alarmList = [...list]
          }
        }
      })
      // 断开发起重连
      client.on('reconnect', (error) => {
        console.log('正在重连:', error)
      })
      // 链接异常处理
      client.on('error', (error) => {
        console.log('连接失败:', error)
      })
    },
    gofull() {
      if (this.isScreenFull) {
        //退出全屏
        FullScrenn.exitFullScreen()
      } else {
        //进入全屏
        FullScrenn.enterFullScreen()
      }
    },
    //展示工位状态
    showStatus(status) {
      let url
      switch (status) {
        case 0:
          url = require('../../assets/online.png')
          break
        case 1:
          url = require('../../assets/warning.png')
          break
        case 2:
          url = require('../../assets/warning.png')
          break
        case 3:
          url = require('../../assets/warning.png')
          break
        case 255:
          url = require('../../assets/offline.png')
          break
      }
      return url
    },
    //展示台垫状态
    showMat(status) {
      let url
      switch (status) {
        case 0:
          url = require('../../assets/mat_online.png')
          break
        case 1:
          url = require('../../assets/mat_warning.png')
          break
        case 2:
          url = require('../../assets/mat_warning.png')
          break
        case 3:
          url = require('../../assets/mat_warning.png')
          break
        case 255:
          url = require('../../assets/mat_offline.png')
          break
      }
      return url
    },
    //展示设备状态
    showDevice(status) {
      let url
      switch (status) {
        case 0:
          url = require('../../assets/device_online.png')
          break
        case 1:
          url = require('../../assets/device_warning.png')
          break
        case 2:
          url = require('../../assets/device_warning.png')
          break
        case 3:
          url = require('../../assets/device_warning.png')
          break
        case 255:
          url = require('../../assets/device_offline.png')
          break
      }
      return url
    },
    //展示地线状态
    showLine(status) {
      let url
      switch (status) {
        case 0:
          url = require('../../assets/line_online.png')
          break
        case 1:
          url = require('../../assets/line_warning.png')
          break
        case 2:
          url = require('../../assets/line_warning.png')
          break
        case 3:
          url = require('../../assets/line_warning.png')
          break
        case 255:
          url = require('../../assets/line_offline.png')
          break
      }
      return url
    }
  }
}
</script>

<style lang="less">
@import url(./index.less);
</style>