const { getLaunchDetails, getLastLaunchByName } = require('../helpers/report-portal');
const { addExtension } = require('../helpers/teams');
const { addTextBlock } = require('../helpers/slack');
const { addTextSection } = require('../helpers/chat');

function getReportPortalDefectsSummary(defects, bold_start = '**', bold_end= '**') {
  const results = [];
  if (defects.product_bug) {
    results.push(`${bold_start}🔴 PB - ${defects.product_bug.total}${bold_end}`);
  } else {
    results.push(`🔴 PB - 0`);
  }
  if (defects.automation_bug) {
    results.push(`${bold_start}🟡 AB - ${defects.automation_bug.total}${bold_end}`);
  } else {
    results.push(`🟡 AB - 0`);
  }
  if (defects.system_issue) {
    results.push(`${bold_start}🔵 SI - ${defects.system_issue.total}${bold_end}`);
  } else {
    results.push(`🔵 SI - 0`);
  }
  if (defects.no_defect) {
    results.push(`${bold_start}◯ ND - ${defects.no_defect.total}${bold_end}`);
  } else {
    results.push(`◯ ND - 0`);
  }
  if (defects.to_investigate) {
    results.push(`${bold_start}🟠 TI - ${defects.to_investigate.total}${bold_end}`);
  } else {
    results.push(`🟠 TI - 0`);
  }
  return results;
}

function attachForTeams({ payload, analyses, extension }) {
  addExtension({ payload, extension, text: analyses.join(' ｜ ')});
}

function attachForSlack({ payload, analyses, extension }) {
  addTextBlock({ payload, extension, text: analyses.join(' ｜ ')});
}

function attachForChat({ payload, analyses, extension }) {
  addTextSection({ payload, extension, text: analyses.join(' ｜ ')});
}

async function _getLaunchDetails(options) {
  if (!options.launch_id && options.launch_name) {
   return getLastLaunchByName(options);
  }
  return getLaunchDetails(options);
}

async function run({ extension, payload, target }) {
  try {
    const { statistics } = await _getLaunchDetails(extension.inputs);
    if (statistics && statistics.defects) {
      if (target.name === 'teams') {
        extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
        const analyses = getReportPortalDefectsSummary(statistics.defects);
        attachForTeams({ payload, analyses, extension });
      } else if (target.name === 'slack') {
        extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
        const analyses = getReportPortalDefectsSummary(statistics.defects, '*', '*');
        attachForSlack({ payload, analyses, extension });
      } else if (target.name === 'chat') {
        extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
        const analyses = getReportPortalDefectsSummary(statistics.defects, '<b>', '</b>');
        attachForChat({ payload, analyses, extension });
      }
    }
  } catch (error) {
    console.log('Failed to get report portal analysis');
    console.log(error);
  }
}

const default_options = {
  hook: 'end',
  condition: 'fail'
}

const default_inputs_teams = {
  title: 'Report Portal Analysis',
  separator: true
}

const default_inputs_slack = {
  title: 'Report Portal Analysis',
  separator: false
}

const default_inputs_chat = {
  title: 'Report Portal Analysis',
  separator: true
}

module.exports = {
  run,
  default_options
}