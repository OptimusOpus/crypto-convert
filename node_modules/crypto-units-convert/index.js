'use strict';

const BigNumber = require('bignumber.js');
const rawUnits = require('./Units.json');

const Units = {};

const btcUnits = {};
const bchUnits = {};
const ethUnits = {};
const xrpUnits = {};
const ltcUnits = {};
const dashUnits = {};
const xmrUnits = {};
const dotUnits = {};
const zecUnits = {};

Object.keys(rawUnits).map(function (rawUnit) {
  Object.keys(rawUnits[rawUnit]).map(function(i) {

    if (rawUnit === 'btc') {
      btcUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.btcUnits = rawUnits[rawUnit];
    }

    if (rawUnit === 'bch') {
      bchUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.bchUnits = rawUnits[rawUnit];
    }

    if (rawUnit === 'eth') {
      ethUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.ethUnits = rawUnits[rawUnit];
    }

    if (rawUnit === 'xrp') {
      xrpUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.xrpUnits = rawUnits[rawUnit];
    }

    if (rawUnit === 'ltc') {
      ltcUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.ltcUnits = rawUnits[rawUnit];
    }

    if (rawUnit === 'dash') {
      dashUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.dashUnits = rawUnits[rawUnit];
    }

    if (rawUnit === 'xmr') {
      xmrUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.xmrUnits = rawUnits[rawUnit];
    }

    if (rawUnit === 'dot') {
      dotUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.dotUnits = rawUnits[rawUnit];
    }

    if (rawUnit === 'zec') {
      zecUnits[i] = new BigNumber(rawUnits[rawUnit][i], 10);
      Units.zecUnits = rawUnits[rawUnit];
    }

  });
});

const regX = new RegExp(/^-?\d*\.?\d*$/);

Units.convertBTC = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!btcUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!btcUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(btcUnits[from]).div(btcUnits[to]);
  if (to != 'satoshi') {
    const base = new BigNumber(converted.toString(10), 10).times(btcUnits[to]).div(btcUnits['satoshi']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. Satoshis must be an integer.');
  }
  return converted.toString(10);
};

Units.convertBCH = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!bchUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!bchUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(bchUnits[from]).div(bchUnits[to]);
  if (to != 'satoshi') {
    const base = new BigNumber(converted.toString(10), 10).times(bchUnits[to]).div(bchUnits['satoshi']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. Satoshis must be an integer.');
  }
  return converted.toString(10);
};

Units.convertETH = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!ethUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!ethUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(ethUnits[from]).div(ethUnits[to]);
  if (to != 'wei') {
    const base = new BigNumber(converted.toString(10), 10).times(ethUnits[to]).div(ethUnits['wei']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. Wei must be an integer.');
  }
  return converted.toString(10);
};

Units.convertXRP = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!xrpUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!xrpUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(xrpUnits[from]).div(xrpUnits[to]);
  if (to != 'drop') {
    const base = new BigNumber(converted.toString(10), 10).times(xrpUnits[to]).div(xrpUnits['drop']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. Drop must be an integer.');
  }
  return converted.toString(10);
};

Units.convertLTC = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!ltcUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!ltcUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(ltcUnits[from]).div(ltcUnits[to]);
  if (to != 'litoshi') {
    const base = new BigNumber(converted.toString(10), 10).times(ltcUnits[to]).div(ltcUnits['litoshi']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. Litoshi must be an integer.');
  }
  return converted.toString(10);
};

Units.convertDASH = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!dashUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!dashUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(dashUnits[from]).div(dashUnits[to]);
  if (to != 'duff') {
    const base = new BigNumber(converted.toString(10), 10).times(dashUnits[to]).div(dashUnits['duff']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. Duff must be an integer.');
  }
  return converted.toString(10);
};

Units.convertXMR = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!xmrUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!xmrUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(xmrUnits[from]).div(xmrUnits[to]);
  if (to != 'pxmr') {
    const base = new BigNumber(converted.toString(10), 10).times(xmrUnits[to]).div(xmrUnits['pxmr']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. pXmr must be an integer.');
  }
  return converted.toString(10);
};

Units.convertDOT = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!dotUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!dotUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(dotUnits[from]).div(dotUnits[to]);
  if (to != 'planck') {
    const base = new BigNumber(converted.toString(10), 10).times(dotUnits[to]).div(dotUnits['planck']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. Planck must be an integer.');
  }
  return converted.toString(10);
};

Units.convertZEC = (value, from, to) => {
  from = from.toLowerCase();
  to = to.toLowerCase();
  if (!regX.test(value)) {
    throw new Error('Unsupported value');
  }
  if (!zecUnits[from]) {
    throw new Error('Unsupported input unit');
  }
  if (!zecUnits[to]) {
    throw new Error('Unsupported input unit');
  }
  let decimalError = false;
  const converted = new BigNumber(value, 10).times(zecUnits[from]).div(zecUnits[to]);
  if (to != 'zatoshi') {
    const base = new BigNumber(converted.toString(10), 10).times(zecUnits[to]).div(zecUnits['zatoshi']);
    decimalError = !base.isInteger();
  } else {
    decimalError = !converted.isInteger();
  }
  if (decimalError) {
    throw new Error('Unsupported decimal points. Zatoshi must be an integer.');
  }
  return converted.toString(10);
};

module.exports = Units;
