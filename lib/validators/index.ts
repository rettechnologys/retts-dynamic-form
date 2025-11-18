import { defineRule, configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import * as AllRules from '@vee-validate/rules';
import { formatPhoneNumber } from '@retts-packages/utilities-helper';

// Phone number pattern
export const PATTERN_MOBILE_NUMBER = /^(\+62|62|0)[0-9]{9,13}$/;

// Common URL pattern
// oxlint-disable-next-line no-useless-escape
export const COMMON_URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/**
 * Plugin options interface
 */
export interface ValidatorPluginOptions {
  /** i18n instance for translated error messages */
  i18n?: any;
  /** Locale translations for VeeValidate */
  locales?: Record<string, any>;
  /** Whether to install built-in rules (default: true) */
  installBuiltInRules?: boolean;
  /** Whether to install custom rules (default: true) */
  installCustomRules?: boolean;
}

/**
 * Install all built-in VeeValidate rules
 */
export function installValidationRules() {
  Object.keys(AllRules).forEach((rule) => {
    const ruleFunction = (AllRules as unknown as Record<string, any>)[rule];
    // Only define rules that are actually functions
    if (typeof ruleFunction === 'function') {
      defineRule(rule, ruleFunction);
    }
  });
}

/**
 * Install custom validation rules
 * @param i18n - Optional i18n instance for translated error messages
 */
export function installCustomValidators(i18n?: any) {
  // Confirmed rule - check if value matches another field
  defineRule('confirmed', (value: string, [target]: string, ctx: any) => {
    if (!target || !ctx.form) {
      return true;
    }
    if (value === ctx.form[target]) {
      return true;
    }
    return i18n
      ? i18n.global.t('messages.confirmed', { field: target })
      : `The ${ctx.field} field must match ${target}`;
  });

  // Phone number validation
  defineRule('phone', (value: string, _params: any, ctx: any) => {
    if (!value) {
      return true;
    }

    const formattedValue = formatPhoneNumber(value);
    
    if (formattedValue.match(PATTERN_MOBILE_NUMBER)) {
      return true;
    }

    return i18n
      ? i18n.global.t('messages._default', { field: ctx.label })
      : `The ${ctx.field} field must be a valid phone number`;
  });

  // URL validation
  defineRule('url', (value: string, _params: any, ctx: any) => {
    if (!value) {
      return true;
    }

    if (COMMON_URL_PATTERN.test(value)) {
      return true;
    }

    return i18n
      ? i18n.global.t('messages._default', { field: ctx.label })
      : `The ${ctx.field} field must be a valid URL`;
  });

  // Async data exists validation (example)
  defineRule('isDataExistsAsync', async (value: string, [col]: string) => {
    if (!value || !value.length || !col) {
      return true;
    }
    
    // This is a placeholder - users should implement their own API call
    console.warn('isDataExistsAsync: Please implement your own API validation logic');
    
    return i18n
      ? i18n.global.t('messages.async_field_taken', { field: col })
      : `The ${col} is already taken`;
  });
}

/**
 * Configure VeeValidate with localization
 * @param locales - Object containing locale translations (e.g., { en, id })
 */
export function configureValidation(locales?: Record<string, any>) {
  if (locales) {
    configure({
      generateMessage: localize(locales),
    });
  }
}

/**
 * Install all validators (built-in + custom)
 * @param options - Configuration options
 * @param options.i18n - i18n instance for translations
 * @param options.locales - Locale translations
 */
export function installAllValidators(options?: { i18n?: any; locales?: Record<string, any> }) {
  installValidationRules();
  installCustomValidators(options?.i18n);
  
  if (options?.locales) {
    configureValidation(options.locales);
  }
}

// Re-export VeeValidate utilities
export { defineRule, configure } from 'vee-validate';
export { localize } from '@vee-validate/i18n';
