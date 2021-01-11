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

CN.voiceTotal = Object.keys(CN.voice).length.toString()
JP.voiceTotal = Object.keys(JP.voice).length.toString()

const i18n = createI18n({
  locale: /ja/i.test(navigator.language) ? 'ja-JP' : 'zh-CN',
  messages: {
    'zh-CN': CN,
    'ja-JP': JP
  }
})

export default i18n
