import type { App, Plugin } from 'vue';
import {
  installValidationRules,
  installCustomValidators,
  configureValidation,
  type ValidatorPluginOptions
} from '../validators';

/**
 * Vue Plugin for VeeValidate validators
 */
export const ValidatorPlugin: Plugin = {
  install(_app: App, options?: ValidatorPluginOptions) {
    const {
      i18n,
      locales,
      installBuiltInRules = true,
      installCustomRules = true
    } = options || {};

    // Install built-in VeeValidate rules
    if (installBuiltInRules) {
      installValidationRules();
    }

    // Install custom validators
    if (installCustomRules) {
      installCustomValidators(i18n);
    }

    // Configure localization
    if (locales) {
      configureValidation(locales);
    }
  }
};

export default ValidatorPlugin;
