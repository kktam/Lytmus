/**
 * Write your solution in this file.
 *
 * You can execute and test your answer by either pressing 'Try Answer' in the side panel,
 * or by running `node test_answer.js <test_case_path>` on the command line.
 * For example:
 *      node test_answer.js inputs/large.json
 *
 * You can organize your code as you wish (eg, use auxiliary files) as long as `test_answer.js`
 * produces the expected output.
 */

module.exports = {
    /**
     * Implement your solution here.
     *
     * @param {string} log_path - String with path of Nginx access logfile.
     * @return {array} A list of strings, representing the URLs with the largest average processing time.
     */
    analyze_requests: function (log_path) {

        //var lineReader = require('readline');
        //var fs = require('fs');
        //lineReader.createInterface({
        //    input: fs.createReadStream(log_path)
        //});
        //lineReader.on('line', function(line) {
        //    console.log('Line from file:', line);
        //});
        //lineReader.eachLine(log_path, function(line, last, cb) {
        //    console.log('Line from file:', line);
        //});

        //fs.readFile(log_path, 'utf8', function(err, data) {
        //    //console.log('File from file:', data);
        //    var rows = data.split("\r\n");
        //    for(var i = 0; i < rows.length; i++) {
        //    }
        //});

        var NginxParser = require('nginxparser');
        var parser = new NginxParser('$id $remote_addr [$time_local] $unix_timestamp "$request" $status "$http_user_agent" $request_time');

        parser.read(log_path, function (row) {
            console.log(row);
        }, function (err) {
            if (err) throw err;
            console.log('Done!')
        });

        return 'Not implemented';
    }
}
