import app
from pytest import fixture
from chalice.test import Client


# create test client to be used as context manager (required when testing our REST API)
@fixture
def test_client():
    # code below will initialise the client with our Chalice application instance.
    with Client(app.app) as client:
        yield client


def test_municipalities_list(test_client):
    response = test_client.http.get("/municipality/municipalities-list")
    assert response.json_body == muni_list


muni_list = [
    {"municipality_id": "uMshwathi"},
    {"municipality_id": "Merafong City"},
    {"municipality_id": "Buffalo City Metropolitan"},
    {"municipality_id": "Impendle"},
    {"municipality_id": "Ephraim Mogale"},
    {"municipality_id": "Ingquza Hill"},
    {"municipality_id": "Umzimvubu"},
    {"municipality_id": "Madibeng"},
    {"municipality_id": "Ga-Segonyana"},
    {"municipality_id": "City of uMhlathuze"},
    {"municipality_id": "Mossel Bay"},
    {"municipality_id": "Emalahleni MP"},
    {"municipality_id": "Kamiesberg"},
    {"municipality_id": "Walter Sisulu"},
    {"municipality_id": "Dr JS Moroka"},
    {"municipality_id": "Nquthu"},
    {"municipality_id": "Amahlathi"},
    {"municipality_id": "Nelson Mandela Bay Metropolitan"},
    {"municipality_id": "Inkosi uMtubatuba"},
    {"municipality_id": "Maphumulo"},
    {"municipality_id": "Ngwathe"},
    {"municipality_id": "Oudtshoorn"},
    {"municipality_id": "Ubuntu"},
    {"municipality_id": "Nama Khoi"},
    {"municipality_id": "Steve Tshwete"},
    {"municipality_id": "Karoo Hoogland"},
    {"municipality_id": "Ubuhlebezwe"},
    {"municipality_id": "Inkosi Langalibalele"},
    {"municipality_id": "City of Mbombela"},
    {"municipality_id": "Joe Morolong"},
    {"municipality_id": "Mantsopa"},
    {"municipality_id": "Mogale City"},
    {"municipality_id": "Hantam"},
    {"municipality_id": "Ulundi"},
    {"municipality_id": "Alfred Duma"},
    {"municipality_id": "Bergrivier"},
    {"municipality_id": "Nketoana"},
    {"municipality_id": "Emfuleni"},
    {"municipality_id": "Laingsburg"},
    {"municipality_id": "Siyancuma"},
    {"municipality_id": "Msunduzi"},
    {"municipality_id": "uMfolozi"},
    {"municipality_id": "Mohokare"},
    {"municipality_id": "Cape Agulhas"},
    {"municipality_id": "Renosterberg"},
    {"municipality_id": "Naledi"},
    {"municipality_id": "Mpofana"},
    {"municipality_id": "Sundays River Valley"},
    {"municipality_id": "Kouga"},
    {"municipality_id": "uMlalazi"},
    {"municipality_id": "Sakhisizwe"},
    {"municipality_id": "Winnie Madikizela-Mandela"},
    {"municipality_id": "Dipaleseng"},
    {"municipality_id": "eMadlangeni"},
    {"municipality_id": "Lekwa"},
    {"municipality_id": "Emakhazeni"},
    {"municipality_id": "Collins Chabane"},
    {"municipality_id": "Masilonyana"},
    {"municipality_id": "Greater Tzaneen"},
    {"municipality_id": "Nkomazi"},
    {"municipality_id": "George"},
    {"municipality_id": "Dr Pixley Ka Isaka Seme"},
    {"municipality_id": "Newcastle"},
    {"municipality_id": "Molemole"},
    {"municipality_id": "Emalahleni EC"},
    {"municipality_id": "Big 5 Hlabisa"},
    {"municipality_id": "Thembisile Hani"},
    {"municipality_id": "Greater Kokstad"},
    {"municipality_id": "Elias Motsoaledi"},
    {"municipality_id": "Chief Albert Luthuli"},
    {"municipality_id": "Kopanong"},
    {"municipality_id": "Witzenberg"},
    {"municipality_id": "Port St Johns"},
    {"municipality_id": "Bushbuckridge"},
    {"municipality_id": "eThekwini Metropolitan"},
    {"municipality_id": "Moqhaka"},
    {"municipality_id": "City of Ekurhuleni Metropolitan"},
    {"municipality_id": "Rand West City"},
    {"municipality_id": "City of Tshwane Metropolitan"},
    {"municipality_id": "Makana"},
    {"municipality_id": "Richmond"},
    {"municipality_id": "Ndwedwe"},
    {"municipality_id": "Mkhambathini"},
    {"municipality_id": "Ngqushwa"},
    {"municipality_id": "Magareng"},
    {"municipality_id": "Greater Letaba"},
    {"municipality_id": "Khai-Ma"},
    {"municipality_id": "Matzikama"},
    {"municipality_id": "Bitou"},
    {"municipality_id": "Swartland"},
    {"municipality_id": "Maluti-A-Phofung"},
    {"municipality_id": "Nyandeni"},
    {"municipality_id": "Lephalale"},
    {"municipality_id": "Inxuba Yethemba"},
    {"municipality_id": "Ba-Phalaborwa"},
    {"municipality_id": "Lesedi"},
    {"municipality_id": "Kgetlengrivier"},
    {"municipality_id": "Kagisano-Molopo"},
    {"municipality_id": "Knysna"},
    {"municipality_id": "Mnquma"},
    {"municipality_id": "Theewaterskloof"},
    {"municipality_id": "Mandeni"},
    {"municipality_id": "Mhlontlo"},
    {"municipality_id": "Makhuduthamaga"},
    {"municipality_id": "Beaufort West"},
    {"municipality_id": "Blue Crane Route"},
    {"municipality_id": "uMsinga"},
    {"municipality_id": "uMngeni"},
    {"municipality_id": "Thulamela"},
    {"municipality_id": "Overstrand"},
    {"municipality_id": "Matatiele"},
    {"municipality_id": "Mbhashe"},
    {"municipality_id": "Govan Mbeki"},
    {"municipality_id": "Ramotshere Moiloa"},
    {"municipality_id": "Letsemeng"},
    {"municipality_id": "Koukamma"},
    {"municipality_id": "Mthonjaneni"},
    {"municipality_id": "Emthanjeni"},
    {"municipality_id": "Dr Nkosazana Dlamini Zuma"},
    {"municipality_id": "AbaQulusi"},
    {"municipality_id": "City of Cape Town Metropolitan"},
    {"municipality_id": "KwaDukuza"},
    {"municipality_id": "Endumeni"},
    {"municipality_id": "Nkandla"},
    {"municipality_id": "JB Marks"},
    {"municipality_id": "Ntabankulu"},
    {"municipality_id": "Dannhauser"},
    {"municipality_id": "Victor Khanye"},
    {"municipality_id": "Prince Albert"},
    {"municipality_id": "Greater Giyani"},
    {"municipality_id": "!Kheis"},
    {"municipality_id": "Jozini"},
    {"municipality_id": "Siyathemba"},
    {"municipality_id": "Musina"},
    {"municipality_id": "Bela-Bela"},
    {"municipality_id": "Dr Beyers Naude"},
    {"municipality_id": "Saldanha Bay"},
    {"municipality_id": "Mahikeng"},
    {"municipality_id": "Dikgatlong"},
    {"municipality_id": "Thabazimbi"},
    {"municipality_id": "Intsika Yethu"},
    {"municipality_id": "Kai !Garib"},
    {"municipality_id": "Tswelopele"},
    {"municipality_id": "Kannaland"},
    {"municipality_id": "Swellendam"},
    {"municipality_id": "Enoch Mgijima"},
    {"municipality_id": "Thembelihle"},
    {"municipality_id": "Makhado"},
    {"municipality_id": "Rustenburg"},
    {"municipality_id": "Moretele"},
    {"municipality_id": "Mkhondo"},
    {"municipality_id": "King Sabata Dalindyebo"},
    {"municipality_id": "Umuziwabantu"},
    {"municipality_id": "Lepelle-Nkumpi"},
    {"municipality_id": "City of Johannesburg Metropolitan"},
    {"municipality_id": "Okhahlamba"},
    {"municipality_id": "Ditsobotla"},
    {"municipality_id": "Matjhabeng"},
    {"municipality_id": "Great Kei"},
    {"municipality_id": "Tswaing"},
    {"municipality_id": "Dr AB Xuma"},
    {"municipality_id": "Ratlou"},
    {"municipality_id": "Blouberg"},
    {"municipality_id": "Hessequa"},
    {"municipality_id": "Kgatelopele"},
    {"municipality_id": "Drakenstein"},
    {"municipality_id": "Thaba Chweu"},
    {"municipality_id": "Langeberg"},
    {"municipality_id": "Stellenbosch"},
    {"municipality_id": "Nongoma"},
    {"municipality_id": "Nala"},
    {"municipality_id": "Cederberg"},
    {"municipality_id": "Phumelela"},
    {"municipality_id": "Senqu"},
    {"municipality_id": "Richtersveld"},
    {"municipality_id": "Sol Plaatje"},
    {"municipality_id": "Greater Taung"},
    {"municipality_id": "Midvaal"},
    {"municipality_id": "Lekwa-Teemane"},
    {"municipality_id": "Raymond Mhlaba"},
    {"municipality_id": "City of Matlosana"},
    {"municipality_id": "Mafube"},
    {"municipality_id": "Mamusa"},
    {"municipality_id": "Maruleng"},
    {"municipality_id": "Ndlambe"},
    {"municipality_id": "Umdoni"},
    {"municipality_id": "Elundini"},
    {"municipality_id": "Mogalakwena"},
    {"municipality_id": "Mangaung Metropolitan"},
    {"municipality_id": "Metsimaholo"},
    {"municipality_id": "Dawid Kruiper"},
    {"municipality_id": "Gamagara"},
    {"municipality_id": "Breede Valley"},
    {"municipality_id": "Modimolle-Mookgophong"},
    {"municipality_id": "Umzumbe"},
    {"municipality_id": "Ray Nkonyeni"},
    {"municipality_id": "Umsobomvu"},
    {"municipality_id": "uPhongolo"},
    {"municipality_id": "Tsantsabane"},
    {"municipality_id": "Dihlabeng"},
    {"municipality_id": "Msukaligwa"},
    {"municipality_id": "Umzimkhulu"},
    {"municipality_id": "eDumbe"},
    {"municipality_id": "Setsoto"},
    {"municipality_id": "Phokwane"},
    {"municipality_id": "Fetakgomo Tubatse"},
    {"municipality_id": "uMhlabuyalingana"},
    {"municipality_id": "Umvoti"},
    {"municipality_id": "Polokwane"},
    {"municipality_id": "Maquassi Hills"},
    {"municipality_id": "Tokologo"},
    {"municipality_id": "Moses Kotane"},
    {"municipality_id": "Kareeberg"},
]
