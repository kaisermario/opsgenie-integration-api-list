const fetch = require('node-fetch');
const fs = require('fs');

module.exports = async function getApiKey(opsgenieDomain, integrationId, integrationType) {

    const cookie = await fs.readFileSync(`./cookie.txt`);

    const headers = {
        "Cookie": cookie
    };

    let response;
    const url = `https://${opsgenieDomain}/webapi/v1/integrations/${integrationType}Integration/update?`;
    console.log(url);
    console.log(`integrationId : ${integrationId}:${integrationType}`)

    response = await fetch(
        url + new URLSearchParams({
            id: integrationId,
        }),
        {
            method: 'GET',
            headers
        }
    );

    if (response.status === 200) {
        return await response.json();
    } else {
        console.log(`Status code: ${response.status} getApiKey`);
    }
};
