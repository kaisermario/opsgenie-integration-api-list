const fs = require('fs');
const {getConfiguredIntegrations} = require('./src/rest');
const {getApiKey} = require('./src/rest');

// #################### Configuration #####################
const opsgenieDomain = '<MY_OPSGENIE_DOMAIN>';
// ########################################################

(async function () {
    console.log(`list opsgenie integrations with api keys`)
    let hasMoreEntries = true;
    let counter = 0;
    let previousInsertedAt = '';
    let previousLastIntegrationName = '';
    let previousLastIntegrationType = '';
    var integrations = [];

    while (hasMoreEntries === true) {
        let jsonResult;
        if(counter === 0) {
            jsonResult = await getConfiguredIntegrations(opsgenieDomain, null, null, null);
        } else {
            jsonResult = await getConfiguredIntegrations(opsgenieDomain, previousInsertedAt, previousLastIntegrationName, previousLastIntegrationType);
        }
        previousInsertedAt = jsonResult.paging.insertedAt;
        previousLastIntegrationName = jsonResult.paging.name;
        previousLastIntegrationType = jsonResult.paging.type;
        hasMoreEntries = jsonResult.paging.name !== '';
        counter++;
        for (const item of jsonResult.integrations) {
            var ownerTeamName = 'not defined';
            const json = await getApiKey(opsgenieDomain, item.id, item.type);
            const apiKey = json.integration.apiKey;
            if(typeof item.ownerTeam !== 'undefined' && item.ownerTeam) {
                ownerTeamName = item.ownerTeam.name;
            }
            integrations.push(`id: ${item.id} / name: ${item.name} / ownerTeam: ${ownerTeamName} / apiKey: ${apiKey}`);
        }
    }
    console.log(integrations);
})().catch(console.error);
