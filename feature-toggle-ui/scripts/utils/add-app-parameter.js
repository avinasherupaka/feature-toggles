/* eslint-disable no-console */
let jsonString = "";
process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
        jsonString += chunk;
    }
});
process.stdin.on('end', () => {
    const parameterJson = JSON.parse(jsonString)
    parameterJson.push({
        ParameterKey: process.argv[2],
        ParameterValue: process.argv[3]
    });

    console.log(JSON.stringify(parameterJson, null, 2));
});