# dariah-marketplace-api

The plugin fetches the https://marketplace-api.sshopencloud.eu/api/ to get the actual Core and Community services for Dariah.

### Data Update
By default the code is creating a json file (api-data.json), the WP plugin is fetching this to display the services. After 7days of the file creation the plugin is refetching the data and regenerate the json file.
But if you have to do an urgent update then simply call the https://www.dariah.eu/tools-services/tools-and-services/?update and it will fetch and update the file.
