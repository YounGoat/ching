/**
 * BI Sheng is a Chinese inventor who invented movable-type print during Song Dynasty.
 */

/**
 * @param  {string|buffer} template
 * @param  {object} data
 */
function transform(template, data) {
    let output = (template instanceof Buffer) ? template.toString('utf8') : template;
    for (var name in data) {
        let re = new RegExp(`\\$\\{${name}\\}`, 'gm');
        output = output.replace(re, data[name]);
    }
    return output;
};

module.exports = transform;