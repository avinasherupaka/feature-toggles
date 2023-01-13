/* eslint-disable no-cond-assign */
'use strict';

let jsonString = '';
process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
        jsonString += chunk;
    }
});
process.stdin.on('end', () => {
    console.log(
        JSON.parse(jsonString)
            .filter(parameter => parameter.ParameterKey === process.argv[2])
            .map(parameter => parameter.ParameterValue)[0]
    );
});
