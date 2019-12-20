from urllib.request import urlretrieve
from pathlib import Path
from tqdm import tqdm
import pandas as pd

states = [
"AL",
"AK",
"AZ",
"AR",
"CA",
"CO",
"CT",
"DE",
"FL",
"GA",
"HI",
"ID",
"IL",
"IN",
"IA",
"KS",
"KY",
"LA",
"ME",
"MD",
"MA",
"MI",
"MN",
"MS",
"MO",
"MT",
"NE",
"NV",
"NH",
"NJ",
"NM",
"NY",
"NC",
"ND",
"OH",
"OK",
"OR",
"PA",
"RI",
"SC",
"SD",
"TN",
"TX",
"UT",
"VT",
"VA",
"WA",
"WV",
"WI",
"WY"
]


base_geo_top_five_industries = "https://data.epa.gov/efservice/v_tri_state_industries/st/{}/data_set/INFO/year/2017/CSV"
base_disposal_releases = "https://data.epa.gov/efservice/v_tri_state_onsite_releases/st/{}/data_set/INFO/year/%3E/2004/CSV"
base_top_five_chems = 'https://data.epa.gov/efservice/v_tri_state_chemicals/st/{}/data_set/INFO/year/2017/CSV'
base_facility_list = 'https://data.epa.gov/efservice/MV_TRI_BASIC_DOWNLOAD/st/{}/year/2017/CSV'
base_path = Path("TRI/")
base_path.mkdir(exist_ok=True)

top_five_industries = pd.DataFrame()
disposal_releases = pd.DataFrame()
top_five_chems = pd.DataFrame()
facilities = pd.DataFrame()
for state in tqdm(states):
    state_path = (base_path / state)
    state_path.mkdir(exist_ok=True)
    
    urlretrieve(base_geo_top_five_industries.format(state), state_path / 'top_five_industries.csv' )
    urlretrieve(base_disposal_releases.format(state), state_path / 'disposal.csv' )
    urlretrieve(base_top_five_chems.format(state), state_path / 'top_five_chems.csv' )
    urlretrieve(base_facility_list.format(state), state_path / 'facilities.csv' )
    
    top_five_industries = top_five_industries.append(pd.read_csv(state_path / 'top_five_industries.csv'))
    disposal_releases = top_five_industries.append(pd.read_csv(state_path / 'disposal.csv'))
    top_five_chems = top_five_chems.append(pd.read_csv(state_path / 'top_five_chems.csv'))
    facilities = facilities.append(pd.read_csv(state_path / 'facilities.csv'))

top_five_industries.to_csv("industries.csv")
disposal_releases.to_csv("disposals.csv")
disposal_releases.to_csv("chems.csv")
disposal_releases.to_csv("facilities.csv")
