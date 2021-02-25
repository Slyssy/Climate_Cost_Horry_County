import json
import requests
import pprint

horry_county_fips = 45051
# token =	CrdIwVWgUIOOrVUiCYuiqYnEUgywOrdI

# data = requests.get(
#     "https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?locationid=FIPS:45051", headers={"token":"CrdIwVWgUIOOrVUiCYuiqYnEUgywOrdI"}
# ).json()

# pprint.pprint(data)


# datasets?stationid=COOP:310090&stationid=COOP:310184&stationid=COOP:310212&stationid=COOP:385306&stationid=COOP:386153&stationid=COOP:386158&stationid=COOP:386163&stationid=COOP:38630&stationid=GHCND:US1SCHR0003&stationid=GHCND:US1SCHR0007&stationid=GHCND:US1SCHR001&stationid=GHCND:US1SCHR0013&stationid=GHCND:US1SCHR0014&stationid=GHCND:US1SCHR0015&stationid=GHCND:US1SCHR0018&stationid=GHCND:US1SCHR0019&stationid=GHCND:US1SCHR0020&stationid=GHCND:US1SCHR0027&stationid=GHCND:US1SCHR0030&stationid=GHCND:US1SCHR0032&stationid=GHCND:US1SCHR0033&stationid=GHCND:US1SCHR0039&stationid=GHCND:US1SCHR0041&stationid=GHCND:US1SCHR0042&stationid=GHCND:US1SCHR0046&stationid=GHCND:US1SCHR0053
data_GHCND_US1SCHR0003_2010 = requests.get(
    "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&datacategories/PRCP&stationid=GHCND:US1SCHR0003&units=standard&startdate=2010-01-01&enddate=2010-12-31&limit=1000", headers={"token":"CrdIwVWgUIOOrVUiCYuiqYnEUgywOrdI"}
).json()
# "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:USC00010008&units=standard&startdate=2010-05-01&enddate=2010-05-31"
pprint.pprint(data_GHCND_US1SCHR0003_2010)

# hotels = requests.get(
#     "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
#     params={
#         "key": g_key,
#         "location": lat_lon_list[17],
#         "radius": "5000",
#         "type": "lodging",
#     },
# ).json()