/**
 * Run your answer against a specific test-case input from a JSON file.
 *
 * This file serves two purposes:
 *
 *     * It's a convenience script that allows you to execute your answer with a test-case,
 *       and view the results in the generated `output.json` file or stdout. It's analogous
 *       to pressing 'Try Answer' on the side panel, except it doesn't tell you if
 *       your answer is right or wrong.
 *
 *     * It's used by the Lytmus platform to execute your answer with private test-cases.
 *
 * You can execute and test your answer by either pressing 'Try Answer' in the side panel,
 * or by running `node test_answer.js <test_case_path>` on the command line.
 * For example:
 *      node test_answer.js inputs/divide_by_zero.json
 *
 * --------------------------------------------------------------------------------------
 * IMPORTANT: You DO NOT need to modify this file. If you decide to do so,
 *            please follow these guidelines:
 *
 *     1. The name of this file must always be `test_answer.js`. DO NOT
 *        rename or delete this file.
 *
 *     2. This file must always accept as a first argument the path to the JSON-encoded
 *        test file.
 *
 *     3. This file must always write to a file called `output.json`, located
 *        in the same folder as `test_answer.js`.
 */

/* global testCasePathValue:true */

var fs = require('fs');
var program = require('commander');

/**
 * Main entry point. Runs the answer with test cases.
 */
function main() {
    program
        .usage('<test_case_path>')
        .command('test_case_path', 'path to the JSON file containing the ' +
            'test-case input, eg, "inputs/divide_by_zero.json"')
        .action(function(testCasePath) {
            testCasePathValue = testCasePath;
        });
    program.parse(process.argv);

    // Run your answer with the desired test case.
    runAnswer(testCasePathValue);
}

/**
 * Feed the provided test-case to the answer() function, and dump the output to a JSON file.
 *
 * @param {string} testCasePath - Path of test-case file, eg, 'inputs/divide_by_zero.json'.
 */
function runAnswer(testCasePath) {
    var input = loadInputFromFile(testCasePath);

    if (!inputIsValid(input)) {
        process.exit(1);
    }

    console.log('Calling answer()');
    console.log('Arguments: input=%s', input['input']);

    var answer = require('./answer');
    var output = answer.answer(input['input']);
    var jsonOutput = JSON.stringify(output);
    console.log('Returned: ' + jsonOutput);

    // The output object must always be saved to 'output.json'. DO NOT change the name of this file.
    var outputPath = 'output.json';
    dumpOutputToFile(jsonOutput, outputPath);
}

/**
 * Load the specified JSON-encoded file to a JavaScript object.
 *
 * @param {string} filename - Path of JSON-encoded file, eg, 'inputs/divide_by_zero.json'.
 * @return {object} An Object holding the content of the JSON-encoded file, eg, {"name": "bill"}.
 */
function loadInputFromFile(filename) {
    try {
        var content = fs.readFileSync(filename);
        var fileContent = JSON.parse(content);
    } catch(err) {
        if (err.code == 'MODULE_NOT_FOUND') {
            console.error('Error, could not read file ' + filename);
        } else {
            console.error('Error, input file ' + filename + ' does not contain valid JSON');
        }
        process.exit(1);
    }
    return fileContent;
}

/**
 * Validates the input from the input file provided when running this script. The input file
 * must contain all of the required fields, and the values for those fields must all be of an
 * required type.
 *
 * @param {object} input: The contents of the input file provided when this script is run.
 *
 * @return {boolean} indicating whether the input file contains all required fields and that they
 *                   all contain values of the correct type.
 */
function inputIsValid(input) {
    // Mapping of required field names to the required type of values for that field for the
    // contents of the input file
    var requiredFields = {
        'input': 'number',
    };

    var fieldsAreValid = true;
    for (var field in requiredFields) {
        if (!(field in input)) {
            console.error('Error, input JSON file does not have field "%s"', field);
            fieldsAreValid = false;
        } else if (typeof input[field] != requiredFields[field]) {
            console.error('Error, field "%s" in input file has the type "%s", but the type should be "%s"',
                          field, typeof input[field], requiredFields[field]);
            fieldsAreValid = false;
        }
    }

    return fieldsAreValid;
}

/**
 * Encode the specified output as JSON, and write it to the specified file.
 *
 * @param {boolean} output - The output to be JSON-encoded and dumped to file.
 * @param {string} filePath - String with path of file to create, eg, 'output.json'.
 */
function dumpOutputToFile(output, filePath) {
    fs.writeFile(filePath, output);
}

main();
