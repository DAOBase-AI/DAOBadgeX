import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';
import store from './store';

import en from '@/locales/en';

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
// function loadLocaleMessages(): LocaleMessages<VueMessageType> {
//   const messages: LocaleMessages<VueMessageType> = {
//     en,
//   };
//   return messages;
// }

export default createI18n({
  legacy: true,
  // @ts-ignore
  locale: store.state.locale || 'en',
  fallbackLocale: 'en',
  // messages: loadLocaleMessages(),
  globalInjection: true,
});
