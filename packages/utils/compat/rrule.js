import * as rruleModule from "../../../node_modules/rrule/dist/es5/rrule.js";

const fallbackSource =
  rruleModule.default ?? rruleModule["module.exports"] ?? rruleModule.rrule ?? {};

export const ALL_WEEKDAYS = rruleModule.ALL_WEEKDAYS ?? fallbackSource.ALL_WEEKDAYS;
export const Frequency = rruleModule.Frequency ?? fallbackSource.Frequency;
export const RRule = rruleModule.RRule ?? fallbackSource.RRule;
export const RRuleSet = rruleModule.RRuleSet ?? fallbackSource.RRuleSet;
export const Weekday = rruleModule.Weekday ?? fallbackSource.Weekday;
export const datetime = rruleModule.datetime ?? fallbackSource.datetime;
export const rrulestr = rruleModule.rrulestr ?? fallbackSource.rrulestr;

export default {
  ALL_WEEKDAYS,
  Frequency,
  RRule,
  RRuleSet,
  Weekday,
  datetime,
  rrulestr
};
