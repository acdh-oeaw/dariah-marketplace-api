# dariah-marketplace-api

The plugin fetches the https://marketplace-api.sshopencloud.eu/api/ to get the actual Core and Community services for Dariah.

### Data Update
By default the code is creating a json file (api-data.json), the WP plugin is fetching this to display the services. After 7days of the file creation the plugin is refetching the data and regenerate the json file.
But if you have to do an urgent update then simply call the https://www.dariah.eu/tools-services/tools-and-services/?update and it will fetch and update the file.

### INSTALL
modify the config.ini file:
apiBaseUrl -> The marketplace base url, like: https://marketplace-api.sshopencloud.eu/api/
apiOverview -> The marketplace url for the overview page, like: 'item-search?categories=tool-or-service&f.keyword=DARIAH Resource&order=label'
apiOverviewCore -> The marketplace url for the core page, like: 'item-search?categories=tool-or-service&f.keyword=DARIAH Core Service&order=label'
apiDetail -> The marketplace url for the selected service detail page, like: tools-services/
wpBaseUrl -> The wordpress page base url
wpListPage -> The wordpress DH plugin List page to display the API result, like: tools-and-services/
wpDetailPage-> The wordpress DH plugin detail page, where the selected service detail data will be displed, like: tools-services-detail-view/
wpUpdatePage -> The wordpress DH plugin update page like: tools-and-services/?update


### CUSTOMIZE LAYOUT
## List Page:
Tabs: ul class=dh-tabs
Tabs description: class=dh-tab-description
Tab Content: class=dh-tab-content

Right side filters div: class=dhma-search-field-two

