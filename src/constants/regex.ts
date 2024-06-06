/**
 * Regex for email validation
 */
export const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Regex for fiscal code validation
 * Fiscal code is a special identification number for residents of italy
 */
export const REGEX_FISCAL_CODE =
  /^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$/;

/**
 * Regex for phone number validation
 */
export const REGEX_PHONE_NUMBER =
  /^(?:(?:\+)?\d{1,3}(?:\s|-|\.)?)?\(?\d{3}\)?(?:\s|-|\.)?\d{3}(?:\s|-|\.)?\d{3,4}$/;

export const REGEX_NUMBER_FORMAT =
  /^(?!^[.,])(?!.*\.\.)(?!.*\.,)-?\d*(?:\.\d*)*(?:,\d*)?$/;
