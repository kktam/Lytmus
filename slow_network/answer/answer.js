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

var arrayProcessingTime = {};
var ans = [];               // solution to the question
var answerReady = false;

function processRequests(data, arr) {
    if (data == null) {
        console.log("data is null");
        return;
    }
    if (arr == null)  {
        console.log("arr is null");
         return;
     }

    //console.log("processing");

    if (data.request != null) {
        // parse request field
        var req = null;
        if (data.request.startsWith("GET ")) {
            req = data.request.substring(4, data.request.length - 1);
        } else {
            req = data.request;
        }

        // parse time field
        var time = null;
        if (data.request_time != null) {
            time = parseFloat(data.request_time);
        }

        // do not count record if we do not processing time
        // this will skew statistics
        // todo: may want to count how many records do not
        // have processing time in the samples
        if (time != null && isNaN(time) == false) {
            var record = arr[req];
            if (record != null){
                // update record
                record.time.push(time);
                record.sum += time;
                record.count += 1;
                arr[req] = record;
            }
            else {
                arr[req]= { time : [ time ] , sum : 0.0 , count : 0 };
            }
        }
    }

}

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
            //console.log(row);
            processRequests(row, arrayProcessingTime);
        }, function (err) {
            if (err) throw err;
            console.log('Done!');

            //console.log('array = ' + JSON.stringify(arrayProcessingTime));

            // calculate statistics
            var reqKeys = Object.keys(arrayProcessingTime);
            var results = [];
            reqKeys.forEach ( function (reqKey, index, arr) {
                var rec = arrayProcessingTime[reqKey];
                var avg = rec.sum / rec.count;
                arrayProcessingTime[reqKey] = rec;
                results.push({ request: rec.request, average : avg });
            });

            // display averages
            //console.log('averages = ' + JSON.stringify(results));
            results.sort(function (a, b) {
                return b.average - a.average;
            });
            console.log('averages = ' + JSON.stringify(results));

            // return the top 15 request with largest average process time
            for(var i = 0; i < Math.min(15, results.length); i++) {
                ans.push(results[i].request);
            }
            console.log('ans = ' + JSON.stringify(ans));

            // mark semaphore
            answerReady = true;
            return ans;
        });

        // wait for semaphore
        //while (answerReady == false) {
        //}

        //return ans;
    }

}
