const {
  formatNumber
} = require('./utilities');

function formatLine(line) {
  const formattedLine = {
    name: line['Name'],
    run: formatNumber(line['RunNo']),
    type: line['LineTypeName'],
    modeId: formatNumber(line['TransportModeId']),
    modeName: line['TransportModeName'],
    trainNumber: formatNumber(line['TrainNo']),
    towards: line['Towards'],
    operatorId: formatNumber(line['OperatorId'] || line['OperatorCode']),
    operatorName: line['OperatorName'] || null,
    onSchedule: Boolean(line['IsTimingPoint']),
    stopPoint: line['StopPoint'] || null,
    realTime: {
      deviation: NaN,
      effect: null // Seems to be 'PASSED', 'NONE', 'CRITICAL' or non existing
    }
  };

  if (line['RealTime']) {
    formattedLine.realTime = {
      deviation: formatNumber(line['RealTime']['RealTimeInfo']['DepTimeDeviation']),
      effect: line['RealTime']['RealTimeInfo']['DepDeviationAffect']
    };
  }

  return formattedLine;
}

module.exports = {
  formatLine
};
