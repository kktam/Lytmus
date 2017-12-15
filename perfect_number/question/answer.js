/**
 * Write your solution in this file.
 *
 * You can execute and test your answer by either pressing 'Try Answer' in the side panel,
 * or by running `node test_answer.js <test_case_path>` on the command line.
 * For example:
 *      node test_answer.js inputs/divide_by_zero.json
 *
 * You can organize your code as you wish (eg, use auxiliary files) as long as `test_answer.js`
 * produces the expected output.
 */
'use strict';

module.exports = {

    /**
     * Returns an integer denoting the number of perfect numbers less than or equal to input.
     *
     * This method declaration must be kept unmodified.
     *
     * @param input an integer
     * @return an integer
     */
    answer: function(input) {
        var count = 0;
        for(var i = 0; i <= input; i++) {
            if(this.isPerfect(i)) {
                count += 1;
            }
        }
        return count;
    },

    /**
     * Returns a boolean value denoting whether the input is a perfect number or not.
     *
     * @param input an integer
     * @return true if input is a perfect number, false otherwise
     */
    isPerfect: function(input) {
        var divsrs = [];
        this.getDivisors(input, divsrs);

        var is_perfect = false;
        var sum = 0;
        for (var i =0; i < 500; i++) {
            sum += divsrs[i];
        }
        if ( sum == input) {
            is_perfect = true;
        }

        return is_perfect;
    },


    getDivisors: function(input, divsr) {
        var index = 0;
        for (var j = 0; j < input; j++) {
            if ((input / j) * j == input) {
                divsr[index++] = j;
            }
        }
    },
};
