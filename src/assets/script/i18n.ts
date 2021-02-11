import Setting from '@/../setting/setting.json'
import { createI18n } from 'vue-i18n'
import { CategoryList, Locales, VoicesList } from './voices'

const CN: any = { ...Locales['zh-CN'], voice: {}, voicecategory: {} }
const JP: any = { ...Locales['ja-JP'], voice: {}, voicecategory: {} }

const NAME = Setting['name'] || {}

CN.info = {
  ...CN.info,
  ...NAME['CN'] || {
    title: '语音按钮',
    fullName: ''
  }
}

JP.info = {
  ...JP.info,
  ...NAME['JP'] || {
    title: 'Voices Button',
    fullName: ''
  }
}

for (const category of CategoryList) {
  if (category.translate !== undefined) {
    if (category.translate['zh-CN'] !== undefined) {
      CN.voicecategory[category.name] = category.translate['zh-CN']
    }
    if (category.translate['ja-JP'] !== undefined) {
      JP.voicecategory[category.name] = category.translate['ja-JP']
    }
  }
}

for (const voice of VoicesList) {
  if (voice.translate !== undefined) {
    const category = CategoryList.find(item => {
      if (item.name === voice.category) {
        return item
      }
    })!
    if (voice.translate['zh-CN'] !== undefined && category.translate['zh-CN'] !== undefined) {
      CN.voice[voice.name] = voice.translate['zh-CN']
    }
    if (voice.translate['ja-JP'] !== undefined && category.translate['ja-JP'] !== undefined) {
      JP.voice[voice.name] = voice.translate['ja-JP']
    }
  }
}

/**
 * 获取音频总数
 */
function getVoiceTotal(obj: { [name: string]: string }) {
  let num = 0
  for (const i in obj) {
    if (obj[i]) num += 1
  }
  return num.toString()
}
CN.voiceTotal = getVoiceTotal(CN.voice)
JP.voiceTotal = getVoiceTotal(JP.voice)

/**
 * 获取音频对应语言的更新日期和更新数量
 */
let CNLastDate = ''
let JPLastDate = ''
let CNTemp: null | Date = null
let JPTemp: null | Date = null
for (const i in VoicesList) {
  if (VoicesList[i].date) {
    const voiceDate = new Date(VoicesList[i].date!)
    if (VoicesList[i].translate['zh-CN'] && CategoryList.find(item => item.name === VoicesList[i].category)!.translate['zh-CN']) {
      if (!CNTemp) {
        CNTemp = voiceDate
        CNLastDate = VoicesList[i].date!
      }
      if (voiceDate > CNTemp) {
        CNTemp = voiceDate
        CNLastDate = VoicesList[i].date!
      }
    }
    if (VoicesList[i].translate['ja-JP'] && CategoryList.find(item => item.name === VoicesList[i].category)!.translate['ja-JP']) {
      if (!JPTemp) {
        JPTemp = voiceDate
        JPLastDate = VoicesList[i].date!
      }
      if (voiceDate > JPTemp) {
        JPTemp = voiceDate
        JPLastDate = VoicesList[i].date!
      }
    }
  }
}
CN.lastDate = CNLastDate || ''
JP.lastDate = JPLastDate || ''
CN.newVoice = VoicesList.filter((item) => item.date && item.date === CNLastDate && item.translate['zh-CN'] && CategoryList.find(category => category.name === item.category)!.translate['zh-CN']).length.toString() || ''
JP.newVoice = VoicesList.filter((item) => item.date && item.date === JPLastDate && item.translate['ja-JP'] && CategoryList.find(category => category.name === item.category)!.translate['ja-JP']).length.toString() || ''

const i18n = createI18n({
  locale: /ja/i.test(navigator.language) ? 'ja-JP' : 'zh-CN',
  messages: {
    'zh-CN': CN,
    'ja-JP': JP
  }
})

export default i18n
