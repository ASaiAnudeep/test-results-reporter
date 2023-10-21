const Influxdb = require("influxdb-v2");
const Metric = require('performance-results-parser/src/models/Metric');
const PerformanceTestResult = require('performance-results-parser/src/models/PerformanceTestResult');
const Transaction = require('performance-results-parser/src/models/Transaction');
const TestCase = require('test-results-parser/src/models/TestCase');
const TestResult = require('test-results-parser/src/models/TestResult');
const TestSuite = require('test-results-parser/src/models/TestSuite');

const { STATUS } = require('../helpers/constants');

/**
 * The entrypoint function. Runs the influx2 target
 * @param {object} param0
 * @param {PerformanceTestResult | TestResult} param0.result
 * @param {import('..').Target} param0.target
 */
async function run({ result, target }) {
    target.inputs = Object.assign({}, default_inputs, target.inputs);
    const metrics = getMetrics({ result, target });

    const influxDBClient = new Influxdb({
        host: target.inputs.host,
        protocol: target.inputs.protocol,
        port: target.inputs.port,
        token: target.inputs.token
    })

    const writeOptions = {
        org: target.inputs.org,
        bucket: target.inputs.bucket,
        precision: target.inputs.precision
    }

    await influxDBClient.write(writeOptions, metrics);
}

/**
 * Creates a metric object
 * @param measurement
 * @param tags
 * @param fields
 * @returns
 */
function createMetric(measurement, tags, fields) {
    return { measurement, tags, fields }
}

/**
 * Converts the parsed metrics to InfluxDB metric format
 * @param {object} param0
 * @param {PerformanceTestResult | TestResult} param0.result
 * @param {import('..').Target} param0.target
 */
function getMetrics({ result, target }) {
    const influx_metrics = [];
    if (result instanceof PerformanceTestResult) {
        influx_metrics.push(getPerfRunInfluxMetric({ result, target }));

        for (const transaction of result.transactions) {
            influx_metrics.push(getTransactionInfluxMetric(transaction, target));
        }
    } else if (result instanceof TestResult) {
        influx_metrics.push(getTestInfluxMetric({ result, target }, target.inputs.measurement_test_run));
        for (const suite of result.suites) {
            influx_metrics.push(getTestInfluxMetric({ result: suite, target }, target.inputs.measurement_test_suite));
            for (const test_case of suite.cases) {
                influx_metrics.push(getTestCaseInfluxMetric({ result: test_case, target }));
            }
        }
    }
    return influx_metrics;
}

/**
 * @param {object} param0
 * @param {PerformanceTestResult} param0.result
 * @param {import('..').Target} param0.target
 * @returns
 */
function getPerfRunInfluxMetric({ result, target }) {
    const tags = Object.assign({}, target.inputs.tags);
    tags.Name = result.name;
    tags.Status = result.status;

    const fields = Object.assign({}, target.inputs.fields);
    fields.status = result.status === 'PASS' ? 0 : 1;
    fields.transactions = result.transactions.length;
    fields.transactions_passed = result.transactions.filter(_transaction => _transaction.status === "PASS").length;
    fields.transactions_failed = result.transactions.filter(_transaction => _transaction.status === "FAIL").length;

    for (const metric of result.metrics) {
        setPerfInfluxMetricFields(metric, fields);
    }

    return createMetric(target.inputs.measurement_perf_run, tags, fields)
}

/**
 * @param {Metric} metric
 * @param fields
 */
function setPerfInfluxMetricFields(metric, fields) {
    let name = metric.name;
    name = name.toLowerCase();
    name = name.replace(' ', '_');
    if (metric.type === "COUNTER" || metric.type === "RATE") {
        fields[`${name}_sum`] = metric.sum;
        fields[`${name}_rate`] = metric.rate;
    } else if (metric.type === "TREND") {
        fields[`${name}_avg`] = metric.avg;
        fields[`${name}_med`] = metric.med;
        fields[`${name}_max`] = metric.max;
        fields[`${name}_min`] = metric.min;
        fields[`${name}_p90`] = metric.p90;
        fields[`${name}_p95`] = metric.p95;
        fields[`${name}_p99`] = metric.p99;
    }
}

/**
 * @param {Transaction} transaction
 * @param target
 */
function getTransactionInfluxMetric(transaction, target) {
    const tags = Object.assign({}, target.inputs.tags);
    tags.Name = transaction.name;
    tags.Status = transaction.status;

    const fields = Object.assign({}, target.inputs.fields);
    fields.status = transaction.status === 'PASS' ? 0 : 1;

    for (const metric of transaction.metrics) {
        setPerfInfluxMetricFields(metric, fields);
    }

    return createMetric(target.inputs.measurement_perf_transaction, tags, fields)
}

/**
 * @param {object} param0
 * @param {TestResult | TestSuite} param0.result
 * @param {import('..').Target} param0.target
 * @returns
 */
function getTestInfluxMetric({ result, target }, measurement) {
    const tags = Object.assign({}, target.inputs.tags);
    tags.Name = result.name;
    tags.Status = result.status;

    const fields = Object.assign({}, target.inputs.fields);
    fields.status = result.status === 'PASS' ? 0 : 1;
    fields.total = result.total;
    fields.passed = result.passed;
    fields.failed = result.failed;
    fields.duration = result.duration;

    return createMetric(measurement, tags, fields)
}

/**
 * @param {object} param0
 * @param {TestCase} param0.result
 * @param {import('..').Target} param0.target
 * @returns
 */
function getTestCaseInfluxMetric({ result, target }) {
    const tags = Object.assign({}, target.inputs.tags);
    tags.Name = result.name;
    tags.Status = result.status;

    const fields = Object.assign({}, target.inputs.fields);
    fields.status = result.status === 'PASS' ? 0 : 1;
    fields.duration = result.duration;

    return createMetric(target.inputs.measurement_test_case, tags, fields)
}

const default_inputs = {
    host: '',
    protocol: 'https',
    port: 443,
    token: '',
    org: '',
    bucket: '',
    precision: 'ns',
    environment: 'test',
    measurement_perf_run: 'PerfRun',
    measurement_perf_transaction: 'PerfTransaction',
    measurement_test_run: 'TestRun',
    measurement_test_suite: 'TestSuite',
    measurement_test_case: 'TestCase',
    tags: {},
    fields: {}
}

const default_options = {
    condition: STATUS.PASS_OR_FAIL
}

module.exports = {
    run,
    default_options
}