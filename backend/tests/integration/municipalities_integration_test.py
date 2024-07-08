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
    {"municipality_id": "Mafube Local"},
    {"municipality_id": "Pixley Ka Seme District"},
    {"municipality_id": "Richmond Local"},
    {"municipality_id": "ZF Mgcawu District"},
    {"municipality_id": "Mkhondo Local"},
    {"municipality_id": "Gert Sibande District"},
    {"municipality_id": "Mnquma Local"},
    {"municipality_id": "Stellenbosch Local"},
    {"municipality_id": "Big 5 Hlabisa Local"},
    {"municipality_id": "Buffalo City Metropolitan"},
    {"municipality_id": "Garden Route District"},
    {"municipality_id": "Beaufort West Local"},
    {"municipality_id": "Dawid Kruiper Local"},
    {"municipality_id": "Kgetlengrivier Local"},
    {"municipality_id": "Great Kei Local"},
    {"municipality_id": "Kannaland Local"},
    {"municipality_id": "Mthonjaneni Local"},
    {"municipality_id": "Ratlou Local"},
    {"municipality_id": "Tswaing Local"},
    {"municipality_id": "Nquthu Local"},
    {"municipality_id": "Dikgatlong Local"},
    {"municipality_id": "West Coast District"},
    {"municipality_id": "Central Karoo District"},
    {"municipality_id": "Walter Sisulu Local"},
    {"municipality_id": "Dr Beyers Naud  Local"},
    {"municipality_id": "Siyancuma Local"},
    {"municipality_id": "Harry Gwala District"},
    {"municipality_id": "Mohokare Local"},
    {"municipality_id": "Ngwathe Local"},
    {"municipality_id": "Overberg District"},
    {"municipality_id": "Nketoana Local"},
    {"municipality_id": "Modimolle-Mookgophong Local"},
    {"municipality_id": "Amahlathi Local"},
    {"municipality_id": "Dr Kenneth Kaunda District"},
    {"municipality_id": "Endumeni Local"},
    {"municipality_id": "West Rand District"},
    {"municipality_id": "Nelson Mandela Bay Metropolitan"},
    {"municipality_id": "uThukela District"},
    {"municipality_id": "Steve Tshwete Local"},
    {"municipality_id": "Port St Johns Local"},
    {"municipality_id": "Kagisano-Molopo Local"},
    {"municipality_id": "Mhlontlo Local"},
    {"municipality_id": "Thabo Mofutsanyana District"},
    {"municipality_id": "King Sabata Dalindyebo Local"},
    {"municipality_id": "Overstrand Local"},
    {"municipality_id": "Nkangala District"},
    {"municipality_id": "Ndwedwe Local"},
    {"municipality_id": "uMhlabuyalingana Local"},
    {"municipality_id": "Cape Winelands District"},
    {"municipality_id": "eDumbe Local"},
    {"municipality_id": "uMzinyathi District"},
    {"municipality_id": "Thabazimbi Local"},
    {"municipality_id": "City of Mbombela Local"},
    {"municipality_id": "Polokwane Local"},
    {"municipality_id": "Umuziwabantu Local"},
    {"municipality_id": "Amathole District"},
    {"municipality_id": "Frances Baard District"},
    {"municipality_id": "Thembisile Hani Local"},
    {"municipality_id": "Gamagara Local"},
    {"municipality_id": "Emfuleni Local"},
    {"municipality_id": "Phumelela Local"},
    {"municipality_id": "Lekwa-Teemane Local"},
    {"municipality_id": "Molemole Local"},
    {"municipality_id": "Breede Valley Local"},
    {"municipality_id": "Cederberg Local"},
    {"municipality_id": "Dr JS Moroka Local"},
    {"municipality_id": "eMadlangeni Local"},
    {"municipality_id": "Msukaligwa Local"},
    {"municipality_id": "Mamusa Local"},
    {"municipality_id": "uMshwathi Local"},
    {"municipality_id": "Richtersveld Local"},
    {"municipality_id": "Ntabankulu Local"},
    {"municipality_id": "Victor Khanye Local"},
    {"municipality_id": "uMgungundlovu District"},
    {"municipality_id": "Khai-Ma Local"},
    {"municipality_id": "Sol Plaatje Local"},
    {"municipality_id": "City of Matlosana Local"},
    {"municipality_id": "Cape Agulhas Local"},
    {"municipality_id": "Nkandla Local"},
    {"municipality_id": "Thaba Chweu Local"},
    {"municipality_id": "Maquassi Hills Local"},
    {"municipality_id": "Nala Local"},
    {"municipality_id": "Makana Local"},
    {"municipality_id": "Maphumulo Local"},
    {"municipality_id": "Moses Kotane Local"},
    {"municipality_id": "Lepelle-Nkumpi Local"},
    {"municipality_id": "Chief Albert Luthuli Local"},
    {"municipality_id": "Intsika Yethu Local"},
    {"municipality_id": "Tsantsabane Local"},
    {"municipality_id": "eThekwini Metropolitan"},
    {"municipality_id": "Ramotshere Moiloa Local"},
    {"municipality_id": "Musina Local"},
    {"municipality_id": "Makhado Local"},
    {"municipality_id": "Ray Nkonyeni Local"},
    {"municipality_id": "Elundini Local"},
    {"municipality_id": "City of Ekurhuleni Metropolitan"},
    {"municipality_id": "City of Tshwane Metropolitan"},
    {"municipality_id": "Greater Kokstad Local"},
    {"municipality_id": "!Kheis Local"},
    {"municipality_id": "Umvoti Local"},
    {"municipality_id": "Raymond Mhlaba Local"},
    {"municipality_id": "Dr Pixley Ka Isaka Seme Local"},
    {"municipality_id": "uMlalazi Local"},
    {"municipality_id": "JB Marks Local"},
    {"municipality_id": "Nongoma Local"},
    {"municipality_id": "Joe Morolong Local"},
    {"municipality_id": "Elias Motsoaledi Local"},
    {"municipality_id": "Collins Chabane Local"},
    {"municipality_id": "Enoch Mgijima Local"},
    {"municipality_id": "Ngaka Modiri Molema District"},
    {"municipality_id": "Mogalakwena Local"},
    {"municipality_id": "KwaDukuza Local"},
    {"municipality_id": "John Taolo Gaetsewe District"},
    {"municipality_id": "Blue Crane Route Local"},
    {"municipality_id": "Dr AB Xuma Local"},
    {"municipality_id": "Sakhisizwe Local"},
    {"municipality_id": "Witzenberg Local"},
    {"municipality_id": "Makhuduthamaga Local"},
    {"municipality_id": "Alfred Duma Local"},
    {"municipality_id": "Mossel Bay Local"},
    {"municipality_id": "Nama Khoi Local"},
    {"municipality_id": "Nkomazi Local"},
    {"municipality_id": "Ba-Phalaborwa Local"},
    {"municipality_id": "Langeberg Local"},
    {"municipality_id": "City of uMhlathuze Local"},
    {"municipality_id": "Moqhaka Local"},
    {"municipality_id": "Ephraim Mogale Local"},
    {"municipality_id": "Magareng Local"},
    {"municipality_id": "Maluti-A-Phofung Local"},
    {"municipality_id": "Nyandeni Local"},
    {"municipality_id": "King Cetshwayo District"},
    {"municipality_id": "Umzimvubu Local"},
    {"municipality_id": "Dr Nkosazana Dlamini Zuma Local"},
    {"municipality_id": "Metsimaholo Local"},
    {"municipality_id": "Jozini Local"},
    {"municipality_id": "Bitou Local"},
    {"municipality_id": "Mopani District"},
    {"municipality_id": "Tokologo Local"},
    {"municipality_id": "Thembelihle Local"},
    {"municipality_id": "Merafong City Local"},
    {"municipality_id": "AbaQulusi Local"},
    {"municipality_id": "Matjhabeng Local"},
    {"municipality_id": "Kamiesberg Local"},
    {"municipality_id": "City of Cape Town Metropolitan"},
    {"municipality_id": "George Local"},
    {"municipality_id": "Zululand District"},
    {"municipality_id": "Inkosi uMtubatuba Local"},
    {"municipality_id": "Ubuntu Local"},
    {"municipality_id": "uMfolozi Local"},
    {"municipality_id": "Ditsobotla Local"},
    {"municipality_id": "Dipaleseng Local"},
    {"municipality_id": "uMsinga Local"},
    {"municipality_id": "Midvaal Local"},
    {"municipality_id": "Emalahleni Local EC"},
    {"municipality_id": "Rand West City Local"},
    {"municipality_id": "Kgatelopele Local"},
    {"municipality_id": "Okhahlamba Local"},
    {"municipality_id": "Bela-Bela Local"},
    {"municipality_id": "Mkhambathini Local"},
    {"municipality_id": "Kareeberg Local"},
    {"municipality_id": "Umzimkhulu Local"},
    {"municipality_id": "Mahikeng Local"},
    {"municipality_id": "uPhongolo Local"},
    {"municipality_id": "Umsobomvu Local"},
    {"municipality_id": "Mbhashe Local"},
    {"municipality_id": "Lejweleputswa District"},
    {"municipality_id": "Bergrivier Local"},
    {"municipality_id": "Thulamela Local"},
    {"municipality_id": "Sedibeng District"},
    {"municipality_id": "Karoo Hoogland Local"},
    {"municipality_id": "Namakwa District"},
    {"municipality_id": "Alfred Nzo District"},
    {"municipality_id": "uMkhanyakude District"},
    {"municipality_id": "Matatiele Local"},
    {"municipality_id": "Tswelopele Local"},
    {"municipality_id": "Renosterberg Local"},
    {"municipality_id": "Dr Ruth Segomotsi Mompati District"},
    {"municipality_id": "City of Johannesburg Metropolitan"},
    {"municipality_id": "Ndlambe Local"},
    {"municipality_id": "Phokwane Local"},
    {"municipality_id": "Knysna Local"},
    {"municipality_id": "Sarah Baartman District"},
    {"municipality_id": "Dannhauser Local"},
    {"municipality_id": "Kouga Local"},
    {"municipality_id": "Bojanala Platinum District"},
    {"municipality_id": "Ngqushwa Local"},
    {"municipality_id": "Impendle Local"},
    {"municipality_id": "Mogale City Local"},
    {"municipality_id": "Lekwa Local"},
    {"municipality_id": "Kai !Garib Local"},
    {"municipality_id": "Sundays River Valley Local"},
    {"municipality_id": "Winnie Madikizela-Mandela Local"},
    {"municipality_id": "Rustenburg Local"},
    {"municipality_id": "Moretele Local"},
    {"municipality_id": "Greater Letaba Local"},
    {"municipality_id": "Xhariep District"},
    {"municipality_id": "Bushbuckridge Local"},
    {"municipality_id": "Msunduzi Local"},
    {"municipality_id": "Greater Tzaneen Local"},
    {"municipality_id": "Masilonyana Local"},
    {"municipality_id": "Hessequa Local"},
    {"municipality_id": "Oudtshoorn Local"},
    {"municipality_id": "Emakhazeni Local"},
    {"municipality_id": "Dihlabeng Local"},
    {"municipality_id": "Umdoni Local"},
    {"municipality_id": "Chris Hani District"},
    {"municipality_id": "Sekhukhune District"},
    {"municipality_id": "Greater Giyani Local"},
    {"municipality_id": "Ga-Segonyana Local"},
    {"municipality_id": "Ubuhlebezwe Local"},
    {"municipality_id": "Inxuba Yethemba Local"},
    {"municipality_id": "Siyathemba Local"},
    {"municipality_id": "Maruleng Local"},
    {"municipality_id": "Setsoto Local"},
    {"municipality_id": "iLembe District"},
    {"municipality_id": "Madibeng Local"},
    {"municipality_id": "Newcastle Local"},
    {"municipality_id": "Waterberg District"},
    {"municipality_id": "Amajuba District"},
    {"municipality_id": "Kopanong Local"},
    {"municipality_id": "Mandeni Local"},
    {"municipality_id": "Naledi Local"},
    {"municipality_id": "Capricorn District"},
    {"municipality_id": "Vhembe District"},
    {"municipality_id": "Joe Gqabi District"},
    {"municipality_id": "Mangaung Metropolitan"},
    {"municipality_id": "Lesedi Local"},
    {"municipality_id": "Ehlanzeni District"},
    {"municipality_id": "Lephalale Local"},
    {"municipality_id": "Ulundi Local"},
    {"municipality_id": "Ingquza Hill Local"},
    {"municipality_id": "Laingsburg Local"},
    {"municipality_id": "Letsemeng Local"},
    {"municipality_id": "Matzikama Local"},
    {"municipality_id": "Emthanjeni Local"},
    {"municipality_id": "Hantam Local"},
    {"municipality_id": "Theewaterskloof Local"},
    {"municipality_id": "Ugu District"},
    {"municipality_id": "Emalahleni Local MP"},
    {"municipality_id": "Blouberg Local"},
    {"municipality_id": "Greater Taung Local"},
    {"municipality_id": "OR Tambo District"},
    {"municipality_id": "Senqu Local"},
    {"municipality_id": "Saldanha Bay Local"},
    {"municipality_id": "uMngeni Local"},
    {"municipality_id": "Fetakgomo Tubatse Local"},
    {"municipality_id": "Fezile Dabi District"},
    {"municipality_id": "Swartland Local"},
    {"municipality_id": "Mpofana Local"},
    {"municipality_id": "Koukamma Local"},
    {"municipality_id": "Mantsopa Local"},
    {"municipality_id": "Umzumbe Local"},
    {"municipality_id": "Prince Albert Local"},
    {"municipality_id": "Govan Mbeki Local"},
    {"municipality_id": "Swellendam Local"},
    {"municipality_id": "Drakenstein Local"},
    {"municipality_id": "Inkosi Langalibalele Local"},
]
