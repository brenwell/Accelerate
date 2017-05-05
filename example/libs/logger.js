/**
 * private logger function
 * @param {string} s - the string to log
 */
export function log(s)
{
    /* eslint-disable no-console */
    console.log(s);
    /* eslint-enable no-console */
}
export function alertProblem(s)
{
    /* eslint-disable no-alert */
    alert(`THERE IS A PROBLEM\n  ${s}`);
    /* eslint-enable no-alert */
}

export function error(s)
{
    /* eslint-disable no-console */
    console.error(s);
    /* eslint-enable no-console */
}
