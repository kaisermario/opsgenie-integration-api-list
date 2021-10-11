const fetch = require('node-fetch');
const fs = require("fs");

module.exports = async function getConfiguredIntegrations(opsgenieDomain, lastIntegrationInsertedAt, lastIntegrationName, lastIntegrationType) {

    const cookie = await fs.readFileSync(`./cookie.txt`);

    const headers = {
        "Cookie": cookie
    };

    let response;

    if(lastIntegrationInsertedAt !== null) {
        response = await fetch(
            `https://${opsgenieDomain}/webapi/integration/configured-integration-list?` + new URLSearchParams({
                lastIntegrationInsertedAt: lastIntegrationInsertedAt,
                lastIntegrationName: lastIntegrationName,
                lastIntegrationType: lastIntegrationType
            }),
            {
                method: 'GET',
                headers
            }
        );
        console.log(`response status code : ${response.status}`)
    } else {
        response = await fetch(
            `https://${opsgenieDomain}/webapi/integration/configured-integration-list`,
            {
                method: 'GET',
                headers
            }
        );
    }
    if (response.status === 200) {
        return await response.json();
    } else {
        console.log(`Status code: ${response.status} getConfiguredIntegrations`);
    }
};
